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
  category: Category | null
  id: string
  name: string
  quantity: number
  isDone: boolean
}
