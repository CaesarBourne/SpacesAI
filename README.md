# 🧠 Agentic Chat Backend (Express + TypeScript + Gemini)

> A modular **agentic backend** built with **Node.js, Express, and TypeScript**, powered by **Google Gemini** for reasoning, tool calls, and real-time **Server-Sent Event (SSE)** streaming.
> The server dynamically decides which tools to use — `web_search`, `calculator`, or `api_request` — to enrich responses with external context and structured reasoning.

---

## ⚡ Quick Start for Developers

> A one-minute setup guide for engineers and contributors.

### 🧩 1. Clone & Install

```bash
git clone https://github.com/yourusername/agentic-chat-backend.git
cd agentic-chat-backend
npm install
```

---

### 🔑 2. Environment Setup

Create a `.env` file in the project root:

```bash
GEMINI_API_KEY=your_google_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
PORT=3000
```

> 🧠 `GEMINI_API_KEY` → used for reasoning & generation
> 🌍 `TAVILY_API_KEY` → used for live web search results

---

### 🚀 3. Run the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm run build && node dist/server.js
```

Expected output:

```
✅ Server listening on port 3000
```

---

### 💬 4. Test Live Streaming

Use **curl** or **Postman**:

```bash
curl -N -X POST http://localhost:3000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"current bitcoin price"}'
```

Live stream response example:

```json
{"type":"reasoning","content":"Starting reasoning with Gemini..."}
{"type":"tool_call","tool":"web_search","input":"current bitcoin price"}
{"type":"tool_call","output":"Web Search Summary: Bitcoin ≈ $111,000 USD"}
{"type":"response","content":"The current Bitcoin price is $111,000 USD."}
{"type":"done"}
```

> 🧩 Each line is a JSON event streamed in real time — perfect for chat UIs.

---

## 🧠 System Architecture

```
Frontend (React / Next.js)
       ↓
 POST /chat
       ↓
 ┌────────────────────────────────────┐
 │ Express Middleware (SSE + JSON)    │
 ├────────────────────────────────────┤
 │ Controller: handleChat()           │
 │   ↳ decideTool(query)              │
 │       ├─ web_search (Tavily API)   │
 │       ├─ calculator (math parser)  │
 │       └─ api_request (fetch JSON)  │
 │   ↳ geminiModel.generateStream()   │
 │   ↳ Stream tokens → Client (SSE)   │
 └────────────────────────────────────┘
```

---

## 🧩 Key Features

| Feature                       | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| 🧠 **Agentic Reasoning**      | Gemini decides when to call a tool before responding |
| 🌐 **Web Search Integration** | Uses Tavily API to fetch real-time data              |
| 🧮 **Calculator Tool**        | Evaluates expressions and equations                  |
| 🔗 **API Request Tool**       | Makes external GET requests and summarizes responses |
| ⚡ **Streaming Output**       | Returns incremental reasoning as JSON via SSE        |
| 🧱 **TypeScript-first**       | Strongly typed, modular, and production-ready        |
| 🧩 **Extensible Design**      | Add more tools (DB, Images, etc.) easily             |

---

## 🗂️ Folder Structure

```
server/
├── src/
│   ├── agent/
│   │   └── toolPlanner.ts         # Determines which tool to use
│   ├── config/
│   │   └── gemini.ts              # Gemini client setup
│   ├── controllers/
│   │   └── chatController.ts      # Handles reasoning and streaming
│   ├── middleware/
│   │   ├── sseHeaders.ts          # SSE header setup
│   │   └── validateChatInput.ts   # Input validation middleware
│   ├── routes/
│   │   └── chatRoute.ts           # Maps /chat → controller
│   ├── tools/
│   │   ├── apiRequest.ts          # External API calls
│   │   ├── calculator.ts          # Expression evaluation
│   │   └── webSearch.ts           # Live web search (Tavily)
│   ├── app.ts                     # Express app configuration
│   └── server.ts                  # Entry point — starts HTTP server
├── .env
├── package.json
└── tsconfig.json
```

---

## 🧩 API Reference

### `POST /chat`

Accepts a query string and returns streaming JSON events.

#### ✅ Request Body

```json
{ "query": "fetch current weather in Lagos" }
```

#### 🔄 Event Stream Response

| Type        | Meaning                     |
| ----------- | --------------------------- |
| `reasoning` | Step-by-step model thoughts |
| `tool_call` | Indicates a tool execution  |
| `response`  | Final summarized answer     |
| `done`      | Stream end signal           |

#### 🔧 Example Output

```json
{"type":"reasoning","content":"Starting reasoning with Gemini..."}
{"type":"tool_call","tool":"api_request","input":"https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current_weather=true"}
{"type":"tool_call","tool":"api_request","output":"📡 API Response: 31°C, partly cloudy"}
{"type":"response","content":"The current weather in Lagos is 31°C and partly cloudy."}
{"type":"done"}
```

---

## 🧮 Supported Tools

| Tool            | Trigger                                    | Description                                      |
| --------------- | ------------------------------------------ | ------------------------------------------------ |
| **web_search**  | “current”, “latest”, “today”, “2025”, etc. | Fetches live web results via Tavily API          |
| **calculator**  | Numeric expressions (`2+2*3`, `(5^2)/4`)   | Parses and returns evaluated math                |
| **api_request** | Queries containing valid URLs              | Performs safe external fetch and summarizes JSON | 

---

## 💻 Live Examples

### Example 1: Web Search

```bash
curl -N -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"latest inflation data in Nigeria"}'
```

### Example 2: Calculator

```bash
curl -N -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"(12 + 8) / 5"}'
```

### Example 3: API Request

```bash
curl -N -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"fetch current weather in Lagos from https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current_weather=true"}'
```

---

## 🧩 Integration with Frontend

The frontend (React/Next.js) can consume this SSE stream using:

```js
const eventSource = new EventSource("/chat");

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.content);
};
```

> Perfect for real-time chatbots, dashboards, or developer tools.

---

## 🧪 Testing

Install and run:

```bash
npm install --save-dev jest ts-jest supertest @types/jest
npm test
```

Example test file:
`tests/chat.test.ts`

```ts
import request from "supertest";
import app from "../src/app";

describe("POST /chat", () => {
  it("returns streamed reasoning", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ query: "2+2" })
      .expect(200);
    expect(res.text).toContain("reasoning");
  });
});
```

---

## 🧩 Deployment

You can deploy this backend easily to:

- **Render**, **Railway**, or **Fly.io** (Docker-ready)
- **Google Cloud Run** (Gemini native)
- **Vercel Serverless** (Edge-compatible if streaming via Response)

Example `Dockerfile`:

```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "start"]
EXPOSE 3000
```

---

## 📈 Roadmap

- [ ] Add memory / context storage
- [ ] Add embeddings + vector recall
- [ ] Add caching layer (Redis)
- [ ] Add LangChain-style tool orchestration

---

## 🧩 License

**MIT License © 2025 — Emmanuel Adeleke**

---
