import { useQueryClient } from "@tanstack/react-query"
import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"
import SuperJSON from "superjson"
import HeaderPart from "../components/itemPage/HeaderPart"
import CategoryItems from "../components/layouts/CategoryItems"
import { createContextInner } from "../server/context"
import { appRouter } from "../server/routers/_app"
import { trpc } from "../utils/trpc"

export default function Home({
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const queryClient = useQueryClient()
  const {
    data: items,
    isLoading,
    isError,
  } = trpc.item.all.useQuery(undefined, {
    enabled: !!userSession,
  })

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Something went wrong. Please try again later</h1>

  return (
    <>
      <HeaderPart />
      {items?.map((i) =>
        i.items.length ? (
          <CategoryItems key={i.id} item={i} queryClient={queryClient} />
        ) : null
      )}
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

  await ssg.item.all.prefetch()

  return { props: { userSession, trpcState: ssg.dehydrate() } }
}
