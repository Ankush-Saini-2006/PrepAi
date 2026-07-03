const { getGeminiModel } = require("../config/gemini");
const ApiError = require("../utils/ApiError");

const getGeminiErrorBody = (err) => {
  if (err?.response?.data) return err.response.data;
  if (err?.response?.body) return err.response.body;
  if (err?.errorDetails) return err.errorDetails;
  if (err?.details) return err.details;
  if (err?.cause) return err.cause;
  return {
    status: err?.status,
    statusText: err?.statusText,
    message: err?.message,
  };
};

const generateContent = async (prompt) => {
  try {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new ApiError(400, "Gemini prompt must be a non-empty string");
    }

    const model = getGeminiModel();

    const result = await model.generateContent(prompt);
    const response = result?.response;

    if (!response || typeof response.text !== "function") {
      throw new ApiError(502, "Gemini returned an unexpected response format");
    }

    return response.text();
  } catch (err) {
    const status = err?.status || 502;
    const message = err?.message || "Gemini request failed";

    console.error("Gemini API error:", message);
    console.error(
      "Gemini API response body:",
      JSON.stringify(getGeminiErrorBody(err), null, 2)
    );

    throw new ApiError(status, message);
  }
};

const generateJSON = async (prompt) => {
  const text = await generateContent(
    `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no backticks, no explanation.`
  );

  const cleaned = (text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new ApiError(502, "Gemini returned an invalid JSON response. Please retry the analysis.");
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
  "summary": "<2-3 sentence overall summary>",
  "grammarAnalysis": [
    { "issue": "string", "suggestion": "string" }
  ],
  "keywordOptimization": [
    { "keyword": "string", "reason": "string" }
  ],
  "missingSkills": ["string", ...],
  "skills": ["string", ...],
  "rewriteSuggestions": [
    { "section": "string", "original": "string", "improved": "string" }
  ],
  "projectSuggestions": [
    { "title": "string", "description": "string", "skills": ["string", ...] }
  ],
  "improvedResumeText": "<plain text rewritten resume draft using only information from the resume plus clearly marked suggestions>"
}
`;

const matchResumeToJobDescriptionPrompt = (resumeText, jobDescription) => `
You are an expert ATS evaluator and senior technical recruiter.
Compare the candidate resume against the pasted job description.

Resume Text:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return a JSON object with this exact structure:
{
  "matchScore": <number 0-100>,
  "overallReadinessScore": <number 0-100>,
  "atsCompatibilityScore": <number 0-100>,
  "summary": "<2-3 sentence summary of fit, readiness, and most important gap>",
  "matchingSkills": ["string", ...],
  "missingSkills": ["string", ...],
  "missingKeywords": ["string", ...],
  "weakAreas": ["string", ...],
  "improvementSuggestions": ["string", ...]
}

Evaluate only from the supplied resume and job description. Keep all lists concise, specific, and job-relevant.
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
  matchResumeToJobDescriptionPrompt,
  generateInterviewQuestionsPrompt,
  evaluateAnswerPrompt,
  generateRoadmapPrompt,
};
