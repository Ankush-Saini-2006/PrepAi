const { getGeminiModel } = require("../config/gemini");

/**
 * Send a prompt to Gemini and return clean text.
 */
const generateContent = async (prompt) => {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};

/**
 * Ask Gemini to return strict JSON. Strips markdown fences if present.
 */
const generateJSON = async (prompt) => {
  const text = await generateContent(
    `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no backticks, no explanation.`
  );
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("AI returned invalid JSON format");
  }
};

const analyzeResumePrompt = (resumeText, targetRole) => `
You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
Analyze the following resume for the target role: "${targetRole || "Software Engineer"}".

Resume Text:
"""
${resumeText}
"""

Return a JSON object with this exact structure:
{
  "atsScore": <number 0-100>,
  "strengths": ["string", ...],
  "weaknesses": ["string", ...],
  "suggestions": ["string", ...],
  "missingKeywords": ["string", ...],
  "summary": "<2-3 sentence overall summary>"
}
`;

const generateInterviewQuestionsPrompt = (role, type, difficulty, count = 5) => `
You are a senior technical interviewer at a top tech company.
Generate ${count} interview questions for the role "${role}".
Interview type: ${type}.
Difficulty: ${difficulty}.

Return a JSON array of objects with this exact structure:
[
  { "question": "string" }
]
`;

const evaluateAnswerPrompt = (question, answer, role) => `
You are a senior interviewer evaluating a candidate for the role "${role}".

Question: "${question}"
Candidate Answer: "${answer}"

Return a JSON object with this exact structure:
{
  "score": <number 0-10>,
  "feedback": "<concise constructive feedback, 2-4 sentences>"
}
`;

const generateRoadmapPrompt = (targetRole, currentLevel, skills = []) => `
You are a career mentor creating a learning roadmap.
Target Role: "${targetRole}"
Current Level: "${currentLevel}"
Current Skills: ${skills.join(", ") || "None specified"}

Return a JSON object with this exact structure:
{
  "estimatedWeeks": <number>,
  "milestones": [
    {
      "title": "string",
      "description": "string",
      "resources": ["string", ...],
      "durationWeeks": <number>
    }
  ]
}
Generate between 5 and 8 milestones, ordered logically from fundamentals to advanced/job-readiness.
`;

module.exports = {
  generateContent,
  generateJSON,
  analyzeResumePrompt,
  generateInterviewQuestionsPrompt,
  evaluateAnswerPrompt,
  generateRoadmapPrompt,
};
