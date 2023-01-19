import { trpc } from "../../utils/trpc"

export default function TopItems() {
  const { data, isLoading, isError } = trpc.listItem.topListItems.useQuery(
    undefined,
    {
      refetchOnMount: true,
    }
  )

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Something went wrong. Please try again later</h1>

  return (
    <div className="h-fit">
      <h3 className="text-4xl font-semibold text-black mb-14">Top Items</h3>
      {data &&
        data.map((i) => (
          <div key={i.id} className="mb-11">
            <p className="text-black font-semibold text-2xl mb-4">{i.name}</p>
            <progress
              className="progress progress-warning w-full"
              value={i.percentage}
              max="100"
            ></progress>
          </div>
        ))}
    </div>
  )
}
