const fs = require("fs");
const pdfParse = require("pdf-parse");

/**
 * Extract text from a PDF file on disk.
 */
const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

module.exports = { extractTextFromPDF };
