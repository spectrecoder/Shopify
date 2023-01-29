import Image from "next/image"
import { FaClipboardList, FaSignOutAlt } from "react-icons/fa"
import Menu from "./Menu"
import { AiOutlineUnorderedList, AiOutlineHistory } from "react-icons/ai"
import { BiBarChartSquare } from "react-icons/bi"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { QueryClient, useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { RouterOutput } from "../../server/trpc"

interface Props {
  queryClient: QueryClient
}

export default function Sidebar({ queryClient }: Props) {
  const router = useRouter()

  const { data: totalItems } = useQuery<
    RouterOutput["list"]["read"] | undefined
  >(
    [
      ["list", "read"],
      {
        type: "query",
      },
    ],
    () =>
      queryClient.getQueryData<RouterOutput["list"]["read"]>([
        ["list", "read"],
        {
          type: "query",
        },
      ])
  )

  function toggleMenu() {
    const isMenu = queryClient.getQueryData(["showMenu"])
    if (isMenu) return queryClient.setQueryData(["showMenu"], false)
    queryClient.setQueryData(["showMenu"], true)
  }

  return (
    <section className="w-[9.4rem] min-w-[9.4rem] bg-white h-full flex flex-col justify-between py-14 items-center">
      <Link href="/">
        <Image src="/images/logo.svg" alt="logo" width={42} height={42} />
      </Link>

      <div className="flex flex-col justify-between w-full h-96">
        <Menu
          active={router.pathname === "/"}
          Icon={AiOutlineUnorderedList}
          label="items"
          location="/"
          queryClient={queryClient}
        />
        <Menu
          active={
            router.pathname === "/history" ||
            router.pathname.startsWith("/history")
          }
          Icon={AiOutlineHistory}
          label="history"
          location="/history"
          queryClient={queryClient}
        />
        <Menu
          active={router.pathname === "/statistics"}
          Icon={BiBarChartSquare}
          label="statistics"
          location="/statistics"
          queryClient={queryClient}
        />
      </div>

      <div className="flex flex-col">
        <button
          onClick={toggleMenu}
          className="w-[4.2rem] h-[4.2rem] mb-6 relative rounded-full flex items-center justify-center bg-main-orange text-white text-3xl"
        >
          <FaClipboardList />
          <span
            className={`absolute -top-2 -right-2 bg-[#EB5757] ${
              totalItems ? "flex" : "hidden"
            } items-center justify-center rounded-lg text-white text-xl w-8 h-8`}
          >
            {totalItems && totalItems.listItems.length}
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
