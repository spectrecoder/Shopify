import CategorySelect from "./CategorySelect"
import { Dispatch, SetStateAction, useState } from "react"
import { trpc } from "../../utils/trpc"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { RouterOutput } from "../../server/trpc"

interface Props {
  queryClient: QueryClient
}

interface FormData {
  name: string
  note: string
  image: string
}

export default function AddItem({ queryClient }: Props) {
  const [categoryName, setCategoryName] = useState<string | undefined>(
    undefined
  )
  const { register, handleSubmit, reset } = useForm<FormData>()
  const { mutate, isLoading } = trpc.item.create.useMutation({
    onSuccess: (data) => {
      toast.success("Successfully created new item")
      reset({ name: "", note: "", image: "" })
      queryClient.setQueryData(
        [
          ["item", "all"],
          {
            type: "query",
          },
        ],
        (oldData: RouterOutput["item"]["all"] | undefined) => {
          let newItem = { ...data, category: data.category || undefined }
          delete newItem.category
          const newCatItem: RouterOutput["item"]["all"][number] = {
            id: data.categoryId!,
            name: data.category?.name!,
            userId: data.userId,
            items: [newItem],
          }

          if (oldData === undefined) {
            queryClient.setQueryData(
              [
                ["item", "allCategories"],
                {
                  type: "query",
                },
              ],
              [{ value: newCatItem.name, label: newCatItem.name }]
            )
            return [newCatItem]
          }

          const itemsList = oldData.find((i) => i.name === data.category?.name)

          if (itemsList === undefined) {
            const categories = oldData.map((d) => ({
              label: d.name,
              name: d.name,
            }))
            queryClient.setQueryData(
              [
                ["item", "allCategories"],
                {
                  type: "query",
                },
              ],
              [
                ...categories,
                { value: newCatItem.name, label: newCatItem.name },
              ]
            )
            return [...oldData, newCatItem]
          }

          return oldData.map((d) =>
            d.id === itemsList.id
              ? { ...itemsList, items: [...itemsList.items, newItem] }
              : d
          )
        }
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (categoryName === undefined) {
      toast.error("Category is required")
      return
    }
    mutate({ ...data, categoryName })
  }

  return (
    <section className="w-[39rem] min-w-[39rem] h-full pt-14 px-14 pb-64 overflow-scroll hideScrollbar">
      <h3 className="text-4xl font-semibold text-black mb-14">
        Add a new item
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-10 group">
          <label htmlFor="name" className="labelStyle">
            Name
          </label>
          <input
            {...register("name", { required: true })}
            type="text"
            id="name"
            placeholder="Enter a name"
            className="h-24 inputStyle"
          />
        </div>

        <div className="mb-10 group">
          <label htmlFor="note" className="labelStyle">
            Note (optional)
          </label>
          <textarea
            {...register("note")}
            id="note"
            placeholder="Enter a note"
            className="pt-6 resize-y inputStyle h-44"
          />
        </div>

        <div className="mb-10 group">
          <label htmlFor="image" className="labelStyle">
            Image
          </label>
          <input
            {...register("image", { required: true })}
            type="text"
            id="image"
            placeholder="Enter a url"
            className="h-24 inputStyle"
          />
        </div>

        <div className="group">
          <label htmlFor="category" className="labelStyle">
            Category
          </label>
          <CategorySelect
            setCategoryName={setCategoryName}
            queryClient={queryClient}
          />
        </div>
        <div className="fixed bottom-0 right-0 w-[39rem] h-52 flex items-center justify-center bg-white">
          <div className="flex items-center justify-center gap-x-16">
            <span
              onClick={() =>
                queryClient.setQueryData(["currentMenu"], "ActiveList")
              }
              className={`cancelBtn ${
                isLoading ? "pointer-events-none" : "pointer-events-auto"
              }`}
            >
              cancel
            </span>
            <button
              type="submit"
              className={`btn btn-warning h-24 w-32 myBtn ${
                isLoading && "loading"
              }`}
            >
              {isLoading ? "" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
