import type { ShoppingItem } from '../types/shopping'

export const initialItems: ShoppingItem[] = [
  { id: '1', name: 'Tomates italianos', quantity: '6 un', category: 'Hortifruti', price: 8.9, purchased: false },
  { id: '2', name: 'Pão de fermentação natural', quantity: '1 un', category: 'Padaria', price: 18, purchased: false },
  { id: '3', name: 'Abacates maduros', quantity: '2 un', category: 'Hortifruti', price: 12.5, purchased: true },
  { id: '4', name: 'Leite de aveia', quantity: '1 L', category: 'Mercearia', price: 14.9, purchased: false },
  { id: '5', name: 'Flores da estação', quantity: '1 buquê', category: 'Casa', price: 24, purchased: false },
]
