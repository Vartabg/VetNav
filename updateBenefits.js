const fs = require('fs');

// Read the original file
const rawData = fs.readFileSync('benefitsMasterList.json', 'utf8');
const benefits = JSON.parse(rawData);

// Controlled vocabulary for tags
const validTags = [
  "active_duty", "wartime_service", "disability_rating", "service_connected",
  "spouse_eligible", "child_eligible", "survivor_benefit", "income_based",
  "asset_limit", "residency_required", "healthcare", "housing", "education",
  "employment", "financial", "tax_property", "entrepreneurship", "burial",
  "transportation", "veterans_home", "license_fee", "underutilized"
];

// Generate kebab-case ID from title
const generateId = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Convert string to array of bullet points
const stringToBulletArray = (str) => {
  if (!str) return [];
  
  // Split by periods, semicolons, or line breaks
  const points = str.split(/[.;\n]+/)
    .map(point => point.trim())
    .filter(point => point.length > 0);
  
  return points;
};

// Process each benefit object
const processedBenefits = benefits.map(benefit => {
  // Create ID from benefitName
  const id = generateId(benefit.benefitName);
  
  // Convert eligibility string to array
  const eligibilityArray = stringToBulletArray(benefit.eligibility);
  
  // Normalize tags
  const normalizedTags = (benefit.tags || [])
    .filter(tag => validTags.includes(tag))
    .map(tag => tag.toLowerCase());
  
  // Map "underutilized" to "underused"
  const underused = benefit.underutilized || false;
  
  // Create a new object with the correct structure
  return {
    id,
    title: benefit.benefitName,
    level: benefit.level,
    state: benefit.state,
    category: benefit.category,
    description: benefit.description,
    eligibility: eligibilityArray,
    application: benefit.application,
    source: benefit.source || "",
    tags: normalizedTags,
    underused,
    priority: benefit.priority || "medium" // Default priority
  };
});

// Write the processed data to a new file
fs.writeFileSync('benefitsMasterList.json', JSON.stringify(processedBenefits, null, 2), 'utf8');
console.log('Updated benefitsMasterList.json created successfully!');
