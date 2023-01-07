import { QueryClient } from "@tanstack/react-query"
import { useState } from "react"
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
}

export default function ListItem({
  showEdit,
  item,
  queryClient,
  listId,
}: Props) {
  const [itemQuantity, setItemQuantity] = useState<number>(1)
  const [editQuantity, setEditQuantity] = useState<boolean>(false)
  const [lineThrough, setLineThrough] = useState<boolean>(item.isDone)

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

  const { mutate: qtyMutate } = trpc.item.updateQuantity.useMutation({
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
          const updatedItems = oldData.items.map((i) =>
            i.id === data.itemID ? { ...i, quantity: data.qty } : i
          )
          return { ...oldData, items: [...updatedItems] }
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

  // const {mutate: isDoneMutate} = trpc.item.updateDone.useMutation({
  //   onSuccess: (data) => {
  //     queryClient.setQueryData(
  //       [
  //         ["list", "read"],
  //         {
  //           type: "query",
  //         },
  //       ],
  //       (oldData: RouterOutput["list"]["read"] | undefined) => {
  //         if (!oldData) return oldData
  //         const updatedItems = oldData.items.map((i) =>
  //           i.id === data.itemID ? { ...i, isDone: data.isDone } : i
  //         )
  //         return { ...oldData, items: [...updatedItems] }
  //       }
  //     )
  //   },
  //   onError: () => {
  //     toast.error("Server error. Please try again later.")
  //   },
  // })

  function removeItem() {
    mutate({ listID: listId, itemID: { id: item.id } })
  }

  function changeQuantity() {
    if (item.quantity !== itemQuantity) {
      qtyMutate({ qty: itemQuantity, itemID: item.id })
    } else {
      setEditQuantity(false)
    }
  }

  function switchQtyMode() {
    setEditQuantity(true)
    setItemQuantity(item.quantity)
  }

  return (
    <div className="flex items-center justify-between mt-6 gap-x-4">
      <form className="flex items-center">
        <input
          onChange={() => setLineThrough((prev) => !prev)}
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
          {item.name}
          {/* Pre-cooked cord 450g */}
        </h3>
      </form>

      {!editQuantity ? (
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
