🧾 Research Plan: Comprehensive Veteran Benefits Dataset for GeminiI. Project Overview and ObjectivesA. Summary of GoalThe primary objective of this research project is to systematically identify, collect, structure, and validate data pertaining to veteran benefits offered by the U.S. federal government and the governments of all 50 individual states. The resulting dataset is envisioned as the definitive, comprehensive knowledge base powering the Gemini application, designed to assist veterans in discovering and accessing the benefits they have earned.B. Dataset Purpose and Target ApplicationThis dataset will serve as the core engine for the Gemini application. Its fundamental purpose is to enable accurate matching between individual veteran profiles and the specific benefits for which they may qualify. A critical function of the dataset and the application it supports is to highlight benefits that are frequently underutilized or overlooked by the veteran community. By providing clear, accurate, and easily accessible information, the dataset aims to empower veterans to navigate the complex benefits landscape more effectively and claim the support available to them.C. Key DeliverablesThe project will yield the following deliverables:
Primary Deliverable: A meticulously structured JSON file. This file will contain a single array, with each element being an object representing a distinct veteran benefit. Each object will strictly adhere to the schema defined in Section V.A. The data will be cleaned, validated for accuracy and consistency, and formatted for direct import into the Gemini application's filtering and matching systems.
Secondary Deliverable: An optional CSV (Comma-Separated Values) file mirroring the structured data in the JSON file. This format may be provided for ease of manual review, data exploration, or use in other analytical tools.
Supporting Deliverable: This research plan document, outlining the methodology, sources, schema, validation procedures, and anticipated challenges.
D. Core PrioritiesThe creation of this dataset will be guided by the following core principles:
Accuracy: All extracted data points, particularly eligibility criteria, benefit descriptions, and application procedures, must precisely reflect the information provided by official government sources. Rigorous verification is paramount.
Comprehensiveness: The research must strive to capture the full spectrum of relevant federal and state-level benefits falling within the predefined categories (healthcare, housing, education, employment, financial, burial, other).
Clarity: Information must be presented in a manner that is clear, concise, and readily understandable to the end-user veteran. This is especially critical for complex eligibility rules and application instructions.
Usability: The dataset must be structured logically according to the defined JSON schema to ensure efficient processing, filtering, and matching by the Gemini application's backend systems.
Source Integrity: Data collection will rely exclusively on official government websites (federal and state) and, where necessary for underutilization analysis, credible, verifiable reports from government entities or recognized research bodies.
II. Federal Benefits Data Acquisition StrategyA. Identification of Primary SourcesThe foundation of the federal benefits data will be official U.S. government sources, primarily those managed by the Department of Veterans Affairs (VA). Recognizing that VA's online presence is distributed across several domains, a multi-source approach is necessary for comprehensive coverage. The primary sources identified for federal benefit data extraction include:
VA.gov: The main portal for VA information, which is increasingly consolidating data from other legacy sites.1 This will be treated as the primary source when information converges.
Benefits.va.gov: A key resource containing specific details on benefits administration, including compensation, pension, education, and home loans.8
eBenefits.va.gov: While undergoing migration to VA.gov, this portal still hosts certain features and benefit information not yet fully transitioned.16 Its inclusion is essential to avoid data gaps during this transitional period.
Other Official Government Sites: Relevant information, particularly concerning employment benefits, may reside on other official domains, such as the Department of Labor's Veterans' Employment and Training Service (VETS) site (DOL.gov/VETS) 18 or Military OneSource (MilitaryOneSource.mil) for contextual GI Bill information.19
The acknowledged fragmentation of VA's web properties, with ongoing but incomplete migration efforts 16, necessitates this multi-source strategy. Relying solely on VA.gov at this time would likely result in an incomplete dataset. This fragmentation may also contribute to the complexity veterans face when seeking information, potentially impacting benefit utilization rates, a factor relevant to the underutilization analysis (Section IV). The research protocol must involve systematic searching and cross-referencing across these domains. Any discrepancies identified between sources will be flagged, with VA.gov information generally prioritized if a direct conflict exists, assuming it represents the most current consolidated information.B. Methodology for Data ExtractionA systematic review process will be employed, navigating the identified source websites based on the core benefit categories: healthcare, housing, education, employment, and financial (which encompasses disability compensation, pension, grants, burial allowances, etc.).For each benefit identified:
Extract information meticulously, mapping it to the required JSON fields: benefitName, level ("federal"), category, description, eligibility, application, source (the direct URL to the official benefit page), and tags.
Utilize browser developer tools or ethical web scraping techniques (respecting robots.txt directives) for efficiency where appropriate, particularly for identifying potential benefit pages or extracting simple text. However, manual review and verification by trained analysts will be the primary method for ensuring the accuracy and nuance of complex fields like eligibility and application.
Summarize detailed information concisely for fields like description and application, ensuring clarity for the end-user while maintaining accuracy.
Application processes documented on VA sites are notably diverse. They include online applications via VA.gov or eBenefits, downloadable PDF forms (like VA Form 21-526EZ for disability compensation 8 or VA Form 21P-527EZ for pension 8), mail-in submissions to specific intake centers 8, fax submissions 8, seeking assistance in person at VA regional offices 8, and working with accredited representatives.6 The application field within the dataset must capture all valid methods clearly. Simply listing the "preferred" online method is insufficient if other avenues are necessary or available. The frequent recommendation to use accredited representatives suggests that navigating the application process can be complex for veterans, reinforcing the need for comprehensive and unambiguous instructions within the dataset.C. Data Structuring and ExamplesAll extracted data will adhere strictly to the JSON schema defined in Section V.A. The following examples illustrate how key federal benefits would be structured, drawing upon the analyzed source materials:

VA Health Care:

benefitName: "VA Health Care"
level: "federal"
category: "healthcare"
description: "Provides comprehensive medical services, including regular checkups, specialist appointments, hospital care, prescriptions, mental health services, and potentially dental, vision, and long-term care to eligible Veterans." 1
eligibility: "Must have served in active military service and received a discharge other than dishonorable. Eligibility for specific services and priority group assignment may depend on factors like service-connected disabilities, income, and other criteria. Enrollment meets ACA minimum essential coverage." 1
application: "Apply online via VA.gov (VA Form 10-10EZ). Apply by phone at 877-222-8387 (TTY: 711). Apply by mail using VA Form 10-10EZ. Apply in person at a VA medical center or clinic. Work with an accredited representative." 1
source: "https://www.va.gov/health-care/"
tags: ["healthcare", "healthcare_medical", "healthcare_mental", "healthcare_dental", "healthcare_vision", "healthcare_longtermcare", "active_duty", "no_cost", "reduced_fee"]
underutilized: (To be determined per Section IV)
underutilizedReason: (To be determined per Section IV)



VA Home Loan Guaranty:

benefitName: "VA Home Loan Guaranty (Purchase Loan)"
level: "federal"
category: "housing"
description: "Helps eligible Veterans, service members, and surviving spouses purchase a home with competitive interest rates, often with no down payment and no private mortgage insurance (PMI). Loans are provided by private lenders, with VA guaranteeing a portion." 9
eligibility: "Requires satisfactory credit, sufficient income, and a valid Certificate of Eligibility (COE). Home must be for personal occupancy (or spouse/dependent for active duty). Requires minimum active service (e.g., 90 consecutive days under Title 32 for Guard members) and discharge other than dishonorable. Surviving spouses may be eligible." 9
application: "Obtain a Certificate of Eligibility (COE) via VA.gov, by mail, or through a VA-approved lender. Apply for the loan directly with a private lender (bank, mortgage company) of your choice." 9
source: "https://www.benefits.va.gov/homeloans/"
tags: ["housing", "housing_loan", "active_duty", "reserve", "national_guard", "spouse_eligible", "survivor_benefit", "no_down_payment"]
underutilized: (To be determined per Section IV)
underutilizedReason: (To be determined per Section IV)
(Note: IRRRL, Cash-Out Refinance, NADL, Adapted Housing Grants would be separate entries due to distinct eligibility/application processes) 9



Post-9/11 GI Bill (Chapter 33):

benefitName: "Post-9/11 GI Bill (Chapter 33)"
level: "federal"
category: "education"
description: "Provides financial support for education and job training to eligible Veterans and service members who served on active duty after September 10, 2001. Covers tuition/fees, housing allowance (MHA), and books/supplies stipend. May include funds for licensing/certification tests, national exams, and rural relocation." 10
eligibility: "Requires minimum aggregate active duty service after 9/10/2001 (e.g., 90 days for partial benefit, 36 months for 100%). Alternatively, 30 continuous days service followed by honorable discharge for service-connected disability. Benefit percentage based on length of service. Generally usable within 15 years of last discharge (pre-2013 service) or indefinitely (post-2013 service - 'Forever GI Bill'). May be transferable to spouse/children if DoD requirements met." 10
application: "Apply online via VA.gov/education. Apply by mail using VA Form 22-1990. Apply in person at a VA regional office. Work with a school's certifying official or an accredited representative." 8
source: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/"
tags: ["education", "education_degree", "education_vocational", "education_otr", "education_apprenticeship", "education_certificate", "active_duty", "spouse_eligible", "child_eligible", "tuition_assistance", "housing_allowance"]
underutilized: (To be determined per Section IV)
underutilizedReason: (To be determined per Section IV)



VA Disability Compensation:

benefitName: "VA Disability Compensation"
level: "federal"
category: "financial"
description: "Tax-free monthly payment to Veterans with disabilities resulting from disease or injury incurred or aggravated during active military service. Benefit amount based on disability rating (10% to 100%). Also covers disabilities presumed service-connected or secondary conditions." 7
eligibility: "Must have a current physical or mental condition affecting body or mind, and served on active duty, active duty for training, or inactive duty training. Requires a service-connected disability (condition started/worsened during service, or presumed connected) and discharge other than dishonorable." 7
application: "Apply online at VA.gov/disability. Submit paper application VA Form 21-526EZ by mail to Claims Intake Center or fax. Apply in person at a VA regional office. Work with an accredited representative. Submit supporting evidence (DD214, medical records)." 7
source: "https://www.va.gov/disability/"
tags: ["financial", "disability_rating", "service_connected", "tax_free", "active_duty", "reserve", "national_guard"]
underutilized: (To be determined per Section IV)
underutilizedReason: (To be determined per Section IV)
(Note: DIC and SMC would be separate entries) 13



Veterans Pension:

benefitName: "Veterans Pension"
level: "federal"
category: "financial"
description: "Tax-free monthly payment to low-income wartime Veterans who meet certain age or disability requirements." 6
eligibility: "Must meet wartime service requirements (e.g., 90 days active duty with 1 day during wartime period like WWII, Korea, Vietnam, Gulf War) and received discharge other than dishonorable. Must meet income and net worth limits set by Congress. Must be age 65 or older OR have a permanent and total non-service-connected disability OR be in a nursing home OR receive SSDI/SSI." 6
application: "Apply online at VA.gov/pension. Submit paper application VA Form 21P-527EZ by mail to the Pension Management Center (PMC). Apply in person at a VA regional office. Work with an accredited representative." 6
source: "https://www.va.gov/pension/"
tags: ["financial", "pension", "wartime_service", "income_based", "asset_limit", "disability_rating", "age_65_plus", "tax_free"]
underutilized: (To be determined per Section IV)
underutilizedReason: (To be determined per Section IV)
(Note: Survivors Pension and Aid & Attendance/Housebound allowance would be separate or clearly delineated entries) 11


Eligibility criteria present significant complexity, often involving multiple conditions related to service dates, discharge character, disability ratings (specific percentages like 10%, 40%, 50%, 100% P&T are common triggers 12), income levels, net worth, and residency.1 The eligibility field in the dataset must capture these parameters accurately and potentially in a structured way (e.g., using sub-fields or structured text) to facilitate reliable matching by the Gemini application's algorithm. Simple keyword matching may prove insufficient for these nuanced requirements.III. State-Level Benefits Data Acquisition Strategy (All 50 States)A. Source Identification ProtocolAcquiring data for all 50 states requires a standardized protocol due to the inherent variability in how states organize and present veteran benefit information.
Identify Primary State VA Agency: For each state, the initial step is to identify the official agency responsible for veterans' affairs. This typically involves searching for " Department of Veterans Affairs," " Division of Veterans Services," or similar terms. Official state government domains (.gov, .us, or state-specific TLDs like .ca.gov, .tx.gov) will be prioritized.26
Locate Benefit Information: Once the primary agency site is identified, navigate to find their benefits directory, handbook, program listings, or specific benefit pages.
Identify Secondary Agencies: Crucially, many veteran benefits are administered by agencies other than the primary VA department. Based on benefit category, identify and search relevant secondary state agencies:

Tax Exemptions: Department of Revenue/Taxation, State Comptroller, County Assessor/Appraiser offices.26
Education Benefits: State Higher Education Coordinating Boards, individual public university systems.47
Employment Preference/Services: Department of Labor, Workforce Development agencies, State Civil Service/Human Resources departments.32
Housing Loans/Assistance: State Housing Finance Agencies, specific state veteran loan boards (e.g., CalVet, Texas VLB).67
Licenses (Vehicle, Recreational): Department of Motor Vehicles (DMV)/Highway Safety (FLHSMV), Parks & Wildlife/Environmental Conservation departments.27
State Veterans Homes: Often managed by the primary VA agency or a dedicated homes division.37
Burial Benefits: Primary VA agency or specific cemetery programs.33


Document Sources: For each state, meticulously record the URLs of the primary VA agency and any secondary agencies identified as administering relevant benefits.
This decentralized structure is a key characteristic of state-level benefits. Unlike the federal system where the VA is the predominant provider, states often distribute responsibility across multiple departments.26 A research approach targeting only the main state VA website will inevitably miss significant benefits. The protocol must therefore include targeted searches within these relevant secondary agencies for each state, guided by the benefit categories.B. Methodology for State-by-State ExtractionThe data extraction process for each state will mirror the federal methodology:
Systematically review identified primary and secondary source websites for benefits within the defined categories.
Extract information for each benefit, populating the JSON fields: benefitName, level ("state"), state (using the correct two-letter uppercase abbreviation, e.g., "CA", "TX", "NY", "FL"), category, description, eligibility, application, source, and tags.
Pay particular attention to state-specific eligibility criteria, especially residency requirements (e.g., duration, entry into service from the state).26
Document the specific state, county, or local office responsible for application intake within the application field (e.g., County Veterans Service Officer (CVSO) 47, County Assessor 26, County Appraisal District 31, specific state agency portal like HESC for NY VTA 51).
Assign appropriate category and develop relevant tags using the controlled vocabulary (Section V.B), adding state-specific identifiers where necessary (e.g., hazlewood_act, calvet_loan, vta_ny).
C. Addressing Variability and Data GapsIt is anticipated that the quality, organization, depth, and accessibility of online benefit information will vary considerably across the 50 states. The research plan must account for this:
Documentation: Thoroughly document the sources reviewed for each state and the attempts made to find information for each benefit category.
Handling Missing Data: If crucial details like specific eligibility criteria or application steps are not available on official websites after a reasonable search effort, this gap must be noted within the dataset. This could be a statement in the description or eligibility field, such as: "Detailed application instructions not available online. Contact the at [Phone Number/Email] for assistance."
Contact Information: When direct online application details are missing, capturing the contact information (phone, email, office location) for the responsible agency or office becomes critical and should be included in the application field.
URL Validation: The research process itself encountered inaccessible state benefit URLs.44 This underscores the real-world challenge of maintaining data integrity when relying on external web sources. A robust URL validation process (Section V.C) is essential. If a primary benefit link is broken and no alternative official page can be found, the source field should reflect this, potentially linking to the main agency page and noting the absence of a specific benefit page.
D. Illustrative State Benefit Examples:

California - Disabled Veterans' Property Tax Exemption:

level: "state", state: "CA", category: "financial"
description: "Reduces property tax on the principal residence for veterans with a 100% service-connected disability rating or unemployability. Basic ($100k+, adjusted annually) and Low-Income ($150k+, adjusted annually) levels available. Unmarried surviving spouses may qualify." 26
eligibility: "Veteran with 100% service-connected disability rating or compensated at 100% due to unemployability (VA or military determination). Property must be principal residence. Discharge other than dishonorable. Unmarried surviving spouse may be eligible. Low-income version requires household income below annual limit." 26
application: "Apply through your County Assessor's office using Form BOE-261-G (first time). File by Jan 1 or 90 days after qualification for full first-year basic exemption. Annual filing (Jan 1 - Feb 15) required for low-income exemption. Requires proof of disability." 26
source: "https://www.calvet.ca.gov/VetServices/Pages/Property-Tax-Exemptions.aspx" (or BOE equivalent if CalVet link remains problematic)
tags: ["financial", "tax_property", "disability_rating", "service_connected", "spouse_eligible", "residency_required", "income_based"]



California - College Fee Waiver for Veteran Dependents:

level: "state", state: "CA", category: "education"
description: "Waives mandatory system-wide tuition and fees at California Community Colleges, CSU, and UC campuses for eligible children and spouses of veterans with a service-connected disability." 47
eligibility: "Dependent (child/spouse/surviving spouse) of a veteran with a VA service-connected disability rating (0% or higher). Specific plan requirements apply (e.g., Plan B usable with Ch 35 DEA; Plan A income limits waived for dependents of 100% disabled veterans). Student must meet CA residency requirements for tuition purposes. Income limits apply for child dependents under most plans." 47
application: "Apply annually through the local County Veterans Service Office (CVSO). Requires proof of dependency (birth/marriage cert), proof of veteran's service-connected disability, and proof of income (except Plan A for 100% disabled vet dependents). Submit CalVet authorization letter to the college's VA/Financial Aid office." 47
source: "https://www.calvet.ca.gov/VetServices/Pages/College-Fee-Waiver.aspx" (or alternative official source if needed)
tags: ["education", "tuition_assistance", "spouse_eligible", "child_eligible", "survivor_benefit", "disability_rating", "service_connected", "residency_required", "income_based", "ca_public_college"]



Texas - Hazlewood Act:

level: "state", state: "TX", category: "education"
description: "Provides qualified Texas Veterans, spouses, and dependent children up to 150 credit hours of tuition exemption (including most fees, excluding living expenses/books/supplies) at public institutions of higher education in Texas." 49
eligibility: "Veteran: Entered service in TX, designated TX home of record, or was TX resident; Served 181+ days active duty (excl. training); Honorable/General under honorable discharge; Reside in TX; Exhausted/ineligible for federal VA Ed benefits covering tuition/fees (e.g., Post-9/11). Child (Legacy): Can receive unused hours; must be TX resident, biological/adopted/stepchild/claimed dependent; age 25 or younger (some exceptions). Spouse/Dependent: Specific criteria for spouses/children of 100% P&T disabled, KIA, or MIA veterans." 49
application: "Apply and be accepted to a Texas public college/university. Provide DD214. Provide proof of VA benefit eligibility/ineligibility (if post-9/11 service). Complete Hazlewood Exemption application form. Submit all documents to the institution's financial aid/veteran services office." 49
source: "https://www.tvc.texas.gov/education/hazlewood/"
tags: ["education", "tuition_assistance", "active_duty", "spouse_eligible", "child_eligible", "survivor_benefit", "residency_required", "tx_public_college", "hazlewood_act"]



Texas - Disabled Veterans Property Tax Exemption:

level: "state", state: "TX", category: "financial"
description: "Provides a partial or total exemption from property taxes on the veteran's residence homestead based on the VA service-connected disability rating." 42
eligibility: "Veteran with a VA service-connected disability rating (10-90% for partial exemption $5k-$12k; 100% P&T or Individual Unemployability for total exemption). Property must be residence homestead. Surviving spouse/children may qualify under specific conditions (e.g., spouse of 100% disabled vet if unmarried and property was homestead)." 42
application: "Apply with the County Appraisal District where the property is located. Use Form 50-135 (Disabled Veteran's/Survivor's Exemption) for partial exemption. Use Form 50-114 (Residence Homestead Exemption Application) for 100% exemption. Requires VA disability letter and matching ID." 42
source: "https://comptroller.texas.gov/taxes/property-tax/exemptions/" (or TVC equivalent)
tags: ["financial", "tax_property", "disability_rating", "service_connected", "spouse_eligible", "child_eligible", "residency_required"]



New York - Veterans Tuition Awards (VTA):

level: "state", state: "NY", category: "education"
description: "Provides tuition awards for eligible combat veterans (Vietnam, Persian Gulf, Afghanistan, or recipient of specific expeditionary medals) attending approved undergraduate, graduate, or vocational programs in NYS." 51
eligibility: "NYS resident for 12+ months; US citizen/eligible non-citizen; Served in specified conflicts/locations or received qualifying medal; Honorable discharge; Matriculated full-time or part-time in approved NYS program (degree or vocational >=320 clock hours); Good academic standing; Charged >=$200 tuition/year. Cannot receive if federal benefits (e.g., Ch 33) cover full tuition." 51
application: "Apply year-round via NYS Higher Education Services Corporation (HESC). Requires FAFSA and NYS TAP application (for degree programs) first, then the online Veterans Tuition Award Application. Vocational students complete NYS Payment Application." 51
source: "https://hesc.ny.gov/find-aid/nys-grants-scholarships/veterans-tuition-awards"
tags: ["education", "tuition_assistance", "wartime_service", "expeditionary_medal", "residency_required", "ny_approved_program", "undergraduate", "graduate", "vocational"]



Florida - Property Tax Exemption (100% P&T Disabled Veteran):

level: "state", state: "FL", category: "financial"
description: "Provides total exemption from ad valorem taxes on the homestead property for honorably discharged veterans with a service-connected 100% permanent and total disability." 30
eligibility: "Veteran honorably discharged with 100% permanent and total service-connected disability certified by VA. Property must be owned and used as homestead. Must be FL resident as of Jan 1. Surviving spouse may be eligible if they hold title, reside on property, and do not remarry." 30
application: "Apply with the County Property Appraiser by March 1. Requires documentation from VA certifying 100% P&T service-connected disability. Use Form DR-501 (Homestead) and potentially DR-501DV or DR-416 for disability proof." 31
source: "https://floridarevenue.com/property/Pages/Taxpayers_Exemptions.aspx"
tags: ["financial", "tax_property", "disability_rating", "service_connected", "permanent_total", "spouse_eligible", "residency_required", "homestead"]
(Note: $5k exemption for 10%+ disability is a separate benefit) 31


IV. Underutilization Analysis PlanA. Research Scope and SourcesThe objective of this analysis is to identify veteran benefits that are demonstrably underutilized or face significant, documented barriers to access, thereby allowing the Gemini application to potentially prioritize or highlight these benefits for users. The research will focus on finding explicit evidence of underutilization.The primary sources for this analysis will include:
Official U.S. Department of Veterans Affairs (VA) Reports: Annual Benefits Reports (ABRs) 12, Office of Inspector General (OIG) audits, program-specific evaluations, and reports from VA research centers.
U.S. Government Accountability Office (GAO) Reports: GAO frequently investigates the effectiveness and accessibility of VA programs.
Congressional Research Service (CRS) Reports: CRS provides non-partisan analysis for Congress, often covering veteran benefits.
State-Level Government Reports: Audits, legislative reports, or program evaluations conducted by state agencies regarding state-specific veteran benefits (availability may vary significantly).
Academic Research: Peer-reviewed studies published in relevant journals (e.g., health policy, social work, public administration) examining benefit access, barriers, and utilization rates. Databases like PubMed, JSTOR, and Google Scholar will be searched.
Reputable Veterans Service Organizations (VSOs): Reports and publications from major, established VSOs (e.g., VFW, DAV, IAVA, American Legion) may be consulted, but claims must be critically evaluated and ideally corroborated by official data.
Credible News Media: News reports citing specific data or findings from the above official/academic sources can serve as pointers for further investigation but will not be used as the sole basis for determination.
B. Criteria for underutilized DeterminationA benefit will be marked as underutilized: true only if credible, documented evidence meeting specific criteria is found. Speculation or anecdotal evidence will not suffice. The criteria include:
Explicit Statement in Official Report: A report from the VA, GAO, OIG, CRS, or an equivalent state auditing/reporting body explicitly states that the benefit has significantly low participation rates relative to the estimated eligible population or identifies it as underutilized.
Documented Systemic Barriers: Multiple credible sources (prioritizing official reports and academic studies) document significant, systemic barriers preventing eligible veterans from accessing the benefit (e.g., overly complex application processes, lack of program awareness, stringent documentation requirements not easily met).
Quantitative Data Gap: Official data sources demonstrate a substantial, quantified gap between the estimated number of eligible veterans and the number of actual recipients.
If, after a reasonable and documented search effort using the sources listed above, no evidence meeting these criteria is found for a specific benefit, the default value will be underutilized: false. This conservative approach ensures the flag is meaningful and evidence-based. Establishing clear, objective criteria is essential for maintaining the consistency and credibility of this data point, preventing misleading flags based on insufficient evidence.C. Populating underutilizedReason
If a benefit is marked underutilized: true, the underutilizedReason field will be populated with a concise summary of the primary documented reason(s) for the underutilization.
Whenever possible, a citation or reference to the source document(s) will be included within the string (e.g., "Complex application process cited in GAO-23-XXX," "Lack of awareness among rural veterans per VA study," "Eligibility criteria confusion documented in").
If multiple reasons are well-documented, the most significant ones will be listed briefly.
If underutilized is false, the underutilizedReason field will be omitted or set to null in the JSON object.
V. Dataset Schema, Validation, and DeliveryA. JSON Schema DefinitionThe structure of the dataset is critical for its usability within the Gemini application. Each benefit will be represented as an object within a main JSON array. The schema for each benefit object is defined below:Table 1: Veteran Benefit JSON SchemaField NameData TypeRequiredDescriptionConstraints/ExamplesbenefitNameStringYesThe full, official name of the veteran benefit.e.g., "VA Health Care", "Post-9/11 GI Bill (Chapter 33)", "California Disabled Veterans' Property Tax Exemption"levelStringYesIndicates whether the benefit is provided at the federal or state level.Enum: "federal", "state"stateStringNoThe two-letter uppercase state abbreviation. Required only if level is "state".e.g., "CA", "TX", "NY", "FL". Omit or null if level is "federal".categoryStringYesThe primary category the benefit falls under.Enum: "healthcare", "housing", "education", "employment", "financial", "burial", "other"descriptionStringYesA concise summary of what the benefit provides, written for clarity to the veteran end-user.Should accurately reflect the benefit's purpose and scope.eligibilityStringYesDetailed eligibility criteria. Should capture key requirements like service history, discharge status, disability, income, residency, etc.May use structured text or bullet points for clarity. e.g., "Wartime veteran (served 90+ days, 1+ day wartime); Honorable discharge; Age 65+ OR P&T disability; Income/asset limits apply."applicationStringYesStep-by-step instructions or overview of how to apply or claim the benefit, including all valid methods (online, mail, phone, in-person).Include form numbers (e.g., VA Form 21-526EZ), relevant offices (e.g., County Assessor, CVSO, PMC), and contact info if needed.sourceString (URL)YesA direct, valid URL to the official government webpage detailing the specific benefit.Must link to an official source (.gov,.mil, state equivalent). Link should be as specific to the benefit as possible.tagsArray of StringYesAn array of lowercase tags for filtering and categorization, using the controlled vocabulary.e.g., ["financial", "tax_property", "disability_rating", "spouse_eligible", "residency_required"]underutilizedBooleanYesIndicates if the benefit is demonstrably underutilized based on documented evidence.true / falseunderutilizedReasonStringNoA brief explanation of why the benefit is underutilized, citing sources if possible. Required only if underutilized is true.e.g., "Complex application process per GAO-XX-XXX", "Lack of awareness documented in VA report"Note: Categories 'burial' and 'other' were added based on the scope of benefits identified during research (e.g.34).This formal schema provides the necessary blueprint for consistent data collection and ensures the final dataset is structured correctly for integration into the Gemini application's backend systems.B. Tagging Strategy and Controlled VocabularyTo enable effective filtering and categorization within the Gemini application, a controlled vocabulary will be used for the tags array associated with each benefit. Using a predefined list ensures consistency and prevents variations (e.g., "spouse", "spousal benefit", "surviving spouse") that would hinder filtering accuracy.Initial Controlled Vocabulary (Lowercase):[active_duty, reserve, national_guard, disability_rating, service_connected, wartime_service, spouse_eligible, child_eligible, parent_eligible, survivor_benefit, income_based, asset_limit, residency_required, education_degree, education_vocational, education_certificate, education_otr, education_apprenticeship, housing_loan, housing_grant, housing_rental, housing_homeless, employment_training, employment_preference, employment_job_search, entrepreneurship, healthcare_medical, healthcare_dental, healthcare_vision, healthcare_mental, healthcare_longtermcare, financial_assistance, financial_grant, tax_property, tax_income, license_professional, license_recreational, license_vehicle, burial_benefit, legal_assistance, transportation, underutilized, no_cost, reduced_fee, age_requirement, expeditionary_medal, permanent_total, unemployability, homestead]This initial list is derived from common eligibility factors and benefit types observed in the source materials.10 This vocabulary will be reviewed and may be expanded during the research process if significant, recurring themes necessitate new standardized tags. Any additions will be documented.C. Data Quality Assurance and ValidationMaintaining high data quality is paramount. The following validation steps will be implemented:
Accuracy Checks: Extracted data points, especially quantitative details (benefit amounts, disability percentages, income limits, dates) and procedural steps (application instructions), will be rigorously cross-referenced against the original source documents. A peer-review process will involve a second analyst verifying a statistically significant sample of the dataset entries for accuracy.
Consistency Checks: The application of category and tags will be reviewed for uniformity across the dataset. Terminology used in description and eligibility fields will be standardized where feasible, without altering the official meaning. Logic checks will ensure that the state field is populated if and only if the level field is "state".
URL Validation: All URLs provided in the source field will be programmatically checked for validity (returning an HTTP 200 OK status). Manual checks will confirm that the linked page still contains relevant information about the specific benefit. A protocol will be followed for handling broken or redirected links: attempt to find an updated official URL on the agency's site; if unsuccessful, document the broken link and potentially use the main agency URL as a fallback, noting the lack of a specific page. This addresses the issue of link rot observed with some state resources.44
Schema Validation: Automated tools (JSON linters and schema validators) will be used to verify that the final JSON output strictly conforms to the schema defined in Section V.A.
D. Delivery Format
The primary deliverable will be a single JSON file, UTF-8 encoded, containing one array named veteran_benefits (or similar), where each element is a benefit object conforming to the schema.
The optional secondary deliverable will be a CSV file generated directly from the final, validated JSON data, ensuring data consistency between formats. Column headers in the CSV will match the JSON field names.
VI. Initial Considerations and Potential ChallengesA. Key Observations from Preliminary ResearchThe initial review of source materials reveals several important characteristics of the veteran benefits landscape:
Information Fragmentation: Benefit information is dispersed across numerous federal and state websites, requiring substantial effort to locate, consolidate, and cross-reference.16 This complexity likely hinders veterans' ability to find relevant information.
Eligibility Complexity: Rules governing eligibility are frequently intricate, involving complex combinations of service history (dates, duration, location, wartime periods), discharge status, VA disability ratings, income and asset levels, state residency, and family relationships.12 Accurately capturing these nuances is critical for the Gemini application's matching function.
Diverse Application Processes: Methods for applying for benefits vary widely, from straightforward online portals to multi-step paper-based processes requiring specific documentation and submission to different federal, state, or county offices.8 Clear and comprehensive guidance is essential.
Federal/State Interplay: State benefits often supplement or interact with federal benefits (e.g., state tuition waivers used alongside GI Bill 51, state property tax exemptions based on federal VA disability ratings 26). These relationships need to be understood and potentially noted.
B. Potential Challenges and Mitigation StrategiesSeveral challenges are anticipated during this project:
Scarcity of Underutilization Data: Obtaining reliable, quantitative data specifically documenting the underutilization of all benefits, particularly at the state level, will be challenging. Official reports often focus on major federal programs.

Mitigation: Adhere strictly to the evidence-based criteria outlined in Section IV.B. Prioritize official government reports (VA, GAO, state audits). Default the underutilized flag to false when robust evidence is lacking. Rigorously document sources within the underutilizedReason field when the flag is set to true.


State Data Variability and Accessibility: The quality, completeness, organization, and technical accessibility (e.g., broken links, non-standard formats) of online information will differ markedly across the 50 states.

Mitigation: Employ the systematic multi-agency source identification protocol (Section III.A). Implement the plan for handling data gaps and documenting missing information (Section III.C). Utilize robust URL validation and link remediation techniques (Section V.C). Acknowledge limitations in the final dataset where information could not be reliably sourced online.


Maintaining Data Freshness: Veteran benefits are subject to frequent changes in legislation, regulations, eligibility criteria, benefit amounts, application procedures, and website URLs. The dataset created represents a snapshot in time.

Mitigation: While this plan focuses on the initial creation, it is strongly recommended that a process for periodic review and updates (e.g., annually or biannually) be established for the Gemini project. This could involve automated checks for URL changes, monitoring legislative updates, and targeted re-verification of key benefits.


Defining Benefit Granularity: Determining the appropriate level of detail for each benefit object is crucial. For instance, should different types of VA disability compensation (basic, SMC, DIC) 13 or various VA home loan products 9 be represented as separate JSON objects or detailed within a single object?

Mitigation: Establish a clear rule: If eligibility criteria, target beneficiary groups, or application processes differ significantly, create separate benefit objects. If variations primarily involve different payment rates or minor sub-options within the same core eligibility and application framework, handle these details within the description or eligibility fields of a single object.


C. Broader ImplicationsSuccessfully executing this research plan and creating the proposed dataset holds significant potential:
Enhanced Access: The dataset can serve as a powerful resource for the Gemini application, significantly improving veterans' ability to identify and understand the full range of benefits they may be eligible for.
Targeted Outreach: The underutilization analysis, even with its potential limitations, can provide valuable pointers for policymakers, the VA, state agencies, and VSOs to focus outreach efforts and investigate barriers related to specific programs.
System Simplification Insights: Documenting complex eligibility rules and application processes across federal and state levels may highlight areas where simplification could improve veteran access.
Future Research: The structured nature of the dataset could facilitate future comparative analyses of benefit landscapes across different states, categories, or veteran populations.
VII. ConclusionThis research plan outlines a comprehensive and systematic approach to building a high-quality, structured dataset of federal and state veteran benefits. By adhering to principles of accuracy, comprehensiveness, clarity, usability, and source integrity, the project aims to create a vital resource for the Gemini application. The plan acknowledges the inherent complexities of the benefits landscape, including information fragmentation, intricate eligibility rules, and data variability across states. It incorporates strategies for identifying reliable sources, extracting data consistently, validating information rigorously, and addressing anticipated challenges like data gaps and underutilization analysis. The resulting JSON dataset, defined by a clear schema and enriched with evidence-based underutilization insights, will be well-positioned to empower veterans by connecting them more effectively with the benefits they have earned through their service. The successful completion of this project requires meticulous execution, adherence to the outlined methodologies, and a commitment to data quality

Works cited
About VA Health Benefits | Veterans Affairs - VA.gov, accessed May 12, 2025, https://www.va.gov/health-care/about-va-health-benefits/
VA Health Care | Veterans Affairs - VA.gov, accessed May 12, 2025, https://www.va.gov/health-care/
Employment Resources For Veterans | Veterans Affairs - VA.gov, accessed May 12, 2025, https://www.va.gov/careers-employment/veteran-resources/
VA Education And Training Benefits | Veterans Affairs - VA.gov, accessed May 12, 2025, https://www.va.gov/education/
Veteran Readiness And Employment (Chapter 31) | Veterans Affairs, accessed May 12, 2025, https://www.va.gov/careers-employment/vocational-rehabilitation/
VA Pension Benefits | Veterans Affairs - VA.gov, accessed May 12, 2025, https://www.va.gov/pension/
VA Disability Compensation | Veterans Affairs - VA.gov, accessed May 12, 2025, https://www.va.gov/disability/
Applying for Benefits - Veterans Benefits Administration. - VA.gov, accessed May 12, 2025, https://www.benefits.va.gov/BENEFITS/Applying.asp
VA Home Loans Home - Veterans Benefits Administration. - VA.gov, accessed May 12, 2025, https://www.benefits.va.gov/homeloans/
Summary of VA Education Benefits, accessed May 12, 2025, https://benefits.va.gov/BENEFITS/benefits-summary/Education_Overview_SinglePages_091911_1400_P.pdf
Elderly Veterans - Veterans Benefits Administration., accessed May 12, 2025, https://www.benefits.va.gov/persona/veteran-elderly.asp
Compensation - Veterans Benefits Administration. - VA.gov, accessed May 12, 2025, https://www.benefits.va.gov/REPORTS/abr/docs/2021_compensation.pdf
Types of Compensation - Compensation, accessed May 12, 2025, https://www.benefits.va.gov/COMPENSATION/types-compensation.asp
How to Apply - Compensation - Veterans Benefits Administration, accessed May 12, 2025, https://www.benefits.va.gov/compensation/apply.asp
Veteran Readiness and Employment (VR&E) Home - Veterans Benefits Administration., accessed May 12, 2025, https://www.benefits.va.gov/vocrehab/
Home - VA/DoD eBenefits, accessed May 12, 2025, https://www.ebenefits.va.gov/
Learn About Housing Benefits - VA/DoD eBenefits, accessed May 12, 2025, https://www.ebenefits.va.gov/ebenefits/learn/housing
Veterans Employment Services | U.S. Department of Labor, accessed May 12, 2025, https://www.dol.gov/agencies/vets/veterans/veterans-employment-services
About GI Bill Education Benefits | Military OneSource, accessed May 12, 2025, https://www.militaryonesource.mil/benefits/gi-bill-education-benefits/
Apply for Veterans Pension benefits - VA.gov, accessed May 12, 2025, https://www.va.gov/pension/apply-for-veteran-pension-form-21p-527ez/
Post-9/11 GI Bill (Chapter 33) | Veterans Affairs, accessed May 12, 2025, https://www.va.gov/education/about-gi-bill-benefits/post-9-11/
Post-9/11 GI Bill (Chapter 33) Rates | Veterans Affairs, accessed May 12, 2025, https://www.va.gov/education/benefit-rates/post-9-11-gi-bill-rates/
Montgomery GI Bill Active Duty (MGIB-AD) | Veterans Affairs, accessed May 12, 2025, https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/
Eligibility For Veterans Pension - VA.gov, accessed May 12, 2025, https://www.va.gov/pension/eligibility/
Survivor Compensation | Veterans Affairs, accessed May 12, 2025, https://www.va.gov/family-and-caregiver-benefits/survivor-compensation/
CalVet Veteran Services Property Tax Exemptions - CA.gov, accessed May 12, 2025, https://www.calvet.ca.gov/VetServices/Pages/Property-Tax-Exemptions.aspx
Texas Fishing License: The Complete Guide for 2025, accessed May 12, 2025, https://fishingbooker.com/blog/texas-fishing-license-quick-guide/
Veteran Benefits for New York - Veterans Guardian - VA Claim Consulting, accessed May 12, 2025, https://vetsguardian.com/veteran-benefits-for-new-york/
Military & Veterans Information - Florida Department of Highway Safety and Motor Vehicles, accessed May 12, 2025, https://www.flhsmv.gov/military/
Chapter 196 Section 081 - 2012 Florida Statutes - The Florida Senate, accessed May 12, 2025, https://www.flsenate.gov/Laws/Statutes/2012/196.081
General Exemption Information | Lee County Property Appraiser, accessed May 12, 2025, https://www.leepa.org/exemption/generalexemptioninfo.aspx
Chapter 295 Section 07 - 2024 Florida Statutes, accessed May 12, 2025, https://m.flsenate.gov/statutes/295.07
Texas State Veterans Cemeteries Pre-Registration Packet, accessed May 12, 2025, https://www.glo.texas.gov/sites/default/files/resources/vlb/forms/TSVC-Form-5_Pre-Registration-Application_with-WTSVC.pdf
Texas State Veterans Cemeteries, accessed May 12, 2025, https://www.glo.texas.gov/veterans/texas-state-veterans-cemeteries
New York State Department of Veterans' Services: NYS Department of Veterans' Services Home Page, accessed May 12, 2025, https://veterans.ny.gov/
Benefits & Services - Florida Department of Veterans' Affairs, accessed May 12, 2025, https://www.floridavets.org/benefits-services/
Department of Military and Veterans Affairs | Department of Military ..., accessed May 12, 2025, https://www.pa.gov/agencies/dmva.html
Department of Veterans Affairs, accessed May 12, 2025, https://veterans.illinois.gov/
Georgia Department of Veterans Service, accessed May 12, 2025, https://georgia.gov/organization/georgia-department-veterans-service
North Carolina Department of Military and Veterans Affairs, accessed May 12, 2025, https://www.sosnc.gov/divisions/general_counsel/other_help_nc_department_of_military_and_veterans_affairs
Veterans' Exemption - California State Board of Equalization - CA.gov, accessed May 12, 2025, https://www.boe.ca.gov/proptaxes/veterans_exemption.htm
Property Tax Exemptions - Texas Comptroller, accessed May 12, 2025, https://comptroller.texas.gov/taxes/property-tax/exemptions/
Property Tax Exemption For Texas Disabled Vets! - TexVet, accessed May 12, 2025, https://texvet.org/propertytax
accessed December 31, 1969, https://www.calvet.ca.gov/calvet-programs/property-tax-exemption
Veterans exemptions - Department of Taxation and Finance - NY.Gov, accessed May 12, 2025, https://www.tax.ny.gov/pit/property/exemption/vetexempt.htm
Property Tax - Taxpayers - Exemptions - Florida Dept. of Revenue, accessed May 12, 2025, https://floridarevenue.com/property/Pages/Taxpayers_Exemptions.aspx
How do I qualify for the College Fee Waiver Program?, accessed May 12, 2025, https://www.calvet.ca.gov/VetServices/Pages/How-do-I-qualify-for-the-College-Fee-Waiver-Program.aspx
CalVet College Fee Waiver (CVFW) - TritonLink, accessed May 12, 2025, https://students.ucsd.edu/finances/veterans/cal-vet.html
Hazlewood Act ⋆ Texas Education Benefit ⋆ Texas Veterans Commission, accessed May 12, 2025, https://tvc.texas.gov/education/hazlewood/
Forms - Loan and Scholarship Programs - HHLoans, accessed May 12, 2025, http://www.hhloans.com/index.cfm?objectid=D9AD752B-D04F-DCA9-82C0299D3B39087D
Veterans Tuition Award | HESC, accessed May 12, 2025, https://hesc.ny.gov/find-aid/nys-grants-scholarships/veterans-tuition-awards
Veterans Tuition Award | HESC - NY.gov, accessed May 12, 2025, https://www.ny.gov/services/veterans-tuition-awards
accessed December 31, 1969, https://www.calvet.ca.gov/calvet-programs/college-fee-waiver
Hazlewood Act ⋆ Texas Education Benefit ⋆ Texas Veterans ..., accessed May 12, 2025, https://www.tvc.texas.gov/education/hazlewood/
accessed December 31, 1969, https://www.tvc.texas.gov/education/hazlewood-act-eligibility-requirements/
accessed December 31, 1969, https://www.hesc.ny.gov/pay-for-college/financial-aid/types-of-financial-aid/nys-grants-scholarships-awards/veterans-tuition-awards.html
Home - Florida Student Scholarship & Grant Programs, accessed May 12, 2025, https://www.floridastudentfinancialaidsg.org/SAPHome/SAPHome?url=home
Veterans Preference Application Form (CalHR - CalCareers - CA.gov, accessed May 12, 2025, https://calcareers.ca.gov/calhrpublic/landing/jobs/veteransinformation.aspx
Veterans Preferences PSD - CHP - CA.gov, accessed May 12, 2025, https://www.chp.ca.gov/chp-careers/public-safety-dispatcher/veterans-preferences-psd-pso
statutes.capitol.texas.gov, accessed May 12, 2025, https://statutes.capitol.texas.gov/docs/gv/htm/gv.657.htm#:~:text=657.003.,not%20have%20a%20greater%20qualification.
GOVERNMENT CODE CHAPTER 657. MILITARY EMPLOYMENT PREFERENCES - Texas Statutes, accessed May 12, 2025, https://statutes.capitol.texas.gov/docs/gv/htm/gv.657.htm
Veterans' Preference – Florida Department of Veterans' Affairs, accessed May 12, 2025, https://floridavets.org/benefits-services/veterans-preference/
accessed December 31, 1969, https://www.calvet.ca.gov/calvet-programs/employment
Employment - Texas Veterans Commission - Texas.gov, accessed May 12, 2025, https://www.tvc.texas.gov/employment/
Employment | New York State Department of Veterans' Services, accessed May 12, 2025, https://veterans.ny.gov/employment
accessed December 31, 1969, https://floridavets.org/benefits-assistance/employment/
Get a CalVet Home Loan | CA.gov, accessed May 12, 2025, https://www.ca.gov/departments/163/services/64/
New Customer - CalVet - CA.gov, accessed May 12, 2025, https://www.calvet.ca.gov/HomeLoans/Pages/New-Customer.aspx
Land Loans - Veterans - Texas General Land Office, accessed May 12, 2025, https://www.glo.texas.gov/veterans/land-sale/land-loans
Loans for Veterans | Texas General Land Office, accessed May 12, 2025, https://www.glo.texas.gov/veterans/loans-veterans
Texas Veterans Home Loan & Home Improvement Programs - Texas General Land Office, accessed May 12, 2025, https://www.glo.texas.gov/sites/default/files/2025-01/certification-application.pdf
Home Loan 7 Steps copy - Texas.gov, accessed May 12, 2025, https://www.glo.texas.gov/sites/default/files/2025-02/home-loan-7-steps.pdf
CalVet Home Loans - CA.gov, accessed May 12, 2025, https://www.calvet.ca.gov/calvet-programs/home-loans
accessed December 31, 1969, https://vlb.texas.gov/loans/home-loans/index.html
Housing | New York State Department of Veterans' Services, accessed May 12, 2025, https://veterans.ny.gov/housing
Hunting & Fishing Licenses | Bexar County, TX - Official Website, accessed May 12, 2025, https://www.bexar.org/3820/Hunting-Fishing-Licenses
Texas Driver Licenses for Veterans - TexVet, accessed May 12, 2025, https://texvet.org/resources/texas-driver-licenses-veterans
Driver License Fees - Texas Department of Public Safety, accessed May 12, 2025, https://www.dps.texas.gov/section/driver-license/driver-license-fees
Free/Reduced Fee Sporting Licenses - NYSDEC, accessed May 12, 2025, https://dec.ny.gov/regulatory/permits-licenses/sporting-and-use/sporting/free-reduced-fee
NEW YORK VETERANS, accessed May 12, 2025, https://nyassembly.gov/member_files/063/20131023/index.pdf
Information for Military and Veterans | NY DMV, accessed May 12, 2025, https://dmv.ny.gov/more-info/information-for-military-and-veterans
Military Gold Sportsman's License - FWC, accessed May 12, 2025, https://myfwc.com/license/recreational/military-gold/
Military Hunting & Fishing Licenses - Bay County Tax Collector, accessed May 12, 2025, https://baycountyfltax.gov/military/military-hunting-and-fishing-licenses/
Veteran Benefits - Flagler County Tax Collector, accessed May 12, 2025, https://www.flaglertax.gov/veterans/
California Veterans Homes – Long Term Care - CalVet - CA.gov, accessed May 12, 2025, https://www.calvet.ca.gov/VetServices/Documents/CalVet%20Homes,%20Long%20Term%20Care.pdf
Veterans Home of California (VHC) Admission ... - CalVet - CA.gov, accessed May 12, 2025, https://www.calvet.ca.gov/vethomes/documents/vhcapp.pdf
55-11.005 : Admission Eligibility - Florida Administrative Rules, Law ..., accessed May 12, 2025, https://www.flrules.org/gateway/ruleno.asp?id=55-11.005
55-11 : VETERANS' DOMICILIARY HOME OF FLORIDA - Florida Administrative Rules, Law, Code, Register - FAC, FAR, eRulemaking, accessed May 12, 2025, https://www.flrules.org/gateway/ChapterHome.asp?Chapter=55-11
Ardie R. Copas State Veterans' Nursing Home - About FDVA Our Locations, accessed May 12, 2025, https://floridavets.org/wp-content/uploads/2023/03/FDVA_Brochure_Copas_2023.pdf
List of State Veterans Homes, accessed May 12, 2025, https://www.veteransaidbenefit.org/list_state_veterans_homes.htm
accessed December 31, 1969, https://www.calvet.ca.gov/veteran-homes
accessed December 31, 1969, https://floridavets.org/benefits-assistance/state-veterans-homes/
CalVet Veteran Services Burial and Plot-Interment Allowances, accessed May 12, 2025, https://www.calvet.ca.gov/VetServices/Pages/Burial-and-Plot-Interment-Allowances.aspx
Pre-Need Eligibility For Burial In A VA Cemetery | Veterans Affairs, accessed May 12, 2025, https://www.va.gov/burials-memorials/pre-need-eligibility/
Funeral and Burial Services - Veterans - NYC.gov, accessed May 12, 2025, https://www.nyc.gov/site/veterans/services/funeral-and-burial-services.page
ELIGIBILITY DETERMINATIONS FOR BURIAL - IN ADVANCE OF NEED - Florida Department of Veterans' Affairs, accessed May 12, 2025, https://floridavets.org/wp-content/uploads/2017/02/VA-Pre-Need-Determination-of-Eligibility-Program.pdf
The Florida Department of Veterans' Affairs operates eight skilled - Pembroke Pines, FL, accessed May 12, 2025, https://www.ppines.com/DocumentCenter/View/23280/Veterans
Florida National Cemetery, accessed May 12, 2025, https://www.cem.va.gov/cems/nchp/Florida.asp
Burial Benefits – Florida Department of Veterans' Affairs, accessed May 12, 2025, https://floridavets.org/benefits-services/burial/
Florida - Find a Cemetery, accessed May 12, 2025, https://www.cem.va.gov/find-cemetery/state.asp?STATE=FL
California State Veterans Benefits: A Comprehensive Guide | CCK ..., accessed May 12, 2025, https://cck-law.com/blog/california-state-veterans-benefits-a-comprehensive-guide/
Grantseeker Resources - Texas Veterans Commission, accessed May 12, 2025, https://tvc.texas.gov/grants/grantseekers/
accessed December 31, 1969, https://www.tvc.texas.gov/benefits/property-tax-assistance/
accessed December 31, 1969, https://www.tvc.texas.gov/housing/
Homestead exemption, surviving spouse of veteran - Florida Attorney General, accessed May 12, 2025, https://www.myfloridalegal.com/print/pdf/node/2546
Exemptions - Leon County Property Appraiser, accessed May 12, 2025, https://www.leonpa.gov/Exemptions
Veteran Readiness and Employment (VR&E), accessed May 12, 2025, https://benefits.va.gov/REPORTS/abr/docs/2023-veteran-readiness-employment.pdf
Survivors' And Dependents' Educational Assistance | Veterans Affairs, accessed May 12, 2025, https://www.va.gov/family-and-caregiver-benefits/education-and-careers/dependents-education-assistance/

