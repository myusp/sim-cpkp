import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__guard/admin/data/akun')({
  component: () => <div>Hello /__guard/admin/data/akun!</div>
})