import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__guard/admin/form/assesment')({
  component: () => <div>Hello /__guard/admin/data/assesment!</div>
})