import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import type { BreedPrediction, DogAttributes } from "@shared/types";

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Formats a breed name by replacing underscores with spaces and properly capitalizing each word
 * @param breedName The raw breed name (e.g. "flat-coated_retriever")
 * @returns Formatted breed name (e.g. "Flat-coated Retriever")
 */
function formatBreedName(breedName: string): string {
  // Already properly formatted breed name (e.g. from Hugging Face API)
  if (/^[A-Z]/.test(breedName)) {
    return breedName;
  }
  
  return breedName
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Create a reports directory if it doesn't exist
const reportsDir = path.join(__dirname, "..", "reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

interface ReportData {
  petName: string;
  selectedImage: string;
  topBreeds: BreedPrediction[];
  attributes: DogAttributes;
}

/**
 * Generates a PDF report with dog breed information
 */
export async function generatePdfReport(data: ReportData): Promise<string> {
  const { petName, selectedImage, topBreeds, attributes } = data;
  
  return new Promise((resolve, reject) => {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const dogName = petName || "Dog";
      const filename = `${dogName.replace(/\s+/g, "_")}_Report_${timestamp}.pdf`;
      const filePath = path.join(reportsDir, filename);
      
      // Create a write stream
      const pdfStream = fs.createWriteStream(filePath);
      
      // Create a new PDF document
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        size: "A4",
      });
      
      // Pipe the PDF to the file
      doc.pipe(pdfStream);
      
      // Helper function to draw a border around the page
      const drawBorder = () => {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;
        const margin = 30;
        
        // Save current state
        doc.save();
        
        // Set border style
        doc.lineWidth(1)
           .strokeColor('#333333')
           .rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2))
           .stroke();
        
        // Add decorative corner elements
        const cornerSize = 15;
        
        // Top-left corner
        doc.lineWidth(1.5)
           .moveTo(margin, margin + cornerSize)
           .lineTo(margin, margin)
           .lineTo(margin + cornerSize, margin)
           .stroke();
        
        // Top-right corner
        doc.moveTo(pageWidth - margin - cornerSize, margin)
           .lineTo(pageWidth - margin, margin)
           .lineTo(pageWidth - margin, margin + cornerSize)
           .stroke();
        
        // Bottom-left corner
        doc.moveTo(margin, pageHeight - margin - cornerSize)
           .lineTo(margin, pageHeight - margin)
           .lineTo(margin + cornerSize, pageHeight - margin)
           .stroke();
        
        // Bottom-right corner
        doc.moveTo(pageWidth - margin - cornerSize, pageHeight - margin)
           .lineTo(pageWidth - margin, pageHeight - margin)
           .lineTo(pageWidth - margin, pageHeight - margin - cornerSize)
           .stroke();
        
        // Restore state
        doc.restore();
      };
      
      // Draw page border
      drawBorder();
      
      // Add header with background shading
      const headerHeight = 40;
      const headerY = 30;
      
      doc.fillColor('#f0f0f0')
         .rect(30, headerY, doc.page.width - 60, headerHeight)
         .fill();
         
      doc.fillColor('#333333')
         .fontSize(22)
         .font('Helvetica-Bold')
         .text('BREED COMPOSITION ANALYSIS', 
               50, 
               headerY + 10, 
               { align: 'center' });
      
      // Create a layout for pet information box
      const petInfoBoxY = headerY + headerHeight + 15;
      const petInfoBoxHeight = 110;
      
      // Draw ID-card style container
      doc.fillColor('#f9f9f9')
         .roundedRect(50, petInfoBoxY, doc.page.width - 100, petInfoBoxHeight, 5)
         .fill();
         
      doc.strokeColor('#cccccc')
         .lineWidth(0.5)
         .roundedRect(50, petInfoBoxY, doc.page.width - 100, petInfoBoxHeight, 5)
         .stroke();
      
      // Add pet name as heading
      if (petName) {
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .fillColor('#333333')
           .text('Pet Name:', 70, petInfoBoxY + 20);
           
        doc.fontSize(16)
           .font('Helvetica')
           .text(petName, 170, petInfoBoxY + 20);
      }
      
      // Add date
      doc.fontSize(12)
         .font('Helvetica')
         .text('Report Date:', 70, petInfoBoxY + 50);
         
      doc.fontSize(12)
         .text(new Date().toLocaleDateString(), 170, petInfoBoxY + 50);
      
      // Add Report ID
      doc.fontSize(12)
         .text('Report ID:', 70, petInfoBoxY + 75);
         
      doc.fontSize(12)
         .text(`ID-${timestamp.toString().substring(7)}`, 170, petInfoBoxY + 75);
      
      // Add photo
      if (selectedImage) {
        const imgBuffer = Buffer.from(selectedImage, 'base64');
        // Create photo area with border
        const photoX = doc.page.width - 170;
        const photoY = petInfoBoxY + 10;
        const photoWidth = 90;
        const photoHeight = 90;
        
        // Draw photo border
        doc.strokeColor('#dddddd')
           .lineWidth(1)
           .rect(photoX, photoY, photoWidth, photoHeight)
           .stroke();
           
        // Insert the image
        doc.image(imgBuffer, photoX, photoY, {
          fit: [photoWidth, photoHeight],
          align: 'center',
          valign: 'center'
        });
      }
      
      // Move to analysis section
      const analysisY = petInfoBoxY + petInfoBoxHeight + 20;
      
      // Top breed predictions
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#333333')
         .text('BREED COMPOSITION', 50, analysisY);
         
      // Add underline
      doc.strokeColor('#333333')
         .lineWidth(0.5)
         .moveTo(50, analysisY + 20)
         .lineTo(doc.page.width - 50, analysisY + 20)
         .stroke();
         
      // Draw breed table
      const breedTableY = analysisY + 30;
      const rowHeight = 25;
      
      // Table headers
      doc.fillColor('#f0f0f0')
         .rect(50, breedTableY, doc.page.width - 100, rowHeight)
         .fill();
         
      doc.fillColor('#333333')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Breed', 70, breedTableY + 7)
         .text('Probability', doc.page.width - 150, breedTableY + 7);
         
      // Table rows
      topBreeds.forEach((breed, index) => {
        const y = breedTableY + (index + 1) * rowHeight;
        const formattedName = formatBreedName(breed.name);
        
        // Alternating row background
        if (index % 2 === 0) {
          doc.fillColor('#f9f9f9')
             .rect(50, y, doc.page.width - 100, rowHeight)
             .fill();
        }
        
        doc.fillColor('#333333')
           .fontSize(12)
           .font('Helvetica')
           .text(formattedName, 70, y + 7)
           .text(`${breed.probability}%`, doc.page.width - 150, y + 7);
      });
      
      // Table border
      doc.strokeColor('#cccccc')
         .lineWidth(0.5)
         .rect(50, breedTableY, doc.page.width - 100, rowHeight * (topBreeds.length + 1))
         .stroke();
         
      // Move to attributes section
      const attributesY = breedTableY + (rowHeight * (topBreeds.length + 1)) + 25;
      
      // Dog attributes section heading
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#333333')
         .text('ESTIMATED ATTRIBUTES', 50, attributesY);
         
      // Add underline
      doc.strokeColor('#333333')
         .lineWidth(0.5)
         .moveTo(50, attributesY + 20)
         .lineTo(doc.page.width - 50, attributesY + 20)
         .stroke();
      
      // Create two columns for attributes
      const colWidth = (doc.page.width - 120) / 2;
      const leftColX = 60;
      const rightColX = leftColX + colWidth + 20;
      const attrRowHeight = 30;
      const attrTextY = attributesY + 35;
      
      // Draw attribute value bars
      const drawAttributeBar = (x: number, y: number, value: number, label: string) => {
        const barWidth = 150;
        const barHeight = 10;
        const filledWidth = (value / 10) * barWidth;
        
        // Label
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text(`${label}:`, x, y);
           
        // Value
        doc.fontSize(11)
           .font('Helvetica')
           .text(`${value.toFixed(1)}/10`, x + 120, y);
        
        // Empty bar
        doc.strokeColor('#dddddd')
           .lineWidth(1)
           .rect(x, y + 15, barWidth, barHeight)
           .stroke();
           
        // Filled bar
        let barColor;
        if (label === 'Aggression' || label === 'Energy Level') {
          // Use gradient colors based on value
          if (value > 7) barColor = '#ff6b6b';
          else if (value > 4) barColor = '#ffd166';
          else barColor = '#06d6a0';
        } else if (label === 'Trainability' || label === 'Lifespan') {
          if (value > 7) barColor = '#06d6a0';
          else if (value > 4) barColor = '#ffd166';
          else barColor = '#ff6b6b';
        } else {
          barColor = '#4361ee';
        }
        
        doc.fillColor(barColor)
           .rect(x, y + 15, filledWidth, barHeight)
           .fill();
      };
      
      // Left column attributes
      drawAttributeBar(leftColX, attrTextY, attributes.size, 'Size');
      drawAttributeBar(leftColX, attrTextY + attrRowHeight, attributes.weight, 'Weight');
      drawAttributeBar(leftColX, attrTextY + (attrRowHeight * 2), attributes.aggression, 'Aggression');
      
      // Right column attributes
      drawAttributeBar(rightColX, attrTextY, attributes.trainability, 'Trainability');
      drawAttributeBar(rightColX, attrTextY + attrRowHeight, attributes.energy_level, 'Energy Level');
      drawAttributeBar(rightColX, attrTextY + (attrRowHeight * 2), attributes.lifespan, 'Lifespan');
      
      // Move to care recommendations section
      const careY = attrTextY + (attrRowHeight * 3) + 25;
      
      // Care recommendations section heading
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#333333')
         .text('CARE RECOMMENDATIONS', 50, careY);
         
      // Add underline
      doc.strokeColor('#333333')
         .lineWidth(0.5)
         .moveTo(50, careY + 20)
         .lineTo(doc.page.width - 50, careY + 20)
         .stroke();
      
      // Create a container for recommendations
      const recBoxY = careY + 30;
      const recBoxHeight = 220;
      
      doc.fillColor('#f9f9f9')
         .roundedRect(50, recBoxY, doc.page.width - 100, recBoxHeight, 5)
         .fill();
         
      doc.strokeColor('#cccccc')
         .lineWidth(0.5)
         .roundedRect(50, recBoxY, doc.page.width - 100, recBoxHeight, 5)
         .stroke();
      
      // Exercise needs
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#333333')
         .text('Exercise Needs:', 70, recBoxY + 15);
         
      if (attributes.energy_level > 7) {
        doc.fontSize(11)
           .font('Helvetica')
           .text("Your dog has a high energy level. Plan for at least 60 minutes of active exercise daily, including walks, runs, and playtime.", 
                 70, recBoxY + 35, { width: doc.page.width - 140 });
      } else if (attributes.energy_level > 4) {
        doc.fontSize(11)
           .font('Helvetica')
           .text("Your dog has a moderate energy level. Plan for about 30-45 minutes of daily exercise to keep them healthy and happy.", 
                 70, recBoxY + 35, { width: doc.page.width - 140 });
      } else {
        doc.fontSize(11)
           .font('Helvetica')
           .text("Your dog has a lower energy level. Short walks and gentle play sessions are sufficient for their exercise needs.", 
                 70, recBoxY + 35, { width: doc.page.width - 140 });
      }
      
      // Training approach
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('Training Approach:', 70, recBoxY + 70);
         
      if (attributes.trainability > 7) {
        doc.fontSize(11)
           .font('Helvetica')
           .text("With high trainability, your dog will respond well to positive reinforcement methods. They can excel in advanced training activities.", 
                 70, recBoxY + 90, { width: doc.page.width - 140 });
      } else if (attributes.trainability > 4) {
        doc.fontSize(11)
           .font('Helvetica')
           .text("Your dog has moderate trainability. Be consistent with training sessions and use positive reinforcement for best results.", 
                 70, recBoxY + 90, { width: doc.page.width - 140 });
      } else {
        doc.fontSize(11)
           .font('Helvetica')
           .text("Your dog may be more independent-minded. Keep training sessions short and engaging, and be very patient and consistent.", 
                 70, recBoxY + 90, { width: doc.page.width - 140 });
      }
      
      // Diet & nutrition
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('Diet & Nutrition:', 70, recBoxY + 125);
         
      if (attributes.size > 7) {
        doc.fontSize(11)
           .font('Helvetica')
           .text("Large dogs require specially formulated food with balanced nutrition to support healthy joints and prevent common large-breed issues.", 
                 70, recBoxY + 145, { width: doc.page.width - 140 });
      } else if (attributes.size > 4) {
        doc.fontSize(11)
           .font('Helvetica')
           .text("Medium-sized dogs need balanced nutrition with appropriate portion control to maintain a healthy weight.", 
                 70, recBoxY + 145, { width: doc.page.width - 140 });
      } else {
        doc.fontSize(11)
           .font('Helvetica')
           .text("Small dogs have high metabolisms but need carefully portioned meals to prevent obesity, which is common in smaller breeds.", 
                 70, recBoxY + 145, { width: doc.page.width - 140 });
      }
      
      // Health considerations
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('Health Considerations:', 70, recBoxY + 180);
         
      doc.fontSize(11)
         .font('Helvetica')
         .text("Regular veterinary check-ups are essential. With the breeds identified, watch for breed-specific health issues and maintain preventative care.", 
               70, recBoxY + 200, { width: doc.page.width - 140 });
      
      // Footer with DNA analysis order information
      const footerY = doc.page.height - 70;
      const footerHeight = 50;
      
      doc.fillColor('#4F46E5')
         .rect(30, footerY, doc.page.width - 60, footerHeight)
         .fill();
      
      doc.fillColor('white')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('DNA ANALYSIS ORDER INFORMATION', 
               doc.page.width / 2, footerY + 10, 
               { align: 'center' });
               
      doc.fillColor('white')
         .fontSize(10)
         .font('Helvetica')
         .text('Order comprehensive genetic testing to verify breed composition and health markers.', 
               doc.page.width / 2, footerY + 27, 
               { align: 'center' });
      
      // Small copyright footer
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#666666')
         .text(`Report #${timestamp.toString().substring(5)} | Generated on ${new Date().toLocaleDateString()}`, 
               doc.page.width / 2, 
               doc.page.height - 15, 
               { align: 'center' });
      
      // Finalize the PDF
      doc.end();
      
      // When the stream is finished, resolve with the URL
      pdfStream.on("finish", () => {
        // In a real app, this would be a properly hosted URL
        // For this demo, we'll just return the relative path
        const pdfUrl = `/reports/${filename}`;
        resolve(pdfUrl);
      });
      
      pdfStream.on("error", (err) => {
        reject(err);
      });
      
    } catch (error) {
      reject(error);
    }
  });
}
