import { NextRequest, NextResponse } from "next/server"

// Coze API Configuration
const COZE_API_BASE = process.env.COZE_API_BASE || "https://api.coze.com"
const COZE_BOT_ID = process.env.COZE_BOT_ID
const COZE_API_KEY = process.env.COZE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_id } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    if (!COZE_BOT_ID || !COZE_API_KEY) {
      console.error("Missing Coze configuration")
      return NextResponse.json(
        { error: "Chatbot is not properly configured" },
        { status: 500 }
      )
    }

    // Call Coze API
    // Note: Adjust the endpoint and payload based on your Coze API version
    const response = await fetch(
      `${COZE_API_BASE}/v3/chat`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${COZE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bot_id: COZE_BOT_ID,
          user_id: "anonymous", // Or store user_id if authenticated
          conversation_id: conversation_id || "default",
          messages: [
            {
              role: "user",
              content: message,
              content_type: "text",
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error("Coze API error:", error)
      return NextResponse.json(
        { error: "Failed to get response from Coze" },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract the reply from Coze response
    // Adjust based on your Coze API response structure
    const reply =
      data.messages?.[0]?.content ||
      data.reply ||
      "Xin lỗi, tôi không thể trả lời lúc này."

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Error in Coze API route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
