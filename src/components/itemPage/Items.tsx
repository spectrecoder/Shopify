import CategoryItems from "./CategoryItems"
import HeaderPart from "./HeaderPart"

export default function Items() {
  return (
    <section className="flex-grow h-full py-14 px-32 overflow-scroll hideScrollbar">
      <HeaderPart />
      <CategoryItems />
      <CategoryItems />
      <CategoryItems />
      <CategoryItems />
    </section>
  )
}
