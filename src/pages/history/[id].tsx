import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"
import { BsCalendarDate } from "react-icons/bs"
import { HiOutlineArrowNarrowLeft } from "react-icons/hi"
import SuperJSON from "superjson"
import CategoryItems from "../../components/layouts/CategoryItems"
import { createContextInner } from "../../server/context"
import { appRouter } from "../../server/routers/_app"
import { trpc } from "../../utils/trpc"
import { formateListItems } from "../../utils/utilityFunctions"
import { useMemo } from "react"

export default function history({
  userSession,
  listId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    data: singleList,
    isLoading,
    isError,
  } = trpc.list.singleList.useQuery(listId, {
    enabled: !!userSession,
  })

  // const filteredItems = useMemo(() => {
  //   if (!singleList) return
  //   return formateListItems(singleList.listItems)
  // }, [singleList])

  if (singleList === null) return <h1>List doesn't exist</h1>
  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Something went wrong. Please try again later!!!</h1>

  return (
    <>
      <button className="text-main-orange text-2xl flex items-center gap-x-2 font-bold mb-14">
        <HiOutlineArrowNarrowLeft />
        back
      </button>

      <h1 className="capitalize text-[#34333A] font-bold text-4xl mb-8">
        eero's farewell party
      </h1>

      <div className="date flex items-center gap-x-5 text-[#C1C1C4] mr-10 mb-20">
        <BsCalendarDate className="h-8 w-7" />
        <span className="text-xl font-semibold">Mon 27.8.2022</span>
      </div>

      {/* <CategoryItems />
      <CategoryItems /> */}
    </>
  )
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
