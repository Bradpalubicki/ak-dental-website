/**
 * Smart Model Router - Haiku-first with Sonnet fallback
 *
 * Reduces Sonnet quota burn by using Haiku for extraction/classification tasks
 * and only escalating to Sonnet when:
 * 1. Haiku fails Zod validation
 * 2. Task requires complex analysis/generation
 *
 * @see Notion spec: 33b663704e4081e39914d075050fd67f
 */

import Anthropic from '@anthropic-ai/sdk';
import { z, ZodSchema, ZodError } from 'zod';

// Model IDs - pinned versions, never use "latest"
const MODELS = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
} as const;

// Task types that determine model selection
export type TaskType = 'extraction' | 'classification' | 'analysis' | 'generation' | 'verification';

export interface SmartCallOptions<T extends ZodSchema = ZodSchema> {
  /** Type of task - determines initial model selection */
  task: TaskType;
  /** The prompt to send to Claude */
  prompt: string;
  /** Optional system prompt */
  systemPrompt?: string;
  /** Zod schema for validation (required for extraction/classification) */
  schema?: T;
  /** Maximum tokens in response */
  maxTokens?: number;
  /** Force a specific model (bypasses routing logic) */
  forceModel?: 'haiku' | 'sonnet';
  /** Number of retries before giving up */
  maxRetries?: number;
  /** Additional context for logging/debugging */
  context?: {
    jobId?: string;
    source?: string;
  };
}

export interface SmartCallResult<T = unknown> {
  /** Parsed and validated data (if schema provided) */
  data: T;
  /** Which model produced the final result */
  model: 'haiku' | 'sonnet';
  /** Whether fallback to Sonnet was used */
  usedFallback: boolean;
  /** Confidence score (0-1) based on null ratio */
  confidence: number;
  /** Token usage for cost tracking */
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
  /** Raw response text */
  rawResponse: string;
}

export interface SmartCallError {
  type: 'validation_failed' | 'api_error' | 'parse_error';
  message: string;
  model: 'haiku' | 'sonnet';
  rawResponse?: string;
  zodErrors?: ZodError;
}

// Pricing per million tokens (input)
const PRICING = {
  haiku: 1.0, // $1/MTok input
  sonnet: 3.0, // $3/MTok input
};

/**
 * Creates a configured smart Claude caller.
 *
 * @param anthropic - Anthropic SDK client instance
 * @returns Configured smartClaudeCall function
 */
export function createSmartRouter(anthropic: Anthropic) {
  return async function smartClaudeCall<T extends ZodSchema>(
    options: SmartCallOptions<T>
  ): Promise<SmartCallResult<z.infer<T>> | SmartCallError> {
    const {
      task,
      prompt,
      systemPrompt,
      schema,
      maxTokens = 4096,
      forceModel,
      maxRetries = 2,
    } = options;

    // Determine initial model based on task type
    let currentModel: 'haiku' | 'sonnet' = forceModel || getModelForTask(task);
    let usedFallback = false;
    let retryCount = 0;

    while (retryCount <= maxRetries) {
      try {
        const response = await anthropic.messages.create({
          model: MODELS[currentModel],
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }],
        });

        const rawResponse = response.content[0].type === 'text'
          ? response.content[0].text
          : '';

        const usage = {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          estimatedCost: (response.usage.input_tokens / 1_000_000) * PRICING[currentModel],
        };

        // If no schema, return raw response
        if (!schema) {
          return {
            data: rawResponse as z.infer<T>,
            model: currentModel,
            usedFallback,
            confidence: 1,
            usage,
            rawResponse,
          };
        }

        // Parse JSON from response
        let parsed: unknown;
        try {
          // Handle potential markdown code blocks
          const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/) ||
                           rawResponse.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : rawResponse;
          parsed = JSON.parse(jsonStr.trim());
        } catch {
          // If Haiku failed to produce valid JSON, try Sonnet
          if (currentModel === 'haiku' && !forceModel) {
            currentModel = 'sonnet';
            usedFallback = true;
            retryCount++;
            continue;
          }

          return {
            type: 'parse_error',
            message: 'Failed to parse JSON response',
            model: currentModel,
            rawResponse,
          };
        }

        // Validate against schema
        const validation = schema.safeParse(parsed);

        if (!validation.success) {
          // If Haiku failed validation, try Sonnet
          if (currentModel === 'haiku' && !forceModel) {
            currentModel = 'sonnet';
            usedFallback = true;
            retryCount++;
            continue;
          }

          return {
            type: 'validation_failed',
            message: 'Schema validation failed',
            model: currentModel,
            rawResponse,
            zodErrors: validation.error,
          };
        }

        // Calculate confidence based on null ratio
        const confidence = calculateConfidence(validation.data);

        return {
          data: validation.data,
          model: currentModel,
          usedFallback,
          confidence,
          usage,
          rawResponse,
        };

      } catch (error) {
        // API errors - retry with backoff
        retryCount++;
        if (retryCount <= maxRetries) {
          await sleep(1000 * retryCount);
          continue;
        }

        return {
          type: 'api_error',
          message: error instanceof Error ? error.message : 'Unknown API error',
          model: currentModel,
        };
      }
    }

    return {
      type: 'api_error',
      message: 'Max retries exceeded',
      model: currentModel,
    };
  };
}

/**
 * Determines the appropriate model based on task type.
 */
function getModelForTask(task: TaskType): 'haiku' | 'sonnet' {
  switch (task) {
    case 'extraction':
    case 'classification':
    case 'verification':
      return 'haiku';
    case 'analysis':
    case 'generation':
      return 'sonnet';
    default:
      return 'haiku';
  }
}

/**
 * Calculates confidence score based on null ratio in extracted data.
 */
function calculateConfidence(data: unknown): number {
  if (typeof data !== 'object' || data === null) {
    return data === null ? 0 : 1;
  }

  const values = Object.values(data);
  if (values.length === 0) return 1;

  const nullCount = values.filter(v => v === null || v === undefined || v === '').length;
  const nullRatio = nullCount / values.length;

  return Math.round((1 - nullRatio) * 100) / 100;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Pre-built extraction call with standard options.
 */
export async function extractWithValidation<T extends ZodSchema>(
  anthropic: Anthropic,
  prompt: string,
  schema: T,
  options: Partial<SmartCallOptions<T>> = {}
): Promise<SmartCallResult<z.infer<T>> | SmartCallError> {
  const smartCall = createSmartRouter(anthropic);

  return smartCall({
    task: 'extraction',
    prompt,
    schema,
    systemPrompt: 'You are a precise data extraction assistant. Extract the requested information from the provided text and return it as valid JSON. If a field cannot be found, use null.',
    ...options,
  });
}

/**
 * Pre-built classification call.
 */
export async function classifyWithValidation<T extends ZodSchema>(
  anthropic: Anthropic,
  prompt: string,
  schema: T,
  options: Partial<SmartCallOptions<T>> = {}
): Promise<SmartCallResult<z.infer<T>> | SmartCallError> {
  const smartCall = createSmartRouter(anthropic);

  return smartCall({
    task: 'classification',
    prompt,
    schema,
    systemPrompt: 'You are a precise classification assistant. Analyze the provided content and classify it according to the schema. Return valid JSON only.',
    ...options,
  });
}

/**
 * Pre-built analysis call (uses Sonnet directly).
 */
export async function analyzeContent(
  anthropic: Anthropic,
  prompt: string,
  systemPrompt?: string
): Promise<SmartCallResult<string> | SmartCallError> {
  const smartCall = createSmartRouter(anthropic);

  const result = await smartCall({
    task: 'analysis',
    prompt,
    systemPrompt: systemPrompt || 'You are a thorough analyst. Provide detailed, accurate analysis.',
  });

  return result as SmartCallResult<string> | SmartCallError;
}
