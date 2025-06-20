export const promptPositioningSuggestions = (
  boardState: any,
  actionType: string,
  playerCount: number,
  myPlayer: string | undefined
): string => `
CATAN POSITIONING STRATEGY ANALYSIS

You are an expert Catan strategy advisor. Analyze the board state and provide strategic positioning suggestions.

BOARD STATE:
${JSON.stringify(boardState, null, 2)}

CONTEXT:
- Action Type: ${actionType}
- Player Count: ${playerCount}
- My Player Color: ${myPlayer || 'red'}

POSITIONING RULES:
1. Settlements must be at least 2 intersections apart
2. Roads connect to existing settlements/roads
3. Cities upgrade existing settlements
4. Initial settlements get adjacent resource hexes

STRATEGIC PRIORITIES:
1. Diversify resource access (all 5 types)
2. Target high-probability numbers (6, 8, then 5, 9, 4, 10)
3. Control ports for resource efficiency
4. Block opponent expansion routes
5. Secure longest road potential

REQUIRED OUTPUT FORMAT (JSON):
{
    "suggestions": [
        {
            "suggestion_type": "${actionType}",
            "position": {
                "vertex_index": 12,
                "hex_coordinates": [{"x": 1, "y": 2}, {"x": 2, "y": 2}],
                "description": "Top-left corner of wheat (6) and ore (8)"
            },
            "reasoning": "This position provides access to high-value resources with excellent probability numbers. The wheat-ore combination is crucial for development cards and city upgrades.",
            "confidence": 0.85,
            "alternative_positions": [
                {
                    "vertex_index": 15,
                    "description": "Alternative location description"
                }
            ]
        }
    ],
    "general_strategy": "Focus on resource diversity in initial placement. Prioritize wheat and ore access for development cards. Secure a strong economic foundation before expansion.",
    "board_analysis": "This board shows excellent wheat and ore clustering in the center-right. Numbers 6 and 8 on wheat/ore provide strong economic potential. Consider port access for late-game flexibility."
}

Provide 2-3 concrete suggestions with specific vertex indices and strategic reasoning.`;
