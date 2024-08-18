import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__guard/karu/')({
  component: () => <div>Hello /karu/!</div>
})