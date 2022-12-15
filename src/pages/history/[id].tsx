import { BsCalendarDate } from "react-icons/bs"
import { HiOutlineArrowNarrowLeft } from "react-icons/hi"
import CategoryItems from "../../components/layouts/CategoryItems"

export default function history() {
  return (
    <>
      <button className="text-main-orange text-2xl flex items-center gap-x-2 font-bold mb-14">
        <HiOutlineArrowNarrowLeft />
        back
      </button>

      <h1 className="capitalize text-[#34333A] font-bold text-4xl mb-8">
        eero's farewell party
      </h1>

      <div className="date flex items-center gap-x-5 text-[#C1C1C4] mr-10 mb-20">
        <BsCalendarDate className="h-8 w-7" />
        <span className="text-xl font-semibold">Mon 27.8.2022</span>
      </div>

      <CategoryItems />
      <CategoryItems />
    </>
  )
}
