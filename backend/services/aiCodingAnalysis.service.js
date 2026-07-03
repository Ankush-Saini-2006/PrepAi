const { generateJSON } = require("./geminiService");

const buildCodingAnalysisPrompt = (profile) => `
You are PrepAI's senior coding profile evaluator.
Analyze these coding profiles together and return precise career-oriented feedback.

Profile JSON:
${JSON.stringify(profile, null, 2)}

Return a JSON object with this exact structure:
{
  "strongTopics": ["string", ...],
  "weakTopics": ["string", ...],
  "difficultyDistributionAnalysis": "string",
  "codingPattern": "string",
  "consistencyAnalysis": "string",
  "recommendedTopics": ["string", ...],
  "learningSuggestions": ["string", ...],
  "projectSuggestions": ["string", ...],
  "companyReadiness": "string",
  "interviewReadiness": "string",
  "placementReadinessScore": <number 0-100>,
  "personalizedWeeklyRoadmap": ["string", ...],
  "monthlyRoadmap": ["string", ...]
}
`;

const generateCodingAnalysis = (profile) => generateJSON(buildCodingAnalysisPrompt(profile));

module.exports = { generateCodingAnalysis };
