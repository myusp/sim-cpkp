import { createFileRoute, Outlet } from '@tanstack/react-router'

const GuardSession = () => {
    return <Outlet />
}

export const Route = createFileRoute('/__guard')({
    component: () => <GuardSession />
})