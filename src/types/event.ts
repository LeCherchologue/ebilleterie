export interface Event {
  id: string
  title: string
  description: string
  image: string
  date: string
  location: string
  category: 'concert' | 'cinema' | 'theatre' | 'sport' | 'exposition' | 'show'
  price: number
  popular: boolean
  views: number
}

export type EventFilter = 'populaires' | 'recents'
export type EventCategory = 'concert' | 'cinema' | 'theatre' | 'sport' | 'exposition' | 'show'
