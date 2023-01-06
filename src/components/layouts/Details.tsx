import { HiOutlineArrowNarrowLeft } from "react-icons/hi"
import { Dispatch, SetStateAction } from "react"
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query"
import { RouterOutput } from "../../server/trpc"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"
import { CurrentItem } from "../../types/types"

interface Props {
  queryClient: QueryClient
}

export default function Details({ queryClient }: Props) {
  const { data: currentItem } = useQuery<CurrentItem>(
    ["currentItem"],
    () => queryClient.getQueryData(["currentItem"]) as CurrentItem
  )

  const { mutate } = trpc.list.createOrUpdate.useMutation({
    onSuccess: (data) => {
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

    if (list?.items.find((i) => i.id === currentItem.itemId)) {
      toast.error("Item already in the list")
      return
    }

    mutate({
      itemIDs: list
        ? [...list.items.map((i) => ({ id: i.id })), { id: currentItem.itemId }]
        : [{ id: currentItem.itemId }],
      listID: list?.id,
    })
  }

  return (
    <section className="w-[39rem] min-w-[39rem] h-full bg-white pt-14 px-14 pb-64 overflow-scroll hideScrollbar">
      <button
        onClick={goBack}
        className="flex items-center text-2xl font-bold text-main-orange gap-x-2 mb-14"
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
        <h1 className="text-4xl font-semibold black">
          {currentItem?.itemName}
        </h1>
      </div>

      <div className="mt-12">
        <span className="text-xl text-[#C1C1C4] font-semibold block mb-4">
          category
        </span>
        <h2 className="text-3xl font-semibold black">
          {currentItem?.categoryName}
        </h2>
      </div>

      <div className="mt-12">
        <span className="text-xl text-[#C1C1C4] font-semibold block mb-4">
          note
        </span>
        <h2 className="text-2xl font-semibold leading-8 black">
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
            className="w-48 h-24 btn btn-warning myBtn"
          >
            Add to list
          </button>
        </div>
      </div>
    </section>
  )
}
