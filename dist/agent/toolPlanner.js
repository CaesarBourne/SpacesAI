import { geminiModel } from "../config/gemini.js";
export async function decideTool(query) {
    const decisionPrompt = `
    You are a reasoning agent that decides which tool to use.
    Available tools:
    - "web_search": when the user wants live info (news, prices, trends).
    - "calculator": when the query involves numbers, math, or percentages.
    - "api_request": when the user gives an API URL, mentions "API", or asks to "fetch", "call", or "get" data from an endpoint.
    If no tool is needed, respond with {"tool": null}.
    Respond ONLY in JSON.
    
    User query: "${query}"
    `;
    try {
        const result = await geminiModel.generateContent({
            contents: [{ role: "user", parts: [{ text: decisionPrompt }] }],
        });
        const text = result.response.text().trim();
        // parse JSON from Gemini
        const match = text.match(/\{[\s\S]*\}/);
        if (!match)
            return { tool: null };
        const parsed = JSON.parse(match[0]);
        if (!("tool" in parsed))
            return { tool: null };
        return parsed;
    }
    catch (err) {
        console.error("Tool planner error:", err);
        return { tool: null };
    }
}
