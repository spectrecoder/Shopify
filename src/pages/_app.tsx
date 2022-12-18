import "../styles/globals.css"
import type { AppProps } from "next/app"
import Layout from "../components/layouts/Layout"
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      {Component.name === "auth" ||
      Component.name === "login" ||
      Component.name === "Error" ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  )
}
