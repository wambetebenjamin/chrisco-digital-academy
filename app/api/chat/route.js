export async function POST(request) {
  const { messages } = await request.json()

  // Keep the latest message available
  const latestMessage =
    messages?.[messages.length - 1]?.content || ""

  return Response.json({
    message: latestMessage
  })
}