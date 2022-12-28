export default function ListModal() {
  return (
    <>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <label
        htmlFor="my-modal-6"
        className="modal cursor-pointer modal-bottom sm:modal-middle"
      >
        <label
          className="modal-box relative min-w-[50rem] w-[50rem] h-80 px-12 py-10 flex flex-col justify-between bg-white"
          htmlFor=""
        >
          <label
            htmlFor="my-modal-6"
            className="btn btn-sm btn-circle absolute right-4 top-4"
          >
            ✕
          </label>
          <h3 className="font-semibold text-4xl leading-[3rem] w-[41rem] h-24">
            Are you sure that you want to cancel the list?
          </h3>
          <div className="modal-action flex items-center justify-right gap-x-10">
            <label htmlFor="my-modal-6" className="cancelBtn">
              cancel
            </label>

            <label
              htmlFor="my-modal-6"
              className="btn btn-error bg-[#EB5757] h-24 w-36 myBtn"
            >
              Yes!
            </label>
          </div>
        </label>
      </label>
    </>
  )
}
