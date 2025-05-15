#!/bin/bash

# Fix TypeScript errors in the PDF generator
cat > src/utils/pdf/generatePdf.ts << 'FIXEDPDF'
// src/utils/pdf/generatePdf.ts
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { filterBenefits } from '../../data/services/benefitsService';
import { BenefitFilters, VeteranBenefit } from '../../data/types';

// Declare the autotable plugin to work with TypeScript
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    internal: {
      scaleFactor: number;
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      pages: number[];
      getNumberOfPages: () => number;
      getEncryptor: (objectId: number) => (data: string) => string;
      events: any;
    };
    setPage: (pageNumber: number) => jsPDF;
  }
}

// Function to generate a PDF of benefits based on filters
export const generateBenefitsPdf = (filters: BenefitFilters = {}, fileName = 'veteran-benefits.pdf') => {
  // Get filtered benefits
  const benefits = filterBenefits(filters);
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Veteran Benefits Report', 105, 15, { align: 'center' });
  
  // Add filter information
  doc.setFontSize(12);
  doc.text('Filters Applied:', 14, 25);
  
  let yPos = 30;
  if (filters.category && filters.category !== 'all') {
    doc.text(`Category: ${filters.category}`, 20, yPos);
    yPos += 5;
  }
  
  if (filters.state && filters.state !== 'all') {
    doc.text(`State: ${filters.state}`, 20, yPos);
    yPos += 5;
  }
  
  if (filters.level && filters.level !== 'all') {
    doc.text(`Level: ${filters.level}`, 20, yPos);
    yPos += 5;
  }
  
  if (filters.underutilized !== undefined) {
    doc.text(`Underutilized Only: ${filters.underutilized ? 'Yes' : 'No'}`, 20, yPos);
    yPos += 5;
  }
  
  if (filters.keyword) {
    doc.text(`Keyword: ${filters.keyword}`, 20, yPos);
    yPos += 5;
  }
  
  yPos += 10;
  
  // Add number of results
  doc.text(`Total Benefits Found: ${benefits.length}`, 14, yPos);
  yPos += 10;
  
  // Prepare data for table
  const tableRows = benefits.map(benefit => [
    benefit.benefitName,
    benefit.level === 'federal' ? 'Federal' : `State: ${benefit.state}`,
    benefit.category,
    benefit.description.length > 100 ? benefit.description.substring(0, 97) + '...' : benefit.description,
    benefit.underutilized ? 'Yes' : 'No'
  ]);
  
  // Generate table
  doc.autoTable({
    startY: yPos,
    head: [['Benefit Name', 'Level', 'Category', 'Description', 'Underutilized']],
    body: tableRows,
    headStyles: { fillColor: [66, 66, 160] },
    styles: { overflow: 'linebreak' },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 70 },
      4: { cellWidth: 25 }
    },
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(fileName);
  
  return doc;
};

// Function to generate a detailed PDF for a single benefit
export const generateSingleBenefitPdf = (benefit: VeteranBenefit, fileName = 'benefit-details.pdf') => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(benefit.benefitName, 105, 15, { align: 'center' });
  
  // Add basic information
  doc.setFontSize(12);
  doc.text(`Level: ${benefit.level === 'federal' ? 'Federal' : `State: ${benefit.state}`}`, 14, 30);
  doc.text(`Category: ${benefit.category}`, 14, 37);
  doc.text(`Underutilized: ${benefit.underutilized ? 'Yes' : 'No'}`, 14, 44);
  
  if (benefit.underutilized && benefit.underutilizedReason) {
    doc.text('Reason for Underutilization:', 14, 51);
    const splitReason = doc.splitTextToSize(benefit.underutilizedReason, 180);
    doc.text(splitReason, 14, 58);
  }
  
  // Add description
  let yPos = benefit.underutilized && benefit.underutilizedReason ? 70 : 55;
  
  doc.setFontSize(14);
  doc.text('Description', 14, yPos);
  yPos += 7;
  
  doc.setFontSize(12);
  const splitDescription = doc.splitTextToSize(benefit.description, 180);
  doc.text(splitDescription, 14, yPos);
  yPos += splitDescription.length * 7;
  
  // Add eligibility information
  yPos += 7;
  doc.setFontSize(14);
  doc.text('Eligibility', 14, yPos);
  yPos += 7;
  
  doc.setFontSize(12);
  const splitEligibility = doc.splitTextToSize(benefit.eligibility, 180);
  doc.text(splitEligibility, 14, yPos);
  yPos += splitEligibility.length * 7;
  
  // Add application information
  yPos += 7;
  doc.setFontSize(14);
  doc.text('How to Apply', 14, yPos);
  yPos += 7;
  
  doc.setFontSize(12);
  const splitApplication = doc.splitTextToSize(benefit.application, 180);
  doc.text(splitApplication, 14, yPos);
  yPos += splitApplication.length * 7;
  
  // Add source information
  yPos += 7;
  doc.setFontSize(14);
  doc.text('Source', 14, yPos);
  yPos += 7;
  
  doc.setFontSize(12);
  const sourceText = `For more information, visit: ${benefit.source}`;
  const splitSource = doc.splitTextToSize(sourceText, 180);
  doc.text(splitSource, 14, yPos);
  
  // Add tags
  yPos += splitSource.length * 7 + 10;
  doc.setFontSize(14);
  doc.text('Tags', 14, yPos);
  yPos += 7;
  
  doc.setFontSize(12);
  const tagsText = benefit.tags.join(', ');
  const splitTags = doc.splitTextToSize(tagsText, 180);
  doc.text(splitTags, 14, yPos);
  
  // Add footer
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Save the PDF
  doc.save(fileName);
  
  return doc;
};

export default {
  generateBenefitsPdf,
  generateSingleBenefitPdf
};
FIXEDPDF

echo "PDF utility TypeScript errors fixed."
