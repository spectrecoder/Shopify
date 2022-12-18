import { BsCalendarDate, BsChevronRight } from "react-icons/bs"

// t4UR3b5haZ6em8CmB55-UUZMp9CwM2Ujd_-96xXj3oSOEN0NXR - secret
// SDFQSThXWTBoRE03QUstN3Jjd1o6MTpjaQ - client

export default function history() {
  return (
    <>
      <h1 className="capitalize text-[#34333A] font-bold text-4xl mb-16">
        shopping history
      </h1>

      <div className="mb-20">
        <p className="text-black font-semibold text-xl mb-7">August 2020</p>

        <div className="px-8 py-9 bg-white rounded-2xl flex items-center justify-between shadow1 mb-11">
          <span className="capitalize font-semibold text-black text-2xl">
            grocery list
          </span>

          <div className="flex items-center">
            <div className="date flex items-center gap-x-5 text-[#C1C1C4] mr-10">
              <BsCalendarDate className="h-8 w-7" />
              <span className="text-xl font-semibold">Mon 27.8.2022</span>
            </div>
            <span className="text-[#56CCF2] mr-[3.3rem] text-xl border border-solid border-[#56CCF2] rounded-xl w-32 h-10 flex items-center justify-center font-semibold">
              completed
            </span>
            <BsChevronRight className="text-main-orange text-3xl" />
          </div>
        </div>

        <div className="px-8 py-9 bg-white rounded-2xl flex items-center justify-between shadow1">
          <span className="capitalize font-semibold text-black text-2xl">
            eero's farewell party
          </span>

          <div className="flex items-center">
            <div className="date flex items-center gap-x-5 text-[#C1C1C4] mr-10">
              <BsCalendarDate className="h-8 w-7" />
              <span className="text-xl font-semibold">Mon 27.8.2022</span>
            </div>
            <span className="text-[#56CCF2] mr-[3.3rem] text-xl border border-solid border-[#56CCF2] rounded-xl w-32 h-10 flex items-center justify-center font-semibold">
              completed
            </span>
            <BsChevronRight className="text-main-orange text-3xl" />
          </div>
        </div>
      </div>

      <div className="mb-20">
        <p className="text-black font-semibold text-xl mb-7">July 2020</p>

        <div className="px-8 py-9 bg-white rounded-2xl flex items-center justify-between shadow1 mb-11">
          <span className="capitalize font-semibold text-black text-2xl">
            board game week 2
          </span>

          <div className="flex items-center">
            <div className="date flex items-center gap-x-5 text-[#C1C1C4] mr-10">
              <BsCalendarDate className="h-8 w-7" />
              <span className="text-xl font-semibold">Mon 27.8.2022</span>
            </div>
            <span className="text-[#56CCF2] mr-[3.3rem] text-xl border border-solid border-[#56CCF2] rounded-xl w-32 h-10 flex items-center justify-center font-semibold">
              completed
            </span>
            <BsChevronRight className="text-main-orange text-3xl" />
          </div>
        </div>

        <div className="px-8 py-9 bg-white rounded-2xl flex items-center justify-between shadow1">
          <span className="capitalize font-semibold text-black text-2xl">
            grocery list
          </span>

          <div className="flex items-center">
            <div className="date flex items-center gap-x-5 text-[#C1C1C4] mr-10">
              <BsCalendarDate className="h-8 w-7" />
              <span className="text-xl font-semibold">Mon 27.8.2022</span>
            </div>
            <span className="text-[#EB5757] mr-[3.3rem] text-xl border border-solid border-[#EB5757] rounded-xl w-32 h-10 flex items-center justify-center font-semibold">
              cancelled
            </span>
            <BsChevronRight className="text-main-orange text-3xl" />
          </div>
        </div>
      </div>
    </>
  )
}
