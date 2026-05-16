/**
 * Tavily Search API Helper
 * Provides real-time web search results for AI discovery and user search.
 */

const TAVILY_API_URL = "https://api.tavily.com/search";

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilySearchResponse {
  results: TavilyResult[];
  query: string;
}

export async function tavilySearch(
  query: string, 
  options: { 
    searchDepth?: "basic" | "advanced"; 
    maxResults?: number;
    includeAnswer?: boolean;
  } = {}
): Promise<TavilySearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured");
  }

  const response = await fetch(TAVILY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: options.searchDepth || "basic",
      include_answer: options.includeAnswer || false,
      max_results: options.maxResults || 5,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Tavily API error: ${error.detail || response.statusText}`);
  }

  return response.json();
}
