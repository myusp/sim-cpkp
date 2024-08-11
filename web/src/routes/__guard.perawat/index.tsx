import { createFileRoute } from '@tanstack/react-router'

const PerawatIndexPage = () => {
  return <>perawat</>
}

export const Route = createFileRoute('/__guard/perawat/')({
  component: PerawatIndexPage
})