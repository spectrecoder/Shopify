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

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data: items } = trpc.item.all.useQuery()

  return (
    <>
      <HeaderPart />
      {items?.map((i) => (
        <CategoryItems key={i.id} item={i} />
      ))}
      {/* <CategoryItems />
      <CategoryItems />
      <CategoryItems />
      <CategoryItems /> */}
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session) {
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
    ctx: await createContextInner({ session }),
    transformer: SuperJSON,
  })

  await ssg.item.all.prefetch()

  return { props: { session, trpcState: ssg.dehydrate() } }
}
