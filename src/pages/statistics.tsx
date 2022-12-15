import MonthlyChart from "../components/statisticsPage/MonthlyChart"
import TopItemCategory from "../components/statisticsPage/TopItemCategory"

export default function statistics() {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-24 mb-24">
        <TopItemCategory />
        <TopItemCategory />
      </div>

      <h3 className="text-4xl font-semibold text-black mb-16 capitalize">
        monthly summary
      </h3>

      <MonthlyChart />
    </>
  )
}
