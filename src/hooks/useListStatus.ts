import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { trpc } from "../utils/trpc"
import { Dispatch, SetStateAction, RefObject } from "react"
import { RouterOutput } from "../server/trpc"

interface Props {
  setShowEdit: Dispatch<SetStateAction<boolean>>
  ref?: RefObject<HTMLLabelElement>
}

export default function useListStatus({ setShowEdit, ref }: Props) {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = trpc.list.listStatus.useMutation({
    onSuccess: (data) => {
      ref?.current?.click()
      queryClient.setQueryData(
        [
          ["list", "read"],
          {
            type: "query",
          },
        ],
        null
      ),
        queryClient.setQueryData(
          [
            ["list", "allLists"],
            {
              type: "query",
            },
          ],
          (oldData: RouterOutput["list"]["allLists"] | undefined) => {
            if (oldData === undefined) return oldData
            return [data, ...oldData]
          }
        )
      toast.success("Successfully completed the list.")
    },
    onError: () => {
      toast.error("Server error. Please try again later.")
    },
    onSettled: () => {
      setShowEdit(false)
    },
  })

  return { mutate, isLoading }
}
