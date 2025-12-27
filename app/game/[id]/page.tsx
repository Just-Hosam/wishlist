import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function GamePage({ params }: Props) {
  const { id } = await params
  if (!id) notFound()

  return <div>{id}</div>
}
