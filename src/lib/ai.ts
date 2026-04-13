const MODEL = "meta/llama-3.1-70b-instruct";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function askAI(
  question: string,
  documentText: string,
  history: { role: "user" | "assistant"; text: string }[]
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `You are a helpful academic assistant. A student has uploaded their module guide.
Answer questions based ONLY on the content of the document below.
Be concise, friendly, and use bullet points or formatting where helpful.
If the answer is not in the document, say so clearly.

--- MODULE GUIDE ---
${documentText.slice(0, 28000)}
--- END ---`,
    },
    ...history.map((h) => ({ role: h.role, content: h.text })),
    { role: "user", content: question },
  ];

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.5, max_tokens: 1024 }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();

  if (data.error) throw new Error(data.error);

  return data.choices[0].message.content as string;
}
