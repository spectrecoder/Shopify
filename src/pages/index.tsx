import CategoryItems from "../components/layouts/CategoryItems"
import HeaderPart from "../components/itemPage/HeaderPart"
import { getSession } from "next-auth/react"
import {
  GetServerSidePropsContext,
  GetStaticPropsContext,
  NextPageContext,
  InferGetServerSidePropsType,
} from "next"
import { trpc } from "../utils/trpc"
import { Session } from "next-auth"
import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { appRouter } from "../server/routers/_app"
import SuperJSON from "superjson"
import { createContext, createContextInner } from "../server/context"
import type { NextApiRequest, NextApiResponse } from "next"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

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
