export default function MyModal() {
  return (
    <>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <label
        htmlFor="my-modal-6"
        className="modal cursor-pointer modal-bottom sm:modal-middle"
      >
        <label className="modal-box relative" htmlFor="">
          <label
            htmlFor="my-modal-6"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg">
            Congratulations random Internet user!
          </h3>
          <p className="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Yay!
            </label>
          </div>
        </label>
      </label>
    </>
  )
}
