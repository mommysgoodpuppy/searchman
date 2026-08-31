// Exa API shim: handles fetch + JSON stringify to avoid FFI partial-inference issue.
// Returns a plain object decoded via Json.assert on the Workman side.

export async function exaSearch(apiKey: string, query: string): Promise<{ answer: string; sources: { title: string; url: string }[] }> {
  const response = await fetch("https://api.exa.ai/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const data = await response.json() as {
    answer?: string;
    citations?: Array<{ title?: string; url?: string }>;
  };

  const answer = data.answer ?? "";
  const sources = (data.citations ?? [])
    .filter((c) => c.url)
    .map((c) => ({ title: c.title ?? "Untitled", url: c.url! }));

  return { answer, sources };
}
