const EXHIBITION_EMAIL_KEY = "exhibitionEmail"
const EXHIBITION_NAME_KEY = "exhibitionParticipantName"

function createGuestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function ensureExhibitionParticipant() {
  if (typeof window === "undefined") {
    return { email: "", name: "Khách tham quan" }
  }

  let email = localStorage.getItem(EXHIBITION_EMAIL_KEY)
  let name = localStorage.getItem(EXHIBITION_NAME_KEY)

  if (!email) {
    email = `${createGuestId()}@guest.exhibition.local`
    localStorage.setItem(EXHIBITION_EMAIL_KEY, email)
  }

  if (!name) {
    name = "Khách tham quan"
    localStorage.setItem(EXHIBITION_NAME_KEY, name)
  }

  return { email, name }
}
