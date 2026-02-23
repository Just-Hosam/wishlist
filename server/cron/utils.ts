type CronStep = {
  path: string
  step: string
}

export type CronStepResult = {
  step: string
  ok: boolean
  status: number
  body: unknown
}

function getCronAuthHeaders(request: Request): HeadersInit {
  const authorization = request.headers.get("authorization")
  if (authorization) {
    return { authorization }
  }

  const providedSecret = request.headers.get("x-cron-secret")
  const configuredSecret = process.env.CRON_SECRET
  const secret = providedSecret ?? configuredSecret

  if (!secret) {
    throw new Error("Missing CRON_SECRET environment variable")
  }

  return { "x-cron-secret": secret }
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const rawBody = await response.text()
  if (!rawBody) return null

  try {
    return JSON.parse(rawBody) as unknown
  } catch {
    return rawBody
  }
}

export async function runCronStep(
  request: Request,
  { path, step }: CronStep
): Promise<CronStepResult> {
  const baseUrl = new URL(request.url)
  const endpoint = new URL(path, baseUrl.origin)

  const response = await fetch(endpoint, {
    method: "GET",
    headers: getCronAuthHeaders(request),
    cache: "no-store"
  })

  return {
    step,
    ok: response.ok,
    status: response.status,
    body: await parseResponseBody(response)
  }
}

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
