/* eslint-disable */
// Déclaration de module pour vue-router
declare module 'vue-router' {
  export interface RouteRecordRaw {
    path: string
    name?: string
    component?: any
    children?: RouteRecordRaw[]
    [key: string]: any
  }

  export interface RouterHistory {
    [key: string]: any
  }

  export interface Router {
    push(to: string | { path: string }): Promise<void>
    replace(to: string | { path: string }): Promise<void>
    install(app: any): void
    [key: string]: any
  }

  export interface RouteLocationNormalized {
    params: Record<string, string>
    path: string
    [key: string]: any
  }

  export function createRouter(options: {
    history: RouterHistory
    routes: RouteRecordRaw[]
  }): Router

  export function createWebHashHistory(base?: string): RouterHistory

  export function useRouter(): Router
  export function useRoute(): RouteLocationNormalized
}
