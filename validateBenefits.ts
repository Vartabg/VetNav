import * as fs from 'fs';
import * as path from 'path';

// Define the Benefit interface
interface Benefit {
  id: string;
  title: string;
  level: string;
  category: string;
  description: string;
  application: object;
  source: string;
  tags: string[];
  priority: string;
  underutilized?: boolean;
  underutilizedReason?: string;
  eligibility?: string[];
}

// Valid values for enum fields
const VALID_TAGS = ["healthcare", "education", "housing", "financial", "employment", "disability", "memorial", "family"];
const VALID_ELIGIBILITY = ["veteran", "active-duty", "reserve", "national-guard", "spouse", "dependent", "caregiver", "survivor"];
const VALID_PRIORITIES = ["critical", "high", "medium", "low"];
const VALID_LEVELS = ["federal", "state", "local", "private"];

// Validation function
function validateBenefit(benefit: any): string[] {
  const errors: string[] = [];
  
  // Check required fields
  const requiredFields: Array<keyof Benefit> = [
    'id', 'title', 'level', 'category', 'description', 
    'application', 'source', 'tags', 'priority'
  ];
  
  for (const field of requiredFields) {
    if (benefit[field] === undefined || benefit[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Check data types
  if (benefit.id !== undefined && typeof benefit.id !== 'string') {
    errors.push('Field "id" must be a string');
  }
  
  if (benefit.title !== undefined && typeof benefit.title !== 'string') {
    errors.push('Field "title" must be a string');
  }
  
  if (benefit.level !== undefined && typeof benefit.level !== 'string') {
    errors.push('Field "level" must be a string');
  }
  
  if (benefit.category !== undefined && typeof benefit.category !== 'string') {
    errors.push('Field "category" must be a string');
  }
  
  if (benefit.description !== undefined && typeof benefit.description !== 'string') {
    errors.push('Field "description" must be a string');
  }
  
  if (benefit.application !== undefined && typeof benefit.application !== 'object') {
    errors.push('Field "application" must be an object');
  }
  
  if (benefit.source !== undefined && typeof benefit.source !== 'string') {
    errors.push('Field "source" must be a string');
  }
  
  if (benefit.tags !== undefined && !Array.isArray(benefit.tags)) {
    errors.push('Field "tags" must be an array');
  }
  
  if (benefit.priority !== undefined && typeof benefit.priority !== 'string') {
    errors.push('Field "priority" must be a string');
  }
  
  // Check underutilized conditional logic
  if (benefit.underutilized === true) {
    if (!benefit.underutilizedReason || typeof benefit.underutilizedReason !== 'string' || benefit.underutilizedReason.trim() === '') {
      errors.push('When "underutilized" is true, "underutilizedReason" must be a non-empty string');
    }
  }
  
  // Check enum values
  if (benefit.level && !VALID_LEVELS.includes(benefit.level)) {
    errors.push(`Invalid "level" value: "${benefit.level}". Must be one of: ${VALID_LEVELS.join(', ')}`);
  }
  
  if (benefit.priority && !VALID_PRIORITIES.includes(benefit.priority)) {
    errors.push(`Invalid "priority" value: "${benefit.priority}". Must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  
  // Check array enum values
  if (benefit.tags && Array.isArray(benefit.tags)) {
    const invalidTags = benefit.tags.filter((t: string) => !VALID_TAGS.includes(t));
    if (invalidTags.length > 0) {
      errors.push(`Invalid tag values: ${invalidTags.join(', ')}`);
    }
  }
  
  if (benefit.eligibility && Array.isArray(benefit.eligibility)) {
    const invalidEligibility = benefit.eligibility.filter((e: string) => !VALID_ELIGIBILITY.includes(e));
    if (invalidEligibility.length > 0) {
      errors.push(`Invalid eligibility values: ${invalidEligibility.join(', ')}`);
    }
  }
  
  // Validate application structure
  if (benefit.application && typeof benefit.application === 'object') {
    // Check if application has required subfields
    if (!benefit.application.hasOwnProperty('url')) {
      errors.push('Field "application.url" is required');
    } else if (typeof benefit.application.url !== 'string') {
      errors.push('Field "application.url" must be a string');
    }
    
    if (benefit.application.hasOwnProperty('instructions') && 
        typeof benefit.application.instructions !== 'string') {
      errors.push('Field "application.instructions" must be a string');
    }
  }
  
  return errors;
}

// Main function
async function main() {
  try {
    // Load the benefits data
    const dataPath = path.resolve(__dirname, '../data/benefitsMasterList.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    
    // Parse JSON
    let benefits;
    try {
      benefits = JSON.parse(rawData);
    } catch (error) {
      console.error(`Error parsing JSON: ${error.message}`);
      process.exit(1);
    }
    
    // Validate that benefits is an array
    if (!Array.isArray(benefits)) {
      console.error('Error: The benefits data is not an array');
      process.exit(1);
    }
    
    console.log(`Validating ${benefits.length} benefits...`);
    
    // Track validation results
    const invalidBenefits: Array<{benefit: any, errors: string[]}> = [];
    
    // Validate each benefit
    for (const benefit of benefits) {
      const errors = validateBenefit(benefit);
      if (errors.length > 0) {
        invalidBenefits.push({ benefit, errors });
      }
    }
    
    // Output results
    const validCount = benefits.length - invalidBenefits.length;
    console.log(`Total benefits processed: ${benefits.length}`);
    console.log(`✓ Valid records: ${validCount}`);
    console.log(`✗ Invalid records: ${invalidBenefits.length}`);
    
    if (invalidBenefits.length === 0) {
      console.log(`\nAll benefits are valid! ✓`);
      process.exit(0);
    } else {
      console.log(`\n===== VALIDATION ERRORS =====\n`);
      
      // Display each invalid benefit with its errors
      for (const { benefit, errors } of invalidBenefits) {
        console.log(`Benefit ID: ${benefit.id || 'UNKNOWN'}`);
        console.log(`Title: "${benefit.title || 'UNKNOWN'}"`);
        console.log(`Issues found:`);
        for (const error of errors) {
          console.log(`  • ${error}`);
        }
        console.log(); // Add empty line between benefits
      }
      
      process.exit(1);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: File not found - 'data/benefitsMasterList.json'`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Run the validation
main();
