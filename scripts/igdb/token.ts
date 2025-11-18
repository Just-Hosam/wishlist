const clientId = process.env.IGDB_CLIENT_ID
const clientSecret = process.env.IGDB_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error(
    "Error: TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set in the environment variables."
  )
  process.exit(1)
}

const fetchTwitchToken = async () => {
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials"
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch token. Status code: ${response.status}`)
  }

  const data = await response.json()
  return data.access_token
}

;(async () => {
  try {
    const token = await fetchTwitchToken()
    console.log("Twitch Bearer Token:", token)
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching Twitch token:", error.message)
    } else {
      console.error("Unknown error occurred.")
    }
    process.exit(1)
  }
})()
