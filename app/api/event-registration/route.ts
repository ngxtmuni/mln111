import { NextResponse } from "next/server"

const DEFAULT_SCRIPT_URLS = [
  "https://script.google.com/macros/s/AKfycbwe0j7GertbEf-ZJKaPQThFtpn5NFMWOIcsjGgy48X2wBzlv7gVO2XldTkSNDvTOeZL8g/exec",
  "https://script.google.com/macros/s/AKfycby1e53hqLBFhTP75VWTHyo8bBFoq7XOdANtOEtXEM_ufRulqjM_xApZfoxRAzeKtNd6vA/exec",
]

function getScriptUrls() {
  const envValue = process.env.GOOGLE_SCRIPT_URLS?.trim()

  if (!envValue) {
    return DEFAULT_SCRIPT_URLS
  }

  return envValue
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    if (!payload?.event) {
      return NextResponse.json(
        { success: false, error: "Missing event slug." },
        { status: 400 },
      )
    }

    const scriptUrls = getScriptUrls()
    const errors: string[] = []

    for (const scriptUrl of scriptUrls) {
      try {
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        })

        const responseText = await response.text()
        const normalizedText = responseText.trim()

        if (response.ok && /success/i.test(normalizedText)) {
          return NextResponse.json({ success: true })
        }

        errors.push(`${scriptUrl}: ${normalizedText || `HTTP ${response.status}`}`)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown upstream error"
        errors.push(`${scriptUrl}: ${message}`)
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Google Sheets sync failed.",
        details: errors,
      },
      { status: 502 },
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid request payload."

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    )
  }
}
