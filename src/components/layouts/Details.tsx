import { HiOutlineArrowNarrowLeft } from "react-icons/hi"
import { Dispatch, SetStateAction } from "react"
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query"

interface Props {
  queryClient: QueryClient
}

interface CurrentItem {
  categoryName: string
  itemName: string
  note: string
  image: string
}

export default function Details({ queryClient }: Props) {
  const { data: currentItem } = useQuery<CurrentItem>(
    ["currentItem"],
    () => queryClient.getQueryData(["currentItem"]) as CurrentItem
  )

  return (
    <section className="w-[39rem] min-w-[39rem] h-full bg-white pt-14 px-14 pb-64 overflow-scroll hideScrollbar">
      <button
        onClick={() => queryClient.setQueryData(["currentMenu"], "ActiveList")}
        className="text-main-orange text-2xl flex items-center gap-x-2 font-bold mb-14"
      >
        <HiOutlineArrowNarrowLeft />
        back
      </button>

      <img
        src={currentItem?.image}
        alt="item"
        className="object-cover w-full h-[22rem] rounded-[2.5rem] overflow-hidden"
      />

      <div className="mt-12">
        <span className="text-xl text-[#C1C1C4] font-semibold block mb-4">
          name
        </span>
        <h1 className="black text-4xl font-semibold">
          {currentItem?.itemName}
        </h1>
      </div>

      <div className="mt-12">
        <span className="text-xl text-[#C1C1C4] font-semibold block mb-4">
          category
        </span>
        <h2 className="black text-3xl font-semibold">
          {currentItem?.categoryName}
        </h2>
      </div>

      <div className="mt-12">
        <span className="text-xl text-[#C1C1C4] font-semibold block mb-4">
          note
        </span>
        <h2 className="black text-2xl font-semibold leading-8">
          {currentItem?.note}
        </h2>
      </div>

      <div className="fixed bottom-0 right-0 w-[39rem] h-52 flex items-center justify-center bg-white">
        <div className="flex items-center justify-center gap-x-16">
          {/* <button className="cancelBtn">delete</button> */}
          <label htmlFor="my-modal-1" className="cancelBtn">
            delete
          </label>
          <button className="btn btn-warning w-48 h-24 myBtn">
            Add to list
          </button>
        </div>
      </div>
    </section>
  )
}
