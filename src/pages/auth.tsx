import Image from "next/image"
import SocialLogin from "../components/layouts/SocialLogin"
import { useState } from "react"

export default function Auth() {
  const [isRegister, setIsRegister] = useState<boolean>(false)

  return (
    <section className="flex items-center justify-center h-screen bg-white">
      <form className="bg-white border-2 border-solid border-[#BDBDBD] rounded-3xl py-14 px-20 w-[47.3rem] overflow-scroll hideScrollbar">
        <div className="flex items-center mb-12 gap-x-6">
          <Image src="/images/logo.svg" alt="logo" width={42} height={42} />
          <span className="text-4xl font-bold text-main-orange">
            Shoppingify
          </span>
        </div>

        {isRegister ? (
          <h1 className="text-[#333333] text-3xl font-bold mb-11">Register</h1>
        ) : (
          <h1 className="text-[#333333] text-3xl font-bold mb-11">Login</h1>
        )}

        <div className="mb-6 group">
          <label htmlFor="name" className="labelStyle">
            Email
          </label>
          <input
            type="email"
            id="name"
            placeholder="Enter your email"
            className="h-20 inputStyle"
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
            className="h-20 inputStyle"
          />
        </div>

        {isRegister ? (
          <input
            type="submit"
            className="w-full h-16 mb-12 text-2xl font-bold text-white capitalize btn btn-warning rounded-2xl"
            value="Register"
          />
        ) : (
          <input
            type="submit"
            className="w-full h-16 mb-12 text-2xl font-bold text-white capitalize btn btn-warning rounded-2xl"
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
            {"Don't"} have an account yet?
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
