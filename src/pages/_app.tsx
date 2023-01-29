import "../styles/globals.css"
import type { AppProps, AppType } from "next/app"
import Layout from "../components/layouts/Layout"
import { SessionProvider } from "next-auth/react"
import { trpc } from "../utils/trpc"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import type { ReactElement, ReactNode } from "react"
import type { NextComponentType, NextPage } from "next"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false, //* don't refetch in mount(first time, not at every rerender) if data is in cache, otherwise refetch no matter what is my value
      refetchOnReconnect: false,
    },
  },
})

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Toaster position="top-right" reverseOrder={false} />
        {getLayout(<Component {...pageProps} />)}
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default trpc.withTRPC(MyApp)
// export default MyApp
