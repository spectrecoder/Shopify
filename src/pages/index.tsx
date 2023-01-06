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
  const { data: items } = trpc.item.all.useQuery(undefined, {
    onSuccess: (data) => {
      const categories = data.map((d) => ({ label: d.name, value: d.name }))
      queryClient.setQueryData(["categories"], categories)
    },
    enabled: !!userSession,
  })

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
