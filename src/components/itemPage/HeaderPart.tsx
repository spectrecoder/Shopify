import { AiOutlineSearch } from "react-icons/ai"

export default function HeaderPart() {
  return (
    <div className="flex md:flex-row flex-col gap-x-5 justify-between mb-[5.7rem]">
      <h1 className="md:w-[45rem] w-auto text-2xl md:text-3xl lg:text-4xl text-[#34333A] mb-4 font-semibold md:leading-[3.25rem] leading-[2.5rem]">
        <span className="font-bold text-main-orange">Shoppingify</span> allows
        you take your shopping list wherever you go
      </h1>

      <form className="rounded-xl bg-white sm:w-[27.5rem] w-full h-[5rem] shadow1 flex items-center gap-x-6 px-8">
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
