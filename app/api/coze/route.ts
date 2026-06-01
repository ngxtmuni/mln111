import { NextRequest, NextResponse } from "next/server"

const COZE_API_BASE =
  process.env.COZE_API_BASE || "https://api.coze.com"

const COZE_BOT_ID = process.env.COZE_BOT_ID
const COZE_API_KEY = process.env.COZE_API_KEY

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

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
      return NextResponse.json(
        { error: "Missing Coze configuration" },
        { status: 500 }
      )
    }

    const payload = {
      bot_id: COZE_BOT_ID,
      user_id: "anonymous_user",
      conversation_id: conversation_id || "default",
      stream: false,
      additional_messages: [
        {
          role: "user",
          content: message,
          content_type: "text",
          type: "question",
        },
      ],
    }

    console.log("🚀 Creating chat...")

    const createResponse = await fetch(
      `${COZE_API_BASE}/v3/chat`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${COZE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    if (!createResponse.ok) {
      const error = await createResponse.text()

      console.error("Create chat failed:", error)

      return NextResponse.json(
        { error: "Failed to create chat" },
        { status: createResponse.status }
      )
    }

    const createData = await createResponse.json()

    console.log(
      "Create response:",
      JSON.stringify(createData, null, 2)
    )

    const chatId = createData?.data?.id
    const conversationId =
      createData?.data?.conversation_id

    if (!chatId || !conversationId) {
      throw new Error(
        "Missing chat_id or conversation_id"
      )
    }

    let status = createData?.data?.status
    let attempts = 0
    const maxAttempts = 30

    console.log("⏳ Waiting for completion...")

    while (
      status === "in_progress" &&
      attempts < maxAttempts
    ) {
      await sleep(1000)

      const retrieveResponse = await fetch(
        `${COZE_API_BASE}/v3/chat/retrieve?chat_id=${chatId}&conversation_id=${conversationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${COZE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )
      console.log(`${COZE_API_BASE}/v3/chat/retrieve?chat_id=${chatId}&conversation_id=${conversationId}`)
      const retrieveData =
        await retrieveResponse.json()
      console.log("Retrieve response:",JSON.stringify(retrieveData, null, 2))  

      status = retrieveData?.data?.status

      console.log(
        `Poll #${attempts + 1}:`,
        status
      )

      if (status === "completed") {
        break
      }

      if (
        status === "failed" ||
        status === "cancelled"
      ) {
        throw new Error(
          `Chat ended with status: ${status}`
        )
      }

      attempts++
    }

    if (status !== "completed") {
      throw new Error(
        "Chat timeout waiting for completion"
      )
    }

    console.log("✅ Chat completed")

    const messagesResponse = await fetch(
      `${COZE_API_BASE}/v3/chat/message/list?conversation_id=${conversationId}&chat_id=${chatId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${COZE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!messagesResponse.ok) {
      const error = await messagesResponse.text()

      throw new Error(
        `Message list failed: ${error}`
      )
    }

    const messagesData =
      await messagesResponse.json()

    console.log(
      "Messages response:",
      JSON.stringify(messagesData, null, 2)
    )

    const answerMessage =
      messagesData?.data?.find(
        (msg: any) =>
          msg.role === "assistant" &&
          msg.type === "answer"
      )

    const reply =
      answerMessage?.content ||
      "Xin lỗi, tôi không thể trả lời lúc này."

    console.log("✅ Final reply:", reply)

    return NextResponse.json({
      reply,
      conversation_id: conversationId,
    })
  } catch (error) {
    console.error("❌ Chat API Error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    )
  }
}