import { Button } from "@/components/ui/button"
import {
  Github,
  Linkedin,
  FileText,
  Gamepad2,
  User,
  ExternalLink,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <>
      <Link href="/lists">
        <Button variant="ghost" size="sm" className="mb-5 mt-2 gap-2">
          <ArrowLeft size={16} />
          Back to Playward
        </Button>
      </Link>
      <div className="mb-10">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold">About Playward</h1>
          <p className="text-muted-foreground">Manage your games with ease</p>
        </div>
      </div>

      <section className="mb-7">
        <div className="mb-4 flex items-center gap-3">
          <Gamepad2 size={16} className="text-primary" />
          <h2 className="text-xl font-semibold">About the App</h2>
        </div>
        <p className="text-muted-foreground">
          Playward helps you organize and track your video game collection and
          wishlist.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <User size={16} className="text-primary" />
          <h2 className="text-xl font-semibold">About the Developer</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
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
    </>
  )
}
