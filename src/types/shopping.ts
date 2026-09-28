export const categories = ['Hortifruti', 'Padaria', 'Mercearia', 'Laticínios', 'Casa'] as const

export type Category = (typeof categories)[number]

export type ShoppingItem = {
  id: string
  name: string
  quantity: string
  category: Category
  price: number
  purchased: boolean
}
