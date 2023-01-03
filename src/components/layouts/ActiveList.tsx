import Image from "next/image"
import { MdModeEditOutline } from "react-icons/md"
import ListItems from "./ListItems"
import { Dispatch, SetStateAction, useState, useMemo } from "react"
import { QueryClient } from "@tanstack/react-query"
import { trpc } from "../../utils/trpc"
import { RouterOutput } from "../../server/trpc"

interface Props {
  queryClient: QueryClient
}

export default function ActiveList({ queryClient }: Props) {
  const [showEdit, setShowEdit] = useState<boolean>(false)

  const { data: activeList, isLoading } = trpc.list.read.useQuery()

  const filteredItems = useMemo(() => {
    if (!activeList) return

    const filtered: { [key: string]: typeof activeList.items } = {}

    activeList.items.forEach((i) => {
      if (i.category && i.category.name in filtered) {
        filtered[i.category.name] = [...filtered[i.category.name], i]
      } else if (i.category && !(i.category.name in filtered)) {
        filtered[i.category.name] = [i]
      }
    })

    return filtered
  }, [activeList])

  console.log(filteredItems)

  if (isLoading) return <h1>Loading...</h1>

  return (
    <section className="w-[39rem] min-w-[39rem] h-full bg-[#FFF0DE] pt-14 px-14 pb-64 overflow-scroll hideScrollbar relative">
      <div className="w-full h-52 rounded-[2.4rem] bg-[#80485B] relative py-7 flex justify-end pr-11 mb-16">
        <div className="w-full h-full absolute -top-6 -left-40">
          <Image src="/images/source.svg" alt="wine" fill />
        </div>

        <div className="h-full flex flex-col justify-between z-10">
          <p className="w-64 leading-8 font-bold text-white text-2xl">
            {"Didn't"} find what you need?
          </p>
          <button
            onClick={() => queryClient.setQueryData(["currentMenu"], "AddItem")}
            className="text-2xl text-[#34333A] font-bold bg-white flex justify-center items-center w-48 h-16 rounded-2xl cursor-pointer"
          >
            Add item
          </button>
        </div>
      </div>

      {filteredItems ? (
        <>
          <h1 className="text-4xl text-[#34333A] font-bold flex items-center justify-between">
            Shopping list{" "}
            <MdModeEditOutline
              onClick={() => setShowEdit((prev) => !prev)}
              className="text-4xl cursor-pointer"
            />
          </h1>

          <ListItems showEdit={showEdit} />
          <ListItems showEdit={showEdit} />
          <ListItems showEdit={showEdit} />
        </>
      ) : (
        <>
          <span className="text-[#34333A] text-3xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            No items
          </span>

          <Image
            src="/images/shopping.svg"
            alt="shopping"
            width={245}
            height={203}
            className="absolute bottom-48 left-1/2 -translate-x-1/2 z-10"
          />
        </>
      )}

      <div className="fixed bottom-0 right-0 w-[39rem] h-52 bg-white flex items-center justify-center">
        <form className="flex items-center border-2 border-solid border-main-orange w-[31rem] h-24 overflow-hidden rounded-2xl gap-4 pl-6">
          <input
            placeholder="enter a name"
            type="text"
            className="flex-grow text-2xl font-medium text-black"
          />
          <button className="h-full w-[8.7rem] bg-main-orange text-white font-bold text-2xl flex items-center justify-center rounded-tl-2xl rounded-bl-2xl">
            Save
          </button>
        </form>

        {/* <div className="flex items-center justify-center gap-x-16">
          <label htmlFor="my-modal-6" className="cancelBtn">
            cancel
          </label>
          <button className="btn btn-info w-48 h-24 myBtn">Complete</button>
        </div> */}
      </div>
    </section>
  )
}
