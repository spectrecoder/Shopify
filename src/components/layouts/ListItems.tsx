import ListItem from "./ListItem"

interface Props {
  showEdit: boolean
}

export default function ListItems({ showEdit }: Props) {
  return (
    <div className="mt-[3.9rem]">
      <p className="text-2xl font-semibold text-[#828282]">
        Fruit and vegetables
      </p>

      <ListItem showEdit={showEdit} />
      <ListItem showEdit={showEdit} />
      <ListItem showEdit={showEdit} />
    </div>
  )
}
