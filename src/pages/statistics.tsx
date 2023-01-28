import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"
import MonthlyChart from "../components/statisticsPage/MonthlyChart"
import TopCategories from "../components/statisticsPage/TopCategories"
import TopItems from "../components/statisticsPage/TopItems"

export default function Statistics() {
  return (
    <>
      <div className="grid grid-cols-1 mb-24 md:grid-cols-2 gap-y-10 md:gap-x-24">
        <TopItems />
        <TopCategories />
      </div>

      <h3 className="mb-16 text-4xl font-semibold text-black capitalize">
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
