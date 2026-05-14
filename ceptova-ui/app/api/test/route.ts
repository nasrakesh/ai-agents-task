import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetch(
  "https://ai-agent-service-new-502854994569.us-central1.run.app/apps/agent_comparison__app/users/test_user_456/sessions/new_session_" + Date.now() + ":run",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: {
        role: "user",
        parts: [
          {
            
text: JSON.stringify({
  country: userText
})

          }
        ]
      }
    })
  }
);


    const text = await res.text();

    console.log("🔥 RAW BACKEND RESPONSE:", text);

    return new NextResponse(text);

  } catch (err) {
    console.error("API ERROR:", err);
    return new NextResponse("ERROR");
  }
}
