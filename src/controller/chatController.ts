import { Request, Response } from "express";
import { geminiModel } from "../config/gemini.ts";
import { webSearch } from "../tools/webSearch.ts";
import { decideTool } from "../agent/toolPlanner.ts";
import { calculator } from "../tools/calculator.ts";
import { apiRequest } from "../tools/apiRequest.ts";

interface ChatEvent {
  type: "reasoning" | "response" | "done" | "error" | "tool_call";
  tool?: string;
  input?: string;
  output?: string;
  content?: string;
}

// Handles streaming agentic chat logic

export async function handleChat(req: Request, res: Response) {
  const { query } = req.body;

  // stream data to client
  const sendEvent = (data: ChatEvent) => {
    res.write(JSON.stringify(data) + "\n");
  };

  sendEvent({
    type: "reasoning",
    content: "Thinking...",
  });

  try {
    // Let Gemini decide which tool to use
    const decision = await decideTool(query);
    console.log("Tool decision:", decision);

    let context = "";

    // web search
    if (decision.tool === "web_search") {
      sendEvent({
        type: "tool_call",
        tool: "web_search",
        input: decision.input || query,
      });

      const searchResult = await webSearch(decision.input || query);

      sendEvent({
        type: "tool_call",
        tool: "web_search",
        output: searchResult,
      });

      context = `Here are the latest web search results:\n${searchResult}`;
    }

    // calculator
    if (decision.tool === "calculator") {
      sendEvent({
        type: "tool_call",
        tool: "calculator",
        input: decision.input || query,
      });

      const calcResult = calculator(decision.input || query);

      sendEvent({
        type: "tool_call",
        tool: "calculator",
        output: calcResult,
      });

      context = `Computation result:\n${calcResult}`;
    }

    // API requests
    if (decision.tool === "api_request") {
      sendEvent({
        type: "tool_call",
        tool: "api_request",
        input: decision.input || query,
      });

      const apiResult = await apiRequest(decision.input || query);

      sendEvent({
        type: "tool_call",
        tool: "api_request",
        output: apiResult,
      });

      context = `Here are the API results:\n${apiResult}`;
    }

    // Generate reasoning stream from Gemini
    const result = await geminiModel.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${context}\n\nNow answer the following question:\n${query}`,
            },
          ],
        },
      ],
    });

    // Stream partial reasoning output
    let fullText = "";

    for await (const chunk of result.stream) {
      const token = chunk.text();
      if (token) {
        fullText += token;
        sendEvent({ type: "reasoning", content: token });
      }
    }

    // Send final response and end stream
    sendEvent({ type: "response", content: fullText.trim() });
    sendEvent({ type: "done" });
    res.end();
  } catch (err: any) {
    console.error("Error in handleChat:", err.message);

    sendEvent({
      type: "error",
      content: "An unexpected error occurred while processing your request.",
    });

    res.end();
  }
}
