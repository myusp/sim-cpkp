import { useAppContext } from '@/context'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

const IndexPage = () => {
  const navigate = Route.useNavigate()
  const appContext = useAppContext()
  useEffect(() => {
    if (appContext.isLoggedIn) {
      navigate({ to: `/${appContext.user?.role}` })
    } else {
      navigate({ to: "/login" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appContext.isLoggedIn])

  return <>
  </>
}

export const Route = createLazyFileRoute('/')({
  component: IndexPage
})