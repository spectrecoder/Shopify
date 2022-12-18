import CategoryItems from "../components/layouts/CategoryItems"
import HeaderPart from "../components/itemPage/HeaderPart"
import { getSession } from "next-auth/react"
import { NextPageContext } from "next"

export default function Home() {
  return (
    <>
      <HeaderPart />
      <CategoryItems />
      <CategoryItems />
      <CategoryItems />
      <CategoryItems />
    </>
  )
}

export async function getServerSideProps(context: NextPageContext) {
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

  return { props: { session } }
}
