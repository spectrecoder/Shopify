import { useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import { toast } from "react-hot-toast"
import { RouterOutput } from "../../server/trpc"
import { trpc } from "../../utils/trpc"

export default function ItemModal() {
  const ref = useRef<HTMLLabelElement>(null)
  const queryClient = useQueryClient()

  const { mutate, isLoading } = trpc.item.delete.useMutation({
    onSuccess: (data) => {
      toast.success("Successfully deleted")
      ref.current?.click()
      queryClient.setQueryData(["currentItem"], "")
      queryClient.setQueryData(["currentMenu"], "ActiveList")
      queryClient.setQueryData(
        [
          ["item", "all"],
          {
            type: "query",
          },
        ],
        (oldData: RouterOutput["item"]["all"] | undefined) => {
          if (oldData === undefined) return oldData
          const filteredCategory = oldData.find((i) => i.id === data.categoryId)
          if (filteredCategory === undefined) return oldData
          const filteredItems = filteredCategory.items.filter(
            (i) => i.id !== data.id
          )
          return oldData.map((d) =>
            d.id === filteredCategory.id
              ? { ...filteredCategory, items: [...filteredItems] }
              : d
          )
        }
      )
    },
  })

  function deleteItem() {
    const item = queryClient.getQueryData<CurrentItem>(["currentItem"])
    if (item === undefined) return
    mutate(item.itemId)
  }

  return (
    <>
      <input type="checkbox" id="my-modal-1" className="modal-toggle" />
      <label
        htmlFor={!isLoading ? "my-modal-1" : ""}
        className="modal cursor-pointer modal-bottom sm:modal-middle"
      >
        <label
          className="modal-box relative min-w-[50rem] w-[50rem] h-80 px-12 py-10 flex flex-col justify-between bg-white"
          htmlFor=""
        >
          <label
            htmlFor="my-modal-1"
            className={`btn btn-sm btn-circle absolute right-4 top-4 ${
              isLoading ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            ✕
          </label>
          <h3 className="font-semibold text-4xl leading-[3rem] w-[41rem] h-24">
            Are you sure that you want to delete the item?
          </h3>
          <div className="modal-action flex items-center justify-right gap-x-10">
            <label
              htmlFor="my-modal-1"
              className={`${
                isLoading ? "pointer-events-none" : "pointer-events-auto"
              } cancelBtn`}
            >
              cancel
            </label>

            <label
              onClick={deleteItem}
              className={`btn btn-error bg-[#EB5757] h-24 w-36 myBtn ${
                isLoading && "loading"
              }`}
            >
              {isLoading ? "" : "Yes!"}
            </label>
            <label ref={ref} htmlFor="my-modal-1" className="hidden"></label>
          </div>
        </label>
      </label>
    </>
  )
}
