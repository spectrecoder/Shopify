import Image from "next/image"
import { HiOutlineArrowNarrowLeft } from "react-icons/hi"

export default function Details() {
  return (
    <section className="w-[39rem] h-full bg-white pt-14 px-14 pb-64 overflow-scroll hideScrollbar">
      <button className="text-main-orange text-2xl flex items-center gap-x-2 font-bold mb-14">
        <HiOutlineArrowNarrowLeft />
        back
      </button>

      <div className="w-full h-[22rem] relative rounded-[2.5rem] overflow-hidden">
        <Image
          src="/images/avocado.jpg"
          alt="avocado"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="mt-12">
        <span className="text-xl text-[#C1C1C4] font-semibold block mb-4">
          name
        </span>
        <h1 className="black text-4xl font-semibold">Avocado</h1>
      </div>

      <div className="mt-12">
        <span className="text-xl text-[#C1C1C4] font-semibold block mb-4">
          category
        </span>
        <h2 className="black text-3xl font-semibold">Fruit and vegetables</h2>
      </div>

      <div className="mt-12">
        <span className="text-xl text-[#C1C1C4] font-semibold block mb-4">
          note
        </span>
        <h2 className="black text-2xl font-semibold leading-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit
          reiciendis doloremque dolorum esse eius unde? Laboriosam deleniti
          saepe ad quasi quas fugiat rem, molestias at nulla quos ipsam
          accusantium. Eius.
        </h2>
      </div>

      <div className="fixed bottom-0 right-0 w-[39rem] h-52 flex items-center justify-center bg-white">
        <div className="flex items-center justify-center gap-x-16">
          <button className="cancelBtn">cancel</button>
          <button className="btn btn-warning w-48 h-24 myBtn">
            Add to list
          </button>
        </div>
      </div>
    </section>
  )
}
