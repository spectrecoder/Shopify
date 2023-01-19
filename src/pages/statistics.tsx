import MonthlyChart from "../components/statisticsPage/MonthlyChart"
import TopCategories from "../components/statisticsPage/TopCategories"
import TopItems from "../components/statisticsPage/TopItems"

export default function statistics() {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-24 mb-24">
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
