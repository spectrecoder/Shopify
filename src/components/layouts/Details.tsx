import { HiOutlineArrowNarrowLeft } from "react-icons/hi"
import { Dispatch, SetStateAction } from "react"
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query"
import { RouterOutput } from "../../server/trpc"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"

interface Props {
  queryClient: QueryClient
}

export default function Details({ queryClient }: Props) {
  const { data: currentItem } = useQuery<CurrentItem>(
    ["currentItem"],
    () => queryClient.getQueryData(["currentItem"]) as CurrentItem
  )

  const { mutate } = trpc.list.createOrUpdate.useMutation({
    onSuccess: (data, variables, context) => {
      toast.success("Added to the list")
      goBack()
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

  function goBack(): void {
    queryClient.setQueryData(["currentMenu"], "ActiveList")
    queryClient.setQueryData(["currentItem"], "")
  }

  function addToList() {
    if (!currentItem) return

    const list: RouterOutput["list"]["read"] | undefined =
      queryClient.getQueryData([
        ["list", "read"],
        {
          type: "query",
        },
      ])

    if (list?.itemIDs.includes(currentItem.itemId)) {
      toast.error("Item already in the list")
      return
    }

    mutate({
      itemIDs: list
        ? [...list.itemIDs.map((id) => ({ id })), { id: currentItem.itemId }]
        : [{ id: currentItem.itemId }],
      listID: list?.id,
    })
  }

  return (
    <section className="w-[39rem] min-w-[39rem] h-full bg-white pt-14 px-14 pb-64 overflow-scroll hideScrollbar">
      <button
        onClick={goBack}
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
          <label htmlFor="my-modal-1" className="cancelBtn">
            delete
          </label>
          <button
            onClick={addToList}
            className="btn btn-warning w-48 h-24 myBtn"
          >
            Add to list
          </button>
        </div>
      </div>
    </section>
  )
}
