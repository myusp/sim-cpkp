import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__guard/admin/form/penilaian')({
  component: () => <div>Hello /__guard/admin/data/penilaian!</div>
})