/**
 * Prompts
 */
export const promptInitialAnalysis = (): string => `
SIMPLIFIED CATAN BOARD ANALYSIS

Analyze this Catan board image and return ONLY hexes and confidence.

REQUIRED OUTPUT FORMAT (JSON):
{
    "hexList": [/* 5 rows with correct hex counts: [3,4,5,4,3] */],
    "confidence": 0.XX  // Number between 0 and 1
}

HEX COORDINATE SYSTEM:
Row 0 (y=0): 3 hexes → [x=0,y=0] [x=1,y=0] [x=2,y=0]
Row 1 (y=1): 4 hexes → [x=0,y=1] [x=1,y=1] [x=2,y=1] [x=3,y=1]  
Row 2 (y=2): 5 hexes → [x=0,y=2] [x=1,y=2] [x=2,y=2] [x=3,y=2] [x=4,y=2]
Row 3 (y=3): 4 hexes → [x=0,y=3] [x=1,y=3] [x=2,y=3] [x=3,y=3]
Row 4 (y=4): 3 hexes → [x=0,y=4] [x=1,y=4] [x=2,y=4]

RESOURCE TYPES:
- wheat: Golden/yellow grain fields
- sheep: Light green with grass/sheep
- wood: Dark green forests
- brick: Reddish-brown clay/brick
- ore: Gray/blue mountains
- desert: Tan/beige, number 0

NUMBER VALIDATION:
- Red numbers: 6, 8 (exactly 4 total: two 6s, two 8s)
- Black numbers: 2,3,4,5,9,10,11,12
- Desert: always 0

ROBBER VALIDATION:
- Robber can be a dark or a coloured piece within an hex covering the number (don't mistake for a number like 6 or 8)
- If you cannot find it, position robber in desert

Each hex format: {"index": X, "resource": "type", "number": X, "hasRobber": true | false}

Analyze systematically and provide confidence based on image clarity.`;

export const promptInitialAnalysisWithRag = (ragContext: string) => `
EXPERT GUIDANCE CONTEXT:
${ragContext}
          
${promptInitialAnalysis()}
`;
