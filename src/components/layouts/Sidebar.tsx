import Image from "next/image"
import { FaClipboardList } from "react-icons/fa"
import Menu from "./Menu"
import { AiOutlineUnorderedList, AiOutlineHistory } from "react-icons/ai"
import { BiBarChartSquare } from "react-icons/bi"

export default function Sidebar() {
  return (
    <section className="w-[9.4rem] bg-white h-full flex flex-col justify-between py-14 items-center">
      <Image src="/images/logo.svg" alt="logo" width={42} height={42} />

      <div className="w-full h-96 flex flex-col justify-between">
        <Menu active={true} Icon={AiOutlineUnorderedList} />
        <Menu active={false} Icon={AiOutlineHistory} />
        <Menu active={false} Icon={BiBarChartSquare} />
      </div>

      <button className="w-[4.2rem] h-[4.2rem] relative rounded-full flex items-center justify-center bg-main-orange text-white text-3xl">
        <FaClipboardList />
        <span className="absolute -top-2 -right-2 bg-[#EB5757] flex items-center justify-center rounded-lg text-white text-xl w-8 h-8">
          3
        </span>
      </button>
    </section>
  )
}
