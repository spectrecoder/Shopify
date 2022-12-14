import "../styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import Layout from "../components/layouts/Layout"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
