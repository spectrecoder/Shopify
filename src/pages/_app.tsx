import "../styles/globals.css"
import type { AppProps, AppType } from "next/app"
import Layout from "../components/layouts/Layout"
import { SessionProvider } from "next-auth/react"
import { trpc } from "../utils/trpc"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default trpc.withTRPC(MyApp)
