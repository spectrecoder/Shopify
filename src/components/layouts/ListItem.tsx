import { QueryClient } from "@tanstack/react-query"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { toast } from "react-hot-toast"
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"
import { BsTrash } from "react-icons/bs"
import { RouterOutput } from "../../server/trpc"
import { ActiveListItem } from "../../types/types"
import { trpc } from "../../utils/trpc"

interface Props {
  showEdit: boolean
  item: ActiveListItem
  queryClient: QueryClient
  listId: string
  setTrueIDs: Dispatch<SetStateAction<string[]>>
  setFalseIDs: Dispatch<SetStateAction<string[]>>
}

export default function ListItem({
  showEdit,
  item,
  queryClient,
  listId,
  setTrueIDs,
  setFalseIDs,
}: Props) {
  const [itemQuantity, setItemQuantity] = useState<number>(1)
  const [editQuantity, setEditQuantity] = useState<boolean>(false)
  const [lineThrough, setLineThrough] = useState<boolean>(item.isDone)

  useEffect(() => {
    setLineThrough(item.isDone)
  }, [item.isDone])

  const { mutate } = trpc.list.removeItem.useMutation({
    onSuccess: (data) => {
      toast.success("Removed from the list")
      queryClient.setQueryData(
        [
          ["list", "read"],
          {
            type: "query",
          },
        ],
        data
      )
    },
  })

  const { mutate: qtyMutate } = trpc.listItem.updateQuantity.useMutation({
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
          const updatedItems = oldData.listItems.map((i) =>
            i.id === data.itemID ? { ...i, quantity: data.qty } : i
          )
          return { ...oldData, listItems: [...updatedItems] }
        }
      )
    },
    onError: () => {
      toast.error("Server error. Please try again later.")
    },
    onSettled: () => {
      setEditQuantity(false)
      setItemQuantity(1)
    },
  })

  function removeItem() {
    mutate({ listID: listId, itemID: item.id })
  }

  function changeQuantity() {
    if (item.quantity !== itemQuantity) {
      qtyMutate({ qty: itemQuantity, itemID: item.id })
    } else {
      setEditQuantity(false)
    }
  }

  function switchQtyMode() {
    setEditQuantity(item.isDone || showEdit ? false : true)
    setItemQuantity(item.quantity)
  }

  function checkOrUncheck() {
    setLineThrough((prev) => !prev)
    if (!lineThrough !== item.isDone) {
      if (!lineThrough === false) {
        setFalseIDs((prev) => [...prev, item.id])
      } else {
        setTrueIDs((prev) => [...prev, item.id])
      }
    } else {
      if (item.isDone) {
        setFalseIDs((prev) => prev.filter((i) => i !== item.id))
      } else {
        setTrueIDs((prev) => prev.filter((i) => i !== item.id))
      }
    }
  }

  return (
    <div className="flex items-center justify-between mt-6 gap-x-4">
      <form className="flex items-center">
        <input
          onChange={checkOrUncheck}
          checked={lineThrough}
          type="checkbox"
          className={`checkbox checkbox-warning mr-5 border-2 border-solid border-main-orange h-7 w-7 ${
            showEdit ? "block" : "hidden"
          }`}
        />
        <h3
          className={`text-[1.8rem] leading-9 font-semibold text-black ${
            lineThrough ? "line-through" : "no-underline"
          }`}
        >
          {item.item.name}
          {/* Pre-cooked cord 450g */}
        </h3>
      </form>

      {!editQuantity || item.isDone || showEdit ? (
        <button
          onClick={switchQtyMode}
          className="flex items-center justify-center text-xl font-semibold border-2 border-solid rounded-full text-main-orange border-main-orange w-28 h-14"
        >
          {item.quantity} pcs
        </button>
      ) : (
        <div className="bg-white rounded-2xl h-[4.5rem] w-72 min-w-[18rem] flex justify-between items-center overflow-hidden pr-3">
          <button
            onClick={removeItem}
            className="w-[3.7rem] h-full bg-main-orange text-white flex items-center justify-center rounded-2xl"
          >
            <BsTrash className="w-6 h-6 text-white" />
          </button>
          <AiOutlineMinus
            className="text-3xl cursor-pointer text-main-orange"
            onClick={() =>
              setItemQuantity((prev) => (prev === 1 ? 1 : prev - 1))
            }
          />
          <button
            onClick={changeQuantity}
            className="flex items-center justify-center text-xl font-semibold border-2 border-solid rounded-full select-none text-main-orange border-main-orange w-28 h-14"
          >
            {itemQuantity} pcs
          </button>
          <AiOutlinePlus
            className="text-3xl cursor-pointer text-main-orange"
            onClick={() => setItemQuantity((prev) => prev + 1)}
          />
        </div>
      )}
    </div>
  )
}
