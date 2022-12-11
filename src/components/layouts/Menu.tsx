import Link from "next/link"
import { IconType } from "react-icons/lib/esm/iconBase"

interface Props {
  active: boolean
  Icon: IconType
  label: string
}

export default function Menu({ active, Icon, label }: Props) {
  return (
    <Link href="/">
      <button
        data-tip={label}
        className={`${
          active ? "before:block" : "before:hidden"
        } relative cursor-default w-full h-[4.6rem] text-[#454545] text-[2.5rem] flex justify-center items-center before:content-[''] before:absolute before:top-0 before:left-0 before:bg-main-orange before:h-full before:w-[0.6rem] before:rounded-tr-full before:rounded-br-full`}
      >
        <span className="tooltip tooltip-right" data-tip={label}>
          <Icon className="cursor-pointer" />
        </span>
      </button>
    </Link>
  )
}
