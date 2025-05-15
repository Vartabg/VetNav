// src/utils/pdf/generatePdf.ts
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Ensure this is correctly installed and imported
import { VeteranBenefit, BenefitFilters } from '../../data/types'; // Assuming types.ts is correct

// Extend jsPDF interface if autoTable is not recognized by default types
// This should be in a .d.ts file (e.g., src/types/jspdf.d.ts) if you made one earlier:
/*
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    // Add other custom or missing properties if needed
  }
}
*/

// Function to generate a PDF for a list of benefits
export const generateBenefitsPdf = (
  benefitsToDisplay: VeteranBenefit[], // CHANGED: Expects an array of benefits
  filename: string = 'benefits-report.pdf'
): void => {
  const doc = new jsPDF();

  // Add a title to the document
  doc.setFontSize(18);
  doc.text('Veteran Benefits Report', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);

  // Define table columns
  const tableColumn = ["Title", "Level/State", "Category", "Description (Summary)"];
  // Define table rows
  const tableRows: any[][] = []; // Use any[][] for flexibility with autoTable

  benefitsToDisplay.forEach(benefit => {
    const benefitData = [
      benefit.title, // CHANGED from benefitName
      benefit.level === 'federal' ? 'Federal' : `State: ${benefit.state || 'N/A'}`,
      benefit.category,
      benefit.description.length > 100 ? benefit.description.substring(0, 97) + '...' : benefit.description,
    ];
    tableRows.push(benefitData);
  });

  // Add table to PDF
  (doc as any).autoTable({ // Use 'as any' if autoTable types are still problematic
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'striped', // or 'grid', 'plain'
    headStyles: { fillColor: [22, 160, 133] }, // Example header color
    styles: { fontSize: 8 },
    columnStyles: {
        0: { cellWidth: 40 }, // Title
        1: { cellWidth: 30 }, // Level/State
        2: { cellWidth: 30 }, // Category
        3: { cellWidth: 'auto' },// Description
    }
  });

  // Add page numbers (optional)
  const pageCount = (doc as any).internal.getNumberOfPages(); // Use 'as any' for safety
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 25, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(filename);
};


// Function to generate a PDF for a single benefit
export const generateSingleBenefitPdf = (
  benefit: VeteranBenefit,
  filename: string = 'benefit-detail.pdf'
): void => {
  const doc = new jsPDF();
  let yPos = 25; // Initial Y position for text

  // Add title
  doc.setFontSize(18);
  doc.text(benefit.title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' }); // CHANGED from benefitName

  // Add basic information
  doc.setFontSize(12);
  doc.text(`Category: ${benefit.category}`, 14, yPos);
  yPos += 7;
  doc.text(`Level: ${benefit.level === 'federal' ? 'Federal' : `State (${benefit.state || 'N/A'})`}`, 14, yPos);
  yPos += 7;
  if (benefit.priority) {
    doc.text(`Priority: ${benefit.priority}`, 14, yPos);
    yPos += 7;
  }
  yPos += 3; // Extra space before next section

  // Description
  doc.setFontSize(14);
  doc.text("Description:", 14, yPos);
  yPos += 6;
  doc.setFontSize(10);
  const splitDescription = doc.splitTextToSize(benefit.description, 180); // 180 is width
  doc.text(splitDescription, 14, yPos);
  yPos += splitDescription.length * 5 + 5; // Adjust spacing based on lines

  // Eligibility
  doc.setFontSize(14);
  doc.text("Eligibility:", 14, yPos);
  yPos += 6;
  doc.setFontSize(10);
  // CHANGED: Join eligibility array into a string
  const eligibilityText = Array.isArray(benefit.eligibility) ? benefit.eligibility.join('; ') : 'Not specified.';
  const splitEligibility = doc.splitTextToSize(eligibilityText, 180);
  doc.text(splitEligibility, 14, yPos);
  yPos += splitEligibility.length * 5 + 5;

  // Application
  doc.setFontSize(14);
  doc.text("How to Apply:", 14, yPos);
  yPos += 6;
  doc.setFontSize(10);
  // CHANGED: Format application object into a string
  let applicationText = 'Application details not specified.';
  if (benefit.application) {
    const appParts = [];
    if (benefit.application.url) {
      appParts.push(`URL: ${benefit.application.url}`);
    }
    if (benefit.application.instructions) {
      appParts.push(`Instructions: ${benefit.application.instructions}`);
    }
    if (appParts.length > 0) {
      applicationText = appParts.join('\n\n'); // More space between URL and instructions
    }
  }
  const splitApplication = doc.splitTextToSize(applicationText, 180);
  doc.text(splitApplication, 14, yPos);
  yPos += splitApplication.length * 5 + 5;

  // Source
  doc.setFontSize(14);
  doc.text("Source:", 14, yPos);
  yPos += 6;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 255); // Blue for link
  doc.textWithLink(benefit.source, 14, yPos, { url: benefit.source });
  doc.setTextColor(0, 0, 0); // Reset color
  yPos += 10;

  // Tags
  if (Array.isArray(benefit.tags) && benefit.tags.length > 0) {
    doc.setFontSize(14);
    doc.text("Tags:", 14, yPos);
    yPos += 6;
    doc.setFontSize(10);
    const tagsText = benefit.tags.join(', ');
    const splitTags = doc.splitTextToSize(tagsText, 180);
    doc.text(splitTags, 14, yPos);
    yPos += splitTags.length * 5 + 5;
  }

  // Underutilized
  if (typeof benefit.underutilized === 'boolean') {
    doc.setFontSize(14);
    doc.text(`Underutilized: ${benefit.underutilized ? 'Yes' : 'No'}`, 14, yPos);
    yPos += 6;
    if (benefit.underutilized && benefit.underutilizedReason) {
      doc.setFontSize(10);
      const splitReason = doc.splitTextToSize(`Reason: ${benefit.underutilizedReason}`, 180);
      doc.text(splitReason, 14, yPos);
      yPos += splitReason.length * 5 + 5;
    }
  }

  doc.save(filename);
};