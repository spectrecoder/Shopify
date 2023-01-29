import { useQueryClient } from "@tanstack/react-query"
import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { useMemo, ReactElement } from "react"
import { BsCalendarDate } from "react-icons/bs"
import { HiOutlineArrowNarrowLeft } from "react-icons/hi"
import SuperJSON from "superjson"
import Layout from "../../components/layouts/Layout"
import { createContextInner } from "../../server/context"
import { appRouter } from "../../server/routers/_app"
import { ActiveListItem } from "../../types/types"
import { trpc } from "../../utils/trpc"
import { formateDateTwo, formateListItems } from "../../utils/utilityFunctions"

export default function HistoryPage({
  userSession,
  listId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    data: singleList,
    isLoading,
    isError,
    isRefetching,
    isRefetchError,
  } = trpc.list.singleList.useQuery(listId, {
    enabled: !!userSession,
    refetchOnMount: true,
  })
  const queryClient = useQueryClient()

  // TODO: Have to format the list items
  const filteredItems = useMemo(() => {
    if (!singleList) return
    return formateListItems(singleList.listItems as ActiveListItem[])
  }, [singleList])

  if (singleList === null) return <h1>List {"doesn't"} exist</h1>
  if (isLoading || isRefetching) return <h1>Loading...</h1>
  if (isError || isRefetchError)
    return <h1>Something went wrong. Please try again later!!!</h1>

  return (
    <>
      <Link href="/history">
        <button className="flex items-center text-2xl font-bold text-main-orange gap-x-2 mb-14">
          <HiOutlineArrowNarrowLeft />
          back
        </button>
      </Link>

      <h1 className="capitalize text-[#34333A] font-bold text-4xl mb-8">
        {singleList.listName}
      </h1>

      <div className="date flex items-center gap-x-5 text-[#C1C1C4] mr-10 mb-20">
        <BsCalendarDate className="h-8 w-7" />
        <span className="text-xl font-semibold">
          {formateDateTwo(singleList.createdAt)}
        </span>
      </div>

      {!singleList.listItems.length && (
        <h1 className="text-2xl font-medium text-main-orange">
          You have deleted this {"list's"} item
        </h1>
      )}

      {filteredItems && filteredItems.length
        ? filteredItems.map((c, i) => (
            <div key={i} className="mb-20">
              <h2 className="text-3xl font-semibold text-black mb-7">{c[0]}</h2>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 sm:grid-cols-3">
                {c[1].map((i) => (
                  <button
                    key={i.id}
                    onClick={() => {
                      queryClient.setQueryData(["currentItem"], {
                        categoryId: i.item.category?.id,
                        categoryName: i.item.category?.name,
                        itemId: i.item.id,
                        itemName: i.item.name,
                        note: i.item.note,
                        image: i.item.image,
                        show: false,
                      })
                      queryClient.setQueryData(["currentMenu"], "Details")
                      queryClient.setQueryData(["showMenu"], true)
                    }}
                    className="h-fit leading-8 text-left flex gap-x-4 justify-between w-full px-6 py-[1.3rem] rounded-2xl bg-white shadow1 text-black text-2xl font-semibold"
                  >
                    {i.item.name}{" "}
                    <span className="text-xl font-medium text-main-orange">
                      {i.quantity} pcs
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        : null}
    </>
  )
}

HistoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userSession = await getSession(context)

  if (context.params === undefined) {
    return {
      notFound: true,
    }
  }

  if (!userSession) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: { listId: context.params.id as string },
    }
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: userSession }),
    transformer: SuperJSON,
  })

  await ssg.list.singleList.prefetch(context.params.id as string)
  // console.log(context.params?.id)

  return {
    props: {
      userSession,
      trpcState: ssg.dehydrate(),
      listId: context.params.id as string,
    },
  }
}
