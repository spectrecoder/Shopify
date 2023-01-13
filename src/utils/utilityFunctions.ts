import { ActiveListItem } from "../types/types"

export function formatDate(myDate: Date) {
  const date = new Date(myDate)
  const options: { month: "long"; year: "numeric" } = {
    month: "long",
    year: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}

export function formateDateTwo(myDate: Date) {
  const date = new Date(myDate)
  const options: {
    weekday: "short"
    day: "numeric"
    month: "numeric"
    year: "numeric"
  } = { weekday: "short", day: "numeric", month: "numeric", year: "numeric" }
  return date.toLocaleDateString("en-US", options)
}

export function formateListItems(listItems: ActiveListItem[]) {
  const filtered: { [key: string]: ActiveListItem[] } = {}

  listItems.forEach((i) => {
    if (i.item.category && i.item.category.name in filtered) {
      filtered[i.item.category.name] = [...filtered[i.item.category.name], i]
    } else if (i.item.category && !(i.item.category.name in filtered)) {
      filtered[i.item.category.name] = [i]
    }
  })

  return Object.entries(filtered)
}
