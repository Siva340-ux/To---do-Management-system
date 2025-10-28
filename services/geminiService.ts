
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Task, TaskCategory, TaskPriority } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-pro";

const createTaskFunctionDeclaration: FunctionDeclaration = {
  name: "createTask",
  description: "Creates a new task with details extracted from the user's prompt.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The name or description of the task.",
      },
      category: {
        type: Type.STRING,
        enum: Object.values(TaskCategory),
        description: "The category of the task.",
      },
      priority: {
        type: Type.STRING,
        enum: Object.values(TaskPriority),
        description: "The priority level of the task.",
      },
      dueDate: {
        type: Type.STRING,
        description: "The due date and time of the task in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). Can be null if not specified.",
      },
    },
    required: ["name", "category", "priority"],
  },
};

export const parseTaskFromString = async (prompt: string): Promise<Omit<Task, 'id' | 'completed'> | null> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `The current date is ${new Date().toISOString()}. Parse the following to-do item: "${prompt}"`,
            config: {
                tools: [{ functionDeclarations: [createTaskFunctionDeclaration] }],
            },
        });

        const functionCalls = response.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            if (call.name === "createTask") {
                const { name, category, priority, dueDate } = call.args;
                
                // Validate enums
                const validCategory = Object.values(TaskCategory).includes(category as TaskCategory) ? category as TaskCategory : TaskCategory.OTHER;
                const validPriority = Object.values(TaskPriority).includes(priority as TaskPriority) ? priority as TaskPriority : TaskPriority.MEDIUM;
                
                return {
                    name,
                    category: validCategory,
                    priority: validPriority,
                    dueDate: dueDate || null,
                };
            }
        }
        return null;
    } catch (error) {
        console.error("Error parsing task with Gemini:", error);
        throw new Error("Failed to process your request with the AI assistant.");
    }
};

export const getMotivationalMessage = async (taskName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `A user just completed this task: "${taskName}". Provide a short, fun, and encouraging message (max 15 words).`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting motivational message:", error);
        return "Task completed! Well done!";
    }
};

export const getTaskSummary = async (tasks: Task[], period: 'today' | 'this week'): Promise<string> => {
    if (tasks.length === 0) return `You have no tasks for ${period}.`;
    const prompt = `
        Here is a list of my tasks in JSON format:
        ${JSON.stringify(tasks, null, 2)}

        The current date is ${new Date().toISOString()}.

        Please provide a concise, well-formatted summary of my tasks for ${period}.
        - Highlight the most urgent tasks.
        - Group tasks by category if it makes sense.
        - Use bullet points for clarity.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting task summary:", error);
        throw new Error("Failed to generate task summary.");
    }
};
