import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";


const server = new Server(
  { name: "studymate-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const API_URL = 'http://localhost:5000/api/notes';


server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_notes",
        description: "Returns all notes from the StudyMate database",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "create_note",
        description: "Adds a new note to the StudyMate database",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "The title of the note" },
            subject: { type: "string", description: "The subject of the note" },
            content: { type: "string", description: "The main body/content of the note" },
          },
          required: ["title", "content"],
        },
      },
    ],
  };
});


server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "list_notes") {
      
      const response = await axios.get(API_URL);
      return { 
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] 
      };
    }

    if (name === "create_note") {
      
      const response = await axios.post(API_URL, args);
      return { 
        content: [{ type: "text", text: `Successfully created note:\n${JSON.stringify(response.data, null, 2)}` }] 
      };
    }

    throw new Error("Tool not found");
  } catch (error) {
    return { 
      content: [{ type: "text", text: `API Error: ${error.message}` }], 
      isError: true 
    };
  }
});


const transport = new StdioServerTransport();
await server.connect(transport);
console.error("StudyMate MCP Server running on stdio");