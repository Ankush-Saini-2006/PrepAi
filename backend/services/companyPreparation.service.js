const SUPPORTED_COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Adobe",
  "Oracle",
  "Walmart Global Tech",
  "Atlassian",
  "Flipkart",
];

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

module.exports = { SUPPORTED_COMPANIES, toSlug };
