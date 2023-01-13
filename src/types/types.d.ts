import { Category } from "@prisma/client"

interface CurrentItem {
  categoryId: string
  itemId: string
  categoryName: string
  itemName: string
  note: string
  image: string
}

interface ActiveListItem {
  item: {
    category: Category | null
    id: string
    name: string
  }
  id: string
  quantity: number
  isDone: boolean
}
