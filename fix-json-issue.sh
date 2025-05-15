#!/bin/bash

# Check the current content of the JSON file
echo "Checking current content of benefitsMasterList.json..."
head -n 5 src/data/benefitsMasterList.json

# Create a proper JSON file from the original data
echo "Creating a proper JSON file..."
cat > src/data/benefitsMasterList.json << 'JSONDATA'
[
  {
    "benefitName": "Post-9/11 GI Bill (Chapter 33)",
    "level": "federal",
    "state": null,
    "category": "education",
    "description": "Provides up to 36 months of education benefits, including full in-state public college tuition, a monthly housing allowance, and an annual books stipend for veterans who served after Sept 10, 2001.",
    "eligibility": "Veterans with an honorable discharge who served at least 90 days on active duty after September 10, 2001, or were discharged with a service-connected disability after 30 days. Benefits are tiered based on length of service.",
    "application": "Submit VA Form 22-1990 (Application for Education Benefits) online through VA's eBenefits portal or at a VA Regional Office. Once issued a Certificate of Eligibility, enroll at an approved institution.",
    "source": "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/",
    "tags": [
      "education",
      "tuition_assistance",
      "active_duty",
      "housing_allowance",
      "book_stipend",
      "transferable"
    ],
    "underutilized": false,
    "underutilizedReason": null
  },
  {
    "benefitName": "VA Health Care Enrollment",
    "level": "federal",
    "state": null,
    "category": "healthcare",
    "description": "Comprehensive healthcare services through VA medical facilities, including preventive care, inpatient/outpatient services, mental health care, prescriptions, and specialty programs.",
    "eligibility": "Generally, veterans who served on active duty and received an other-than-dishonorable discharge qualify (minimum service requirements apply for post-1980 enlistees). Combat veterans and those with service-connected disabilities have enhanced eligibility.",
    "application": "Enroll for VA health care by submitting VA Form 10-10EZ online, by mail, or in person at a VA medical center. Enrollment can also be done via phone (1-877-222-VETS).",
    "source": "https://www.va.gov/health-care/eligibility/",
    "tags": [
      "healthcare",
      "medical",
      "preventive_care",
      "prescriptions",
      "mental_health"
    ],
    "underutilized": true,
    "underutilizedReason": "Only about half of eligible veterans are enrolled in VA health care. Many are unaware of their eligibility, prefer private insurance, or had past negative experiences."
  }
]
JSONDATA

echo "JSON file fixed with proper format."
