import Image from "next/image"
import SocialLogin from "../components/layouts/SocialLogin"
import { useState } from "react"

export default function auth() {
  const [isRegister, setIsRegister] = useState<boolean>(false)

  return (
    <section className="bg-white flex justify-center items-center h-screen">
      <form className="bg-white border-2 border-solid border-[#BDBDBD] rounded-3xl py-14 px-20 w-[47.3rem] overflow-scroll hideScrollbar">
        <div className="flex items-center gap-x-6 mb-12">
          <Image src="/images/logo.svg" alt="logo" width={42} height={42} />
          <span className="font-bold text-main-orange text-4xl">
            Shoppingify
          </span>
        </div>

        {isRegister ? (
          <h1 className="text-[#333333] text-3xl font-bold mb-11">Register</h1>
        ) : (
          <h1 className="text-[#333333] text-3xl font-bold mb-11">Login</h1>
        )}

        <div className="group mb-6">
          <label htmlFor="name" className="labelStyle">
            Email
          </label>
          <input
            type="email"
            id="name"
            placeholder="Enter your email"
            className="inputStyle h-20"
          />
        </div>

        <div className="group mb-9">
          <label htmlFor="name" className="labelStyle">
            Password
          </label>
          <input
            type="password"
            id="name"
            placeholder="Enter your password"
            className="inputStyle h-20"
          />
        </div>

        {isRegister ? (
          <input
            type="submit"
            className="btn btn-warning rounded-2xl w-full h-16 font-bold text-white text-2xl capitalize mb-12"
            value="Register"
          />
        ) : (
          <input
            type="submit"
            className="btn btn-warning rounded-2xl w-full h-16 font-bold text-white text-2xl capitalize mb-12"
            value="Login"
          />
        )}

        <p className="font-medium text-[#828282] text-2xl text-center mb-9">
          or continue with these social profile
        </p>

        <SocialLogin />

        {isRegister ? (
          <p className="font-medium text-[#828282] text-2xl text-center">
            Already have an account?
            <span
              className="text-[#2D9CDB] cursor-pointer"
              onClick={() => setIsRegister(false)}
            >
              {" "}
              Login
            </span>
          </p>
        ) : (
          <p className="font-medium text-[#828282] text-2xl text-center">
            Don't have an account yet?
            <span
              className="text-[#2D9CDB] cursor-pointer"
              onClick={() => setIsRegister(true)}
            >
              {" "}
              Register
            </span>
          </p>
        )}
      </form>
    </section>
  )
}
