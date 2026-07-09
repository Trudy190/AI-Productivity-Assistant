export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function generateAI(input: {
  system?: string;
  prompt?: string;
  messages?: ChatMessage[];
}): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as { text?: string; error?: string };
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402)
      throw new Error("AI credits exhausted. Add credits in your workspace billing settings.");
    throw new Error(data.error ?? "Something went wrong");
  }
  return data.text ?? "";
}
