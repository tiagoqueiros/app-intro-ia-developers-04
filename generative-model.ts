import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import type { BoardGenerated } from '~/lib/types';
import {
  promptInitialAnalysis,
  promptInitialAnalysisWithRag,
} from '~/api/llm/prompt-initial-analysis';
import { promptPositioningSuggestions } from '~/api/llm/prompt-positioning-suggestions';

const parseInitialAnalysis = (responseText: string): BoardGenerated => {
  const startIdx = responseText.indexOf('{');
  const endIdx = responseText.lastIndexOf('}') + 1;

  if (startIdx === -1 || endIdx === 0) {
    return { hexList: [], confidence: 0, error: 'No JSON found in response' };
  }

  const jsonStr = responseText.substring(startIdx, endIdx);
  const parsed = JSON.parse(jsonStr);

  // Validate required fields
  if (!Array.isArray(parsed.hexList)) {
    return { hexList: [], confidence: 0, error: 'Invalid hexes format' };
  }

  if (typeof parsed.confidence !== 'number') {
    parsed.confidence = 0.5;
  }

  // Create BoardAnalysisResult with only hexes and confidence
  return {
    hexList: parsed.hexList,
    confidence: Number(parsed.confidence),
  };
};

const parsePositioningSuggestions = (responseText: string): any => {
  const startIdx = responseText.indexOf('{');
  const endIdx = responseText.lastIndexOf('}') + 1;

  if (startIdx === -1 || endIdx === 0) {
    return {
      suggestions: [],
      general_strategy: 'Unable to analyze board state',
      board_analysis: 'Error parsing LLM response',
    };
  }

  try {
    const jsonStr = responseText.substring(startIdx, endIdx);
    const parsed = JSON.parse(jsonStr);

    // Validate required fields
    if (!Array.isArray(parsed.suggestions)) {
      parsed.suggestions = [];
    }

    if (typeof parsed.general_strategy !== 'string') {
      parsed.general_strategy = 'Focus on resource diversity and high-probability numbers';
    }

    if (typeof parsed.board_analysis !== 'string') {
      parsed.board_analysis = 'Board analysis unavailable';
    }

    return parsed;
  } catch (error) {
    return {
      suggestions: [],
      general_strategy: 'Unable to analyze board state',
      board_analysis: 'Error parsing positioning suggestions',
    };
  }
};

/**
 * Methods
 */
export const getInitialAnalysis = async (
  imageBytes: Uint8Array,
  ragContext: string = ''
): Promise<BoardGenerated> => {
  try {
    const imageB64 = Buffer.from(imageBytes).toString('base64');
    const fullPrompt = !!ragContext
      ? promptInitialAnalysisWithRag(ragContext)
      : promptInitialAnalysis();

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable not set');
    }

    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-pro-preview-06-05',
      temperature: 0.1,
      apiKey: apiKey,
    });

    const message = new HumanMessage({
      content: [
        { type: 'text', text: fullPrompt },
        {
          type: 'image_url',
          image_url: { url: `data:image/jpeg;base64,${imageB64}` },
        },
      ],
    });

    const promptResult = await llm.invoke([message]);

    return parseInitialAnalysis(promptResult.content as string);
  } catch (err) {
    return {
      hexList: [],
      confidence: 0,
      error: err instanceof Error ? err.message : 'Failed to process image',
    };
  }
};

/**
 * Generate positioning suggestions using LLM
 */
export const getPositioningSuggestions = async (
  boardState: any,
  actionType: string,
  playerCount: number = 4,
  myPlayer?: string
): Promise<any> => {
  try {
    const fullPrompt = promptPositioningSuggestions(boardState, actionType, playerCount, myPlayer);

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable not set');
    }

    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-pro-preview-06-05',
      temperature: 0.3,
      apiKey: apiKey,
    });

    const message = new HumanMessage({
      content: [{ type: 'text', text: fullPrompt }],
    });

    const promptResult = await llm.invoke([message]);

    return parsePositioningSuggestions(promptResult.content as string);
  } catch (err) {
    return {
      suggestions: [],
      general_strategy: 'Unable to connect to AI service',
      board_analysis: err instanceof Error ? err.message : 'Failed to generate suggestions',
    };
  }
};
