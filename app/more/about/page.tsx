import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  FileText,
  Gamepad2,
  Github,
  Linkedin
} from "lucide-react"
import { Link } from "@/components/navigation"

export default function AboutPage() {
  return (
    <div className="custom-slide-fade-in">
      <Gamepad2 size={130} strokeWidth={1.45} className="mx-auto -mb-2 -mt-3" />
      <h1 className="mb-2 text-center text-4xl font-semibold">Playward</h1>
      <div className="mb-7 text-center text-xs text-muted-foreground">
        version {process.env.APP_VERSION}
      </div>

      <div className="mb-6 space-y-4 text-sm">
        <p>
          Hey! I'm Sam, I made Playward as a personal project to track the games
          I play.
        </p>
        <p>
          If you have any feedback or ideas for Playward, I'd love to hear them.
          I'm always tinkering with new features.
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
            className="h-auto w-full justify-between gap-3 px-6 py-4"
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
            className="h-auto w-full justify-between gap-3 px-6 py-4"
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
            className="h-auto w-full justify-between gap-3 px-6 py-4"
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span className="font-semibold">Resume</span>
            </div>
            <ExternalLink size={16} className="text-muted-foreground" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
