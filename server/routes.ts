import express, { type Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { predictDogBreed, calculateAttributes } from "./breedService";
import { generatePdfReport } from "./pdfGenerator";
import { storage } from "./storage";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Swagger documentation setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dog Breed Identification API",
      version: "1.0.0",
      description: "API for identifying dog breeds from images",
    },
    servers: [
      {
        url: "/",
      },
    ],
  },
  apis: ["./server/routes.ts"], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve the reports directory for PDF downloads
  const reportsDir = path.join(__dirname, "..", "reports");
  app.use("/reports", express.static(reportsDir));
  /**
   * @swagger
   * /api/predict-breed:
   *   post:
   *     summary: Predict dog breed from uploaded images
   *     description: Analyzes dog photos to predict breeds and calculate attributes
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               images:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: binary
   *               petName:
   *                 type: string
   *               usePreprocessing:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Successful prediction
   *       400:
   *         description: Bad request, missing required parameters
   *       500:
   *         description: Server error
   */
  app.post("/api/predict-breed", upload.array("images", 5), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No image files provided" });
      }

      const usePreprocessing = req.body.usePreprocessing === "true";
      
      // Choose the best image (front-facing) or use the first one
      // In a real implementation, we would have image analysis to pick the best one
      const selectedFile = files[0];
      
      // Convert the file buffer to base64 for sending to the client
      const selectedImage = selectedFile.buffer.toString("base64");
      
      // Predict dog breed using the selected image
      const topBreeds = await predictDogBreed(selectedFile.buffer, usePreprocessing);
      
      // Calculate attributes based on the breed predictions
      const attributes = await calculateAttributes(topBreeds);
      
      return res.status(200).json({
        topBreeds,
        attributes,
        selectedImage,
      });
    } catch (error) {
      console.error("Error predicting dog breed:", error);
      return res.status(500).json({ message: "Failed to process the image" });
    }
  });

  /**
   * @swagger
   * /api/generate-report:
   *   post:
   *     summary: Generate a PDF report with dog breed information
   *     description: Creates a detailed PDF report with breed predictions and care recommendations
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               petName:
   *                 type: string
   *               selectedImage:
   *                 type: string
   *               topBreeds:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                     probability:
   *                       type: number
   *               attributes:
   *                 type: object
   *     responses:
   *       200:
   *         description: Successful report generation
   *       400:
   *         description: Bad request, missing required parameters
   *       500:
   *         description: Server error
   */
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { petName, selectedImage, topBreeds, attributes } = req.body;
      
      if (!selectedImage || !topBreeds || !attributes) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Generate the PDF report
      const pdfUrl = await generatePdfReport({
        petName,
        selectedImage,
        topBreeds,
        attributes
      });
      
      return res.status(200).json({ pdfUrl });
    } catch (error) {
      console.error("Error generating report:", error);
      return res.status(500).json({ message: "Failed to generate report" });
    }
  });

  /**
   * @swagger
   * /api/dna-tests:
   *   post:
   *     summary: Order a DNA test kit
   *     description: Submit an order for a DNA test kit with personal information
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               predictionId:
   *                 type: number
   *               kitType:
   *                 type: string
   *                 enum: [standard, premium]
   *               fullName:
   *                 type: string
   *               email:
   *                 type: string
   *               phoneNumber:
   *                 type: string
   *               address:
   *                 type: string
   *               city:
   *                 type: string
   *               state:
   *                 type: string
   *               postalCode:
   *                 type: string
   *               status:
   *                 type: string
   *               orderedAt:
   *                 type: string
   *     responses:
   *       200:
   *         description: Successful order submission
   *       400:
   *         description: Bad request, missing required parameters
   *       500:
   *         description: Server error
   */
  app.post("/api/dna-tests", async (req, res) => {
    try {
      const { 
        predictionId, 
        kitType, 
        fullName, 
        email, 
        phoneNumber,
        address,
        city,
        state, 
        postalCode, 
        status, 
        orderedAt 
      } = req.body;
      
      if (!fullName || !email || !phoneNumber || !postalCode) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Set default values for optional fields
      const kitTypeValue = kitType || "standard";
      const addressValue = address || "";
      const cityValue = city || "";
      const stateValue = state || "";
      
      // Create DNA test order in database
      const dnaTest = await storage.createDNATest({
        predictionId,
        kitType: kitTypeValue,
        fullName,
        email,
        phoneNumber,
        address: addressValue,
        city: cityValue,
        state: stateValue,
        postalCode,
        status: status || "ordered",
        orderedAt: orderedAt || new Date().toISOString(),
        results: null
      });
      
      return res.status(200).json({ 
        id: dnaTest.id,
        message: "DNA test kit order submitted successfully" 
      });
    } catch (error) {
      console.error("Error submitting DNA test order:", error);
      return res.status(500).json({ message: "Failed to submit DNA test order" });
    }
  });

  /**
   * @swagger
   * /api/dna-tests:
   *   get:
   *     summary: Get all DNA test orders
   *     description: Retrieve all DNA test orders
   *     responses:
   *       200:
   *         description: Successfully retrieved DNA test orders
   *       500:
   *         description: Server error
   */
  app.get("/api/dna-tests", async (_req, res) => {
    try {
      const dnaTests = await storage.getAllDNATests();
      return res.status(200).json(dnaTests);
    } catch (error) {
      console.error("Error retrieving DNA tests:", error);
      return res.status(500).json({ message: "Failed to retrieve DNA tests" });
    }
  });

  // Serve Swagger documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  const httpServer = createServer(app);
  return httpServer;
}
