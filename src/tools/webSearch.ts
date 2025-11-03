// app.use("/api/v1", chatRoute);
import dotenv from "dotenv";
import { getFromCache, setToCache } from "../utils/cache";

type TavilyResponse = {
  answer?: string;
  results?: { title: string; content: string }[];
};

dotenv.config();

const TAVILY_URL = "https://api.tavily.com/search";

export async function webSearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  const cached = getFromCache(query);
  if (cached) {
    console.log("⚡ Returning cached web search result for:", query);
    return cached;
  }

  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is missing in .env");
  }

  try {
    const response = await fetch(TAVILY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: 3,
        include_answer: true,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Tavily API error: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as TavilyResponse;

    const summary =
      data.answer ||
      data.results
        ?.map((r: any, i: number) => `${i + 1}. ${r.title}: ${r.content}`)
        .join("\n") ||
      "No relevant results found.";

    const result = `${summary}`;
    setToCache(query, result);

    return result;
  } catch (err: any) {
    console.error("webSearch error:", err.message);
    return "Web search failed or unavailable.";
  }
}
