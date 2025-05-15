const fs = require('fs');
const path = require('path');

console.log("--- VetNav Benefits Validator ---");
console.log("Debug Information:");
console.log("  Current Working Directory (where you ran 'node'):", process.cwd());
console.log("  Script's Directory (__dirname):", __dirname);
console.log("------------------------------------");

// Define JSDoc types for clarity (optional, but good practice)
/**
 * @typedef {Object} BenefitApplication
 * @property {string} url
 * @property {string} [instructions]
 */

/**
 * @typedef {Object} Benefit
 * @property {string} id
 * @property {string} title
 * @property {string} level - "federal", "state", "local", "private"
 * @property {string} category
 * @property {string} description
 * @property {BenefitApplication} application
 * @property {string} source
 * @property {string[]} tags - e.g., "healthcare", "education"
 * @property {string[]} eligibility - e.g., "veteran", "active-duty"
 * @property {string} priority - "critical", "high", "medium", "low"
 * @property {boolean} [underutilized]
 * @property {string} [underutilizedReason]
 * @property {string} [state] - 2-letter state code if applicable
 */

const VALID_TAGS = ["healthcare", "education", "housing", "financial", "employment", "disability", "memorial", "family"];
const VALID_ELIGIBILITY = ["veteran", "active-duty", "reserve", "national-guard", "spouse", "dependent", "caregiver", "survivor"];
const VALID_PRIORITY = ["critical", "high", "medium", "low"];
const VALID_LEVEL = ["federal", "state", "local", "private"];

/**
 * Validates a single benefit object.
 * @param {Benefit} benefit - The benefit object to validate.
 * @returns {string[]} - An array of error messages. Empty if valid.
 */
function validateBenefit(benefit) {
  const errors = [];
  if (!benefit || typeof benefit !== 'object') {
    errors.push('Benefit is not a valid object.');
    return errors;
  }

  // Required fields check
  const requiredFields = ['id', 'title', 'level', 'category', 'description', 'application', 'source', 'tags', 'eligibility', 'priority'];
  for (const field of requiredFields) {
    if (benefit[field] === undefined || benefit[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Type checks (basic)
  if (benefit.id && typeof benefit.id !== 'string') errors.push('id must be a string.');
  if (benefit.title && typeof benefit.title !== 'string') errors.push('title must be a string.');
  // ... (add more type checks as needed for other fields if strictness is required)

  // Conditional field check
  if (benefit.underutilized === true && (typeof benefit.underutilizedReason !== 'string' || benefit.underutilizedReason.trim() === '')) {
    errors.push('underutilizedReason must be a non-empty string if underutilized is true.');
  }

  // Vocabulary validation
  if (benefit.tags && Array.isArray(benefit.tags)) {
    const invalidTags = benefit.tags.filter(t => !VALID_TAGS.includes(t));
    if (invalidTags.length > 0) errors.push(`Invalid tag values: ${invalidTags.join(', ')}`);
  } else if (benefit.tags) {
    errors.push('tags must be an array of strings.');
  }

  if (benefit.eligibility && Array.isArray(benefit.eligibility)) {
    const invalidEligibility = benefit.eligibility.filter(e => !VALID_ELIGIBILITY.includes(e));
    if (invalidEligibility.length > 0) errors.push(`Invalid eligibility values: ${invalidEligibility.join(', ')}`);
  } else if (benefit.eligibility) {
    errors.push('eligibility must be an array of strings.');
  }

  if (benefit.priority && !VALID_PRIORITY.includes(benefit.priority)) errors.push(`Invalid priority value: ${benefit.priority}`);
  if (benefit.level && !VALID_LEVEL.includes(benefit.level)) errors.push(`Invalid level value: ${benefit.level}`);

  // Application structure validation
  if (benefit.application && typeof benefit.application === 'object') {
    if (typeof benefit.application.url !== 'string' || benefit.application.url.trim() === '') {
      errors.push('application.url must be a non-empty string.');
    }
    if (benefit.application.instructions && typeof benefit.application.instructions !== 'string') {
      errors.push('application.instructions must be a string if present.');
    }
  } else if (benefit.application) {
    errors.push('application must be an object.');
  }

  return errors;
}

/**
 * Main function to validate the benefits master list file.
 */
function validateBenefitsFile() {
  const possiblePathsConfig = [
    { pathSpec: ['..', 'data', 'benefitsMasterList.json'], description: "Project Root 'data' folder" },
    { pathSpec: ['..', 'src', 'data', 'benefitsMasterList.json'], description: "Project Root 'src/data' folder" },
    { pathSpec: ['benefitsMasterList.json'], description: "Script's local folder ('scripts')" },
  ];

  // Resolve paths based on the script's directory (__dirname)
  const resolvedPossiblePaths = possiblePathsConfig.map(p => ({
    fullPath: path.resolve(__dirname, ...p.pathSpec),
    description: p.description
  }));

  console.log("\nAttempting to find 'benefitsMasterList.json' in the following locations:");
  resolvedPossiblePaths.forEach(pInfo => {
    console.log(`  - Trying: ${pInfo.fullPath} (for ${pInfo.description})`);
  });

  let filePathToUse = null;
  for (const pInfo of resolvedPossiblePaths) {
    if (fs.existsSync(pInfo.fullPath)) {
      filePathToUse = pInfo.fullPath;
      console.log(`\nSUCCESS: Found benefits data at: ${filePathToUse}`);
      break;
    } else {
      console.log(`    -> Not found at: ${pInfo.fullPath}`);
    }
  }

  if (!filePathToUse) {
    console.warn("\nWARNING: 'benefitsMasterList.json' not found in any of the expected locations.");
    const sampleFilePath = path.resolve(__dirname, 'benefitsMasterList.json'); // Create in scripts/
    const sampleBenefit = [{
      id: "SAMPLE-001", title: "Sample Benefit", level: "federal", category: "sample",
      description: "This is a sample benefit entry.", application: { url: "http://example.com/apply" },
      source: "Sample Source", tags: ["education"], eligibility: ["veteran"], priority: "medium"
    }];
    try {
      fs.writeFileSync(sampleFilePath, JSON.stringify(sampleBenefit, null, 2), 'utf-8');
      console.log(`INFO: Created a sample 'benefitsMasterList.json' at: ${sampleFilePath}`);
      console.log("Please populate this file with your actual benefits data.");
      filePathToUse = sampleFilePath;
    } catch (writeError) {
      console.error(`FATAL: Could not create sample file at ${sampleFilePath}:`, writeError.message);
      process.exit(1);
    }
  }

  let benefitsData = [];
  try {
    console.log(`\nAttempting to read and parse: ${filePathToUse}`);
    const fileContent = fs.readFileSync(filePathToUse, 'utf-8');
    benefitsData = JSON.parse(fileContent);
    if (!Array.isArray(benefitsData)) {
        console.error(`Error: Content of ${filePathToUse} is not a JSON array.`);
        process.exit(1);
    }
    console.log(`Successfully read and parsed ${benefitsData.length} item(s) from ${filePathToUse}.`);
  } catch (error) {
    console.error(`\nFATAL: Error reading or parsing ${filePathToUse}:`, error.message);
    process.exit(1);
  }

  console.log("\n--- Validation Results ---");
  let invalidCount = 0;
  benefitsData.forEach((benefit, index) => {
    const errors = validateBenefit(benefit);
    if (errors.length > 0) {
      invalidCount++;
      console.log(`\n✗ Benefit #${index + 1} (ID: ${benefit.id || 'N/A'}, Title: "${benefit.title || 'N/A'}") has errors:`);
      errors.forEach(err => console.log(`  - ${err}`));
    }
  });

  const validCount = benefitsData.length - invalidCount;
  console.log(`\n--- Summary ---`);
  console.log(`Total benefits processed: ${benefitsData.length}`);
  console.log(`✓ Valid benefits: ${validCount}`);
  console.log(`✗ Invalid benefits: ${invalidCount}`);

  if (invalidCount > 0) {
    console.error("\nValidation failed for one or more benefits.");
    process.exit(1);
  } else if (benefitsData.length === 0 && !fs.existsSync(path.resolve(__dirname, 'benefitsMasterList.json'))) {
     // Handles case where an empty file was found not created by the script (e.g. empty file in src/data)
    console.warn("\nWARNING: The benefits file is empty. No benefits to validate.");
  } else {
    console.log("\nAll benefits are valid!");
  }
}

// Run the validation
validateBenefitsFile();