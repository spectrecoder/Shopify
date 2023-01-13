import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"
import { BsCalendarDate, BsChevronRight } from "react-icons/bs"
import SuperJSON from "superjson"
import { createContextInner } from "../../server/context"
import { appRouter } from "../../server/routers/_app"
import { trpc } from "../../utils/trpc"
import { useMemo } from "react"
import { formatDate, formateDateTwo } from "../../utils/utilityFunctions"
import Link from "next/link"

// t4UR3b5haZ6em8CmB55-UUZMp9CwM2Ujd_-96xXj3oSOEN0NXR - secret
// SDFQSThXWTBoRE03QUstN3Jjd1o6MTpjaQ - client

export default function history({
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    data: usersLists,
    isLoading,
    isError,
  } = trpc.list.allLists.useQuery(undefined, {
    enabled: !!userSession,
  })

  const filteredLists = useMemo(() => {
    if (!usersLists) return

    const filtered: { [key: string]: typeof usersLists } = {}

    usersLists.forEach((i) => {
      if (i.status !== "ONGOING") {
        const formattedDate = formatDate(i.createdAt)
        if (formattedDate in filtered) {
          filtered[formattedDate] = [...filtered[formattedDate], i]
        } else {
          filtered[formattedDate] = [i]
        }
      }
    })

    return Object.entries(filtered)
  }, [usersLists])

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Something went wrong. Please try again later</h1>

  return (
    <>
      <h1 className="capitalize text-[#34333A] font-bold text-4xl mb-16">
        shopping history
      </h1>

      <div className="mb-20">
        {filteredLists &&
          filteredLists.map((l) => (
            <>
              <p className="text-xl font-semibold text-black mb-7">{l[0]}</p>
              {l[1].map((list) => (
                <div className="flex items-center justify-between px-8 bg-white py-9 rounded-2xl shadow1 mb-11">
                  <span className="text-2xl font-semibold text-black capitalize">
                    {list.listName}
                  </span>

                  <div className="flex items-center">
                    <div className="date flex items-center gap-x-5 text-[#C1C1C4] mr-10">
                      <BsCalendarDate className="h-8 w-7" />
                      <span className="text-xl font-semibold">
                        {formateDateTwo(list.createdAt)}
                      </span>
                    </div>
                    <span
                      className={`${
                        list.status === "COMPLETED"
                          ? "text-[#56CCF2] border-[#56CCF2]"
                          : "text-[#EB5757] border-[#EB5757]"
                      } mr-[3.3rem] text-xl border border-solid rounded-xl w-32 h-10 flex items-center justify-center font-semibold`}
                    >
                      {list.status.toLocaleLowerCase()}
                    </span>
                    <Link href={`/history/${list.id}`}>
                      <BsChevronRight className="text-3xl text-main-orange" />
                    </Link>
                  </div>
                </div>
              ))}
            </>
          ))}
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userSession = await getSession(context)

  if (!userSession) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    }
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: userSession }),
    transformer: SuperJSON,
  })

  await ssg.list.allLists.prefetch()

  return { props: { userSession, trpcState: ssg.dehydrate() } }
}
