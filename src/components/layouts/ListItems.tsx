import { QueryClient } from "@tanstack/react-query"
import { ActiveListItem } from "../../types/types"
import ListItem from "./ListItem"

interface Props {
  showEdit: boolean
  catItems: [string, ActiveListItem[]]
  queryClient: QueryClient
  listId: string
}

export default function ListItems({
  showEdit,
  catItems,
  queryClient,
  listId,
}: Props) {
  return (
    <div className="mt-[3.9rem]">
      <p className="text-2xl font-semibold text-[#828282]">{catItems[0]}</p>

      {catItems[1].map((item) => (
        <ListItem
          key={item.id}
          showEdit={showEdit}
          item={item}
          queryClient={queryClient}
          listId={listId}
        />
      ))}
    </div>
  )
}
