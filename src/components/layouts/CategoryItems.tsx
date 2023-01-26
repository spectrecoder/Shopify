import { QueryClient } from "@tanstack/react-query"
import { AiOutlinePlus } from "react-icons/ai"
import type { RouterOutput } from "../../server/trpc"

interface Props {
  item: RouterOutput["item"]["all"][number]
  queryClient: QueryClient
}

export default function CategoryItems({ item, queryClient }: Props) {
  return (
    <div className="mb-20">
      <h2 className="text-3xl font-semibold text-black mb-7">{item.name}</h2>

      <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-8">
        {item.items.map((i) => (
          <button
            key={i.id}
            onClick={() => {
              queryClient.setQueryData(["currentItem"], {
                categoryId: item.id,
                categoryName: item.name,
                itemId: i.id,
                itemName: i.name,
                note: i.note,
                image: i.image,
                show: true,
              })
              queryClient.setQueryData(["currentMenu"], "Details")
              queryClient.setQueryData(["showMenu"], true)
            }}
            className="h-fit leading-8 text-left flex gap-x-4 justify-between w-full px-6 py-[1.3rem] rounded-2xl bg-white shadow1 text-black text-2xl font-semibold"
          >
            {i.name} <AiOutlinePlus className="text-[#C1C1C4] text-3xl" />
          </button>
        ))}
      </div>
    </div>
  )
}
