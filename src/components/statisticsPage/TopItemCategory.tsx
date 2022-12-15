export default function TopItemCategory() {
  return (
    <div className="h-fit">
      <h3 className="text-4xl font-semibold text-black mb-14">Top Items</h3>
      <div className="mb-11">
        <p className="text-black font-semibold text-2xl mb-4">Banana</p>
        <progress
          className="progress progress-warning w-full"
          value="70"
          max="100"
        ></progress>
      </div>

      <div className="mb-11">
        <p className="text-black font-semibold text-2xl mb-4">Rice</p>
        <progress
          className="progress progress-warning w-full"
          value="90"
          max="100"
        ></progress>
      </div>

      <div>
        <p className="text-black font-semibold text-2xl mb-4">Chicken 1kg</p>
        <progress
          className="progress progress-warning w-full"
          value="76"
          max="100"
        ></progress>
      </div>
    </div>
  )
}
