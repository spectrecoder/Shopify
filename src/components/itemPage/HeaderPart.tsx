import { AiOutlineSearch } from "react-icons/ai"

export default function HeaderPart() {
  return (
    <div className="flex justify-between mb-[5.7rem]">
      <h1 className="w-[45rem] text-4xl text-[#34333A] font-semibold leading-[3.25rem]">
        <span className="font-bold text-main-orange">Shoppingify</span> allows
        you take your shopping list wherever you go
      </h1>

      <form className="rounded-xl bg-white w-[27.5rem] h-[5rem] shadow1 flex items-center gap-x-6 px-8">
        <AiOutlineSearch className="text-4xl text-[#34333A]" />
        <input
          type="text"
          placeholder="search item"
          className="text-[#34333A] text-xl font-medium w-full"
        />
      </form>
    </div>
  )
}
