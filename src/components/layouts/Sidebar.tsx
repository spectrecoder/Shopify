import Image from "next/image"
import { FaClipboardList, FaSignOutAlt } from "react-icons/fa"
import Menu from "./Menu"
import { AiOutlineUnorderedList, AiOutlineHistory } from "react-icons/ai"
import { BiBarChartSquare } from "react-icons/bi"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"

export default function Sidebar() {
  const router = useRouter()

  return (
    <section className="w-[9.4rem] min-w-[9.4rem] bg-white h-full flex flex-col justify-between py-14 items-center">
      <Image src="/images/logo.svg" alt="logo" width={42} height={42} />

      <div className="flex flex-col justify-between w-full h-96">
        <Menu
          active={router.pathname === "/"}
          Icon={AiOutlineUnorderedList}
          label="items"
          location="/"
        />
        <Menu
          active={
            router.pathname === "/history" ||
            router.pathname.startsWith("/history")
          }
          Icon={AiOutlineHistory}
          label="history"
          location="/history"
        />
        <Menu
          active={router.pathname === "/statistics"}
          Icon={BiBarChartSquare}
          label="statistics"
          location="/statistics"
        />
      </div>

      <div className="flex flex-col">
        <button className="w-[4.2rem] h-[4.2rem] mb-6 relative rounded-full flex items-center justify-center bg-main-orange text-white text-3xl">
          <FaClipboardList />
          <span className="absolute -top-2 -right-2 bg-[#EB5757] flex items-center justify-center rounded-lg text-white text-xl w-8 h-8">
            3
          </span>
        </button>

        <button
          onClick={() => signOut()}
          className="w-[4.2rem] h-[4.2rem] rounded-full flex items-center justify-center bg-main-orange text-white text-3xl"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </section>
  )
}
