import CategorySelect from "./CategorySelect"

export default function AddItem() {
  return (
    <section className="w-[39rem] h-full pt-14 px-14 pb-64 overflow-scroll hideScrollbar">
      <h3 className="text-4xl font-semibold text-black mb-14">
        Add a new item
      </h3>

      <form>
        <div className="group mb-10">
          <label htmlFor="name" className="labelStyle">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter a name"
            className="inputStyle h-24"
          />
        </div>

        <div className="group mb-10">
          <label htmlFor="note" className="labelStyle">
            Note (optional)
          </label>
          <textarea
            id="note"
            placeholder="Enter a note"
            className="inputStyle h-44 resize-y pt-6"
          />
        </div>

        <div className="group mb-10">
          <label htmlFor="image" className="labelStyle">
            Image
          </label>
          <input
            type="text"
            id="image"
            placeholder="Enter a url"
            className="inputStyle h-24"
          />
        </div>

        <div className="group">
          <label htmlFor="category" className="labelStyle">
            Category
          </label>
          <CategorySelect />
        </div>
      </form>

      <div className="fixed bottom-0 right-0 w-[39rem] h-52 flex items-center justify-center bg-white">
        <div className="flex items-center justify-center gap-x-16">
          <label htmlFor="my-modal-6" className="cancelBtn">
            cancel
          </label>
          <button className="btn btn-warning w-32 h-24 myBtn">Save</button>
        </div>
      </div>
    </section>
  )
}
