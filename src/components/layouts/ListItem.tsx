import { useState } from "react"
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"
import { BsTrash } from "react-icons/bs"

export default function ListItem() {
  const [show, setShow] = useState<boolean>(false)

  return (
    <div className="flex items-center justify-between mt-8 gap-x-4">
      <form className="flex items-center">
        <input
          type="checkbox"
          className="checkbox checkbox-warning mr-5 border-2 border-solid border-main-orange h-7 w-7"
        />
        <h3 className="text-[1.8rem] leading-9 font-semibold text-black">
          Chicken 1kg
          {/* Pre-cooked cord 450g */}
        </h3>
      </form>

      {!show ? (
        <button
          onClick={() => setShow((prev) => !prev)}
          className="text-main-orange text-xl font-semibold border-2 border-solid border-main-orange rounded-full flex items-center justify-center w-28 h-14"
        >
          3 pcs
        </button>
      ) : (
        <div className="bg-white rounded-2xl h-[4.5rem] w-72 min-w-[18rem] flex justify-between items-center overflow-hidden pr-3">
          <button className="w-[3.7rem] h-full bg-main-orange text-white flex items-center justify-center rounded-2xl">
            <BsTrash className="w-6 h-6 text-white" />
          </button>
          <AiOutlineMinus className="text-3xl text-main-orange cursor-pointer" />
          <button
            onClick={() => setShow((prev) => !prev)}
            className="text-main-orange text-xl font-semibold border-2 border-solid border-main-orange rounded-full flex items-center justify-center w-28 h-14"
          >
            3 pcs
          </button>
          <AiOutlinePlus className="text-3xl text-main-orange cursor-pointer" />
        </div>
      )}
    </div>
  )
}
