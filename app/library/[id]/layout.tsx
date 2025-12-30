import { PageHeader } from "@/components/layout/PageHeader"

interface Props {
  children: React.ReactNode
}

export default async function LibraryGameLayout({ children }: Props) {
  return (
    <>
      <PageHeader showBackButton />

      {children}
    </>
  )
}
