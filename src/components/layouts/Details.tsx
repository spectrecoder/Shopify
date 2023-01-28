import { QueryClient, useQuery } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { AiOutlineClose } from "react-icons/ai"
import { HiOutlineArrowNarrowLeft } from "react-icons/hi"
import { RouterOutput } from "../../server/trpc"
import { CurrentItem } from "../../types/types"
import { trpc } from "../../utils/trpc"

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

    if (list?.listItems.find((i) => i.item.id === currentItem.itemId)) {
      toast.error("Item already in the list")
      return
    }

    mutate({
      itemID: { id: currentItem.itemId },
      listID: list?.id,
    })
  }

  return (
    <section className="h-full pb-64 overflow-scroll bg-white pt-14 px-14 hideScrollbar">
      <AiOutlineClose
        onClick={() => queryClient.setQueryData(["showMenu"], false)}
        className="absolute block w-10 h-10 text-white rounded-full cursor-pointer sm:hidden bg-main-orange top-3 right-3"
      />
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

      {currentItem?.show && (
        <div className="fixed bottom-0 right-0 flex items-center justify-center bg-white sidePageRes h-52">
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
      )}
    </section>
  )
}
