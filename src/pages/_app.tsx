import "../styles/globals.css"
import type { AppProps, AppType } from "next/app"
import Layout from "../components/layouts/Layout"
import { SessionProvider } from "next-auth/react"
import { trpc } from "../utils/trpc"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false, //* don't refetch in mount(first time, not at every rerender) if data is in cache, otherwise refetch no matter what is my value
      refetchOnReconnect: false,
    },
  },
})

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Toaster position="top-right" reverseOrder={false} />
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
// export default MyApp
