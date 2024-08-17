
import "@/App.css"
import { ConfigProvider } from 'antd'
import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { AppContextProvider } from './context'
import { Suspense } from "react"

const hashHistory = createHashHistory({})
// Create a new router instance
const router = createRouter({ routeTree, history: hashHistory })
// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <AppContextProvider>
      <Suspense>
        <ConfigProvider
          theme={{
            token: {
              "colorPrimary": "#18ac96",
              "colorInfo": "#6ea4fa",
              "colorSuccess": "#a0d911",
              "colorWarning": "#fadb14",
              "wireframe": false,
              "fontSize": 16,
              "borderRadius": 12
            }
          }}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </Suspense>

    </AppContextProvider>
  )
}

export default App
