import { QueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { MouseEvent, useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import { MdModeEditOutline } from "react-icons/md"
import useListStatus from "../../hooks/useListStatus"
import { RouterOutput } from "../../server/trpc"
import { trpc } from "../../utils/trpc"
import { formateListItems } from "../../utils/utilityFunctions"
import ListModal from "../modals/ListModal"
import ListItems from "./ListItems"

interface Props {
  queryClient: QueryClient
}

export default function ActiveList({ queryClient }: Props) {
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [listName, setListName] = useState<string>("")
  const [trueIDs, setTrueIDs] = useState<string[]>([])
  const [falseIDs, setFalseIDs] = useState<string[]>([])
  const { mutate: completeMutate, isLoading: completeLoading } = useListStatus({
    setShowEdit,
  })
  const { data: activeList, isLoading } = trpc.list.read.useQuery()
  const { mutate, isLoading: mutateLoading } =
    trpc.list.updateListName.useMutation({
      onSuccess: (data) => {
        queryClient.setQueryData(
          [
            ["list", "read"],
            {
              type: "query",
            },
          ],
          data
        )
        toast.success(`List name updated to ${listName}`)
        setListName("")
      },
    })

  const { mutate: isDoneMutate } = trpc.listItem.updateDone.useMutation({
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          ["list", "read"],
          {
            type: "query",
          },
        ],
        (oldData: RouterOutput["list"]["read"] | undefined) => {
          if (!oldData) return oldData

          const updatedItems = oldData.listItems.map((i) => {
            if (data.trueIDs.includes(i.id)) {
              return { ...i, isDone: true }
            } else if (data.falseIDs.includes(i.id)) {
              return { ...i, isDone: false }
            } else {
              return i
            }
          })
          return { ...oldData, listItems: [...updatedItems] }
        }
      )
    },
    onError: () => {
      toast.error("Server error. Please try again later.")
    },
    onSettled: () => {
      setShowEdit(false)
      setTrueIDs([])
      setFalseIDs([])
    },
  })

  const filteredItems = useMemo(() => {
    if (!activeList) return
    return formateListItems(activeList.listItems)
    // const filtered: { [key: string]: typeof activeList.listItems } = {}

    // activeList.listItems.forEach((i) => {
    //   if (i.item.category && i.item.category.name in filtered) {
    //     filtered[i.item.category.name] = [...filtered[i.item.category.name], i]
    //   } else if (i.item.category && !(i.item.category.name in filtered)) {
    //     filtered[i.item.category.name] = [i]
    //   }
    // })

    // return Object.entries(filtered)
  }, [activeList])

  function changeListName(e: MouseEvent<HTMLElement>) {
    e.preventDefault()
    if (!listName || !activeList?.id) return
    mutate({ listName, listID: activeList.id })
  }

  function updateCheckOrUncheck() {
    if (showEdit) {
      if (trueIDs.length || falseIDs.length) {
        isDoneMutate({ trueIDs, falseIDs })
      } else {
        setShowEdit(false)
      }
    } else {
      setShowEdit(true)
    }
  }

  function completeList() {
    if (!activeList) return
    completeMutate({ listID: activeList.id, status: "COMPLETED" })
  }

  if (isLoading) return <h1>Loading...</h1>

  return (
    <section className="w-[39rem] min-w-[39rem] h-full bg-[#FFF0DE] pt-14 px-14 pb-64 overflow-scroll hideScrollbar relative">
      <ListModal setShowEdit={setShowEdit} listID={activeList?.id} />

      <div className="w-full h-52 rounded-[2.4rem] bg-[#80485B] relative py-7 flex justify-end pr-11 mb-16">
        <div className="absolute w-full h-full -top-6 -left-40">
          <Image src="/images/source.svg" alt="wine" fill />
        </div>

        <div className="z-10 flex flex-col justify-between h-full">
          <p className="w-64 text-2xl font-bold leading-8 text-white">
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

      {filteredItems && activeList ? (
        <>
          <h1 className="text-4xl text-[#34333A] font-bold flex items-center justify-between">
            {activeList.listName}{" "}
            <MdModeEditOutline
              onClick={updateCheckOrUncheck}
              className="text-4xl cursor-pointer"
            />
          </h1>

          {filteredItems.map((catItems, idx) => (
            <ListItems
              key={idx}
              showEdit={showEdit}
              catItems={catItems}
              queryClient={queryClient}
              listId={activeList.id}
              setTrueIDs={setTrueIDs}
              setFalseIDs={setFalseIDs}
            />
          ))}
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
            className="absolute z-10 -translate-x-1/2 bottom-48 left-1/2"
          />
        </>
      )}

      <div className="fixed bottom-0 right-0 w-[39rem] h-52 bg-white flex items-center justify-center">
        {showEdit ? (
          <div className="flex items-center justify-center gap-x-16">
            <label htmlFor="my-modal-6" className="cancelBtn">
              cancel
            </label>
            <button
              onClick={completeList}
              className={`w-48 h-24 btn btn-info myBtn ${
                completeLoading ? "pointer-events-none" : "pointer-events-auto"
              }`}
            >
              {completeLoading ? "" : "Complete"}
            </button>
          </div>
        ) : (
          <form className="flex items-center border-2 border-solid border-main-orange w-[31rem] h-24 overflow-hidden rounded-2xl gap-4 pl-6">
            <input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="enter a name"
              type="text"
              className="flex-grow text-2xl font-medium text-black"
            />
            <button
              onClick={changeListName}
              className={`${
                mutateLoading ? "pointer-events-none" : "pointer-events-auto"
              } h-full w-[8.7rem] bg-main-orange text-white font-bold text-2xl flex items-center justify-center rounded-tl-2xl rounded-bl-2xl`}
            >
              {mutateLoading ? "" : "Save"}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
