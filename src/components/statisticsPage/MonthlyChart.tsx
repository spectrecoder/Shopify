import {
  LineChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

const data = [
  { name: "January", total: 400 },
  { name: "February", total: 200 },
  { name: "March", total: 300 },
  { name: "April", total: 350 },
  { name: "May", total: 100 },
  { name: "June", total: 500 },
  { name: "July", total: 410 },
]

function renderLegendText() {
  return <span className="text-black text-xl font-semibold">items</span>
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-solid border-[#BDBDBD] py-4 px-6 bg-white w-72">
        <p className="text-2xl font-semibold text-[#34333A] mb-2">{`${label} : ${payload[0].value} items`}</p>
        <p className="text-[#828282] text-xl font-medium">
          Total {payload[0].value} items bought in {label}
        </p>
      </div>
    )
  }
  return null
}

export default function MonthlyChart() {
  return (
    <ResponsiveContainer width="100%" height={302}>
      <LineChart data={data} margin={{ top: 0, right: 20, bottom: 5, left: 0 }}>
        <XAxis
          dataKey="name"
          tick={{
            fontSize: "13px",
            fontWeight: 600,
          }}
        />
        <YAxis
          tick={{
            fontSize: "13px",
            fontWeight: 600,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconSize={15} formatter={renderLegendText} />
        <CartesianGrid stroke="#E0E0E0" strokeDasharray="5 5" />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#F9A109"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
