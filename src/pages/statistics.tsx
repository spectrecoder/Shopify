import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"
import MonthlyChart from "../components/statisticsPage/MonthlyChart"
import TopCategories from "../components/statisticsPage/TopCategories"
import TopItems from "../components/statisticsPage/TopItems"

export default function statistics() {
  return (
    <>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-y-10 md:gap-x-24 mb-24">
        <TopItems />
        <TopCategories />
      </div>

      <h3 className="text-4xl font-semibold text-black mb-16 capitalize">
        monthly summary
      </h3>

      <MonthlyChart />
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

  return { props: {} }
}
