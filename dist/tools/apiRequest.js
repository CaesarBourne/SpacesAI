import { getFromCache, setToCache } from "../utils/cache";
/**
 * 🌐 Generic API Request tool
 * Extracts URLs from text and fetches their JSON content.
 */
export async function apiRequest(input) {
    try {
        const cached = getFromCache(input);
        if (cached) {
            console.log("⚡ Returning cached API result for:", input);
            return cached;
        }
        // 🧠 1️⃣ Extract URL from input (handles natural language like "fetch from https://...")
        const urlMatch = input.match(/(https?:\/\/[^\s"']+)/i // finds the first valid URL
        );
        if (!urlMatch) {
            return "⚠️ No valid URL found in input.";
        }
        const url = urlMatch[1].trim();
        // 🛰️ 2️⃣ Perform the actual API call
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
            return `API request failed: ${response.status} ${response.statusText}`;
        }
        const data = await response.json();
        const summary = typeof data === "object"
            ? JSON.stringify(data, null, 2).slice(0, 1000)
            : String(data);
        const result = `📡 API Response (from ${url}):\n${summary}`;
        setToCache(input, result);
        return result;
    }
    catch (err) {
        console.error("apiRequest error:", err.message);
        return `API request error: ${err.message}`;
    }
}
