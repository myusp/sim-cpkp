import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/karu/')({
  component: () => <div>Hello /karu/!</div>
})