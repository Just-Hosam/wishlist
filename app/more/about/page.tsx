import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  FileText,
  Gamepad2,
  Github,
  Linkedin,
  User
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <>
      <PageHeader pageName="About" showBackButton />

      <section
        className="mb-7 mt-4 duration-500 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
        style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
      >
        <div className="mb-3 flex items-center gap-3">
          <Gamepad2 size={24} className="text-primary" />
          <h2 className="text-xl font-medium">Playward</h2>
        </div>
        <p className="text-sm">
          Playward helps you organize and track your video game collection and
          wishlist.
        </p>
      </section>

      <section
        className="duration-500 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
        style={{ animationDelay: "50ms", animationFillMode: "backwards" }}
      >
        <div className="mb-3 flex items-center gap-3">
          <User size={24} className="text-primary" />
          <h2 className="text-xl font-medium">About the Developer</h2>
        </div>
        <div className="space-y-4 text-sm">
          <p>
            Hi! I'm Sam, I made Playward as a personal project to track the
            games I play.
          </p>
          <p>
            If you have any feedback or ideas for Playward, I'd love to hear
            them. I'm always tinkering with new features.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          <Link
            href="https://github.com/Just-Hosam"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-auto w-full justify-between gap-3 p-4"
            >
              <div className="flex items-center gap-2">
                <Github size={24} />
                <span className="font-semibold">GitHub</span>
              </div>
              <ExternalLink size={16} className="text-muted-foreground" />
            </Button>
          </Link>

          <Link
            href="https://www.linkedin.com/in/hosam-dahrooge/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-auto w-full justify-between gap-3 p-4"
            >
              <div className="flex items-center gap-2">
                <Linkedin size={24} />
                <span className="font-semibold">LinkedIn</span>
              </div>
              <ExternalLink size={16} className="text-muted-foreground" />
            </Button>
          </Link>

          <Link
            href="https://samdahrooge.com/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-auto w-full justify-between gap-3 p-4"
            >
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span className="font-semibold">Resume</span>
              </div>
              <ExternalLink size={16} className="text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </section>

      <section
        className="mt-8 duration-500 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
        style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
      >
        <div className="text-center text-xs text-muted-foreground">
          version {process.env.APP_VERSION}
        </div>
      </section>
    </>
  )
}
