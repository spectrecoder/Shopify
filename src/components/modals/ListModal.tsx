import { Dispatch, SetStateAction, useRef } from "react"
import useListStatus from "../../hooks/useListStatus"

interface Props {
  setShowEdit: Dispatch<SetStateAction<boolean>>
  listID: string | undefined
}

export default function ListModal({ setShowEdit, listID }: Props) {
  const ref = useRef<HTMLLabelElement>(null)
  const { mutate: cancelMutate, isLoading } = useListStatus({
    setShowEdit,
    ref,
  })

  function deleteList() {
    if (listID === undefined) return
    cancelMutate({ listID, status: "CANCELLED" })
  }

  return (
    <>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <label
        htmlFor="my-modal-6"
        className="cursor-pointer modal modal-bottom sm:modal-middle"
      >
        <label
          className="modal-box relative min-w-[50rem] w-[50rem] h-80 px-12 py-10 flex flex-col justify-between bg-white"
          htmlFor=""
        >
          <label
            htmlFor="my-modal-6"
            className="absolute btn btn-sm btn-circle right-4 top-4"
          >
            ✕
          </label>
          <h3 className="font-semibold text-4xl leading-[3rem] w-[41rem] h-24">
            Are you sure that you want to cancel the list?
          </h3>
          <div className="flex items-center modal-action justify-right gap-x-10">
            <label
              htmlFor="my-modal-6"
              className={`${
                isLoading ? "pointer-events-none" : "pointer-events-auto"
              } cancelBtn`}
            >
              cancel
            </label>

            <label
              onClick={deleteList}
              className={`btn btn-error bg-[#EB5757] h-24 w-36 myBtn ${
                isLoading && "loading"
              }`}
            >
              {isLoading ? "" : "Yes!"}
            </label>
            <label ref={ref} htmlFor="my-modal-6" className="hidden"></label>
          </div>
        </label>
      </label>
    </>
  )
}
