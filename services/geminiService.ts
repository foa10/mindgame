import { GoogleGenAI, Type } from "@google/genai";
import { Puzzle, Difficulty, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const puzzleSchema = {
    type: Type.OBJECT,
    properties: {
        puzzle: {
            type: Type.STRING,
            description: "A clever, non-trivial logic puzzle or riddle that can be solved with reasoning. It should not be a simple trivia question."
        },
        answer: {
            type: Type.STRING,
            description: "The single, definitive answer to the puzzle. Often a single word."
        },
        hint: {
            type: Type.STRING,
            description: "A clever, subtle clue for the puzzle that guides the user towards the answer without revealing it directly."
        }
    },
    required: ["puzzle", "answer", "hint"],
};

export const generatePuzzle = async (difficulty: Difficulty, category: Category): Promise<Puzzle> => {
    try {
        const categoryPrompt = category !== 'General' ? `${category} ` : '';
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a unique and challenging ${categoryPrompt}logic puzzle or riddle of ${difficulty} difficulty, along with its answer and a subtle hint.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: puzzleSchema,
                temperature: 0.9,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedPuzzle = JSON.parse(jsonText);

        if (!parsedPuzzle.puzzle || !parsedPuzzle.answer || !parsedPuzzle.hint) {
            throw new Error("Invalid puzzle format received from API.");
        }

        return parsedPuzzle as Puzzle;
    } catch (error) {
        console.error("Error generating puzzle with Gemini:", error);
        throw new Error("Failed to communicate with the AI to generate a puzzle.");
    }
};