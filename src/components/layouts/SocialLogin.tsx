import { FaDiscord, FaGithub, FaGoogle, FaTwitter } from "react-icons/fa"

export default function SocialLogin() {
  return (
    <div className="flex justify-center items-center gap-x-8 mb-12">
      <button className="w-16 h-16 rounded-full border border-solid border-[#828282] flex items-center justify-center">
        <FaGoogle className="text-[#828282] text-3xl" />
      </button>

      <button className="w-16 h-16 rounded-full border border-solid border-[#828282] flex items-center justify-center">
        <FaTwitter className="text-[#828282] text-3xl" />
      </button>

      <button className="w-16 h-16 rounded-full border border-solid border-[#828282] flex items-center justify-center">
        <FaDiscord className="text-[#828282] text-3xl" />
      </button>

      <button className="w-16 h-16 rounded-full border border-solid border-[#828282] flex items-center justify-center">
        <FaGithub className="text-[#828282] text-3xl" />
      </button>
    </div>
  )
}
