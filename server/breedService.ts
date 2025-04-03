import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import type { BreedPrediction, DogAttributes } from "@shared/types";
import config from "./config";

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the dog breeds attributes JSON file
const breedAttributesPath = path.join(__dirname, "..", "corrected_dog_breeds_attributes.json");

// Read the attributes data
const breedAttributesData = JSON.parse(fs.readFileSync(breedAttributesPath, "utf8"));

// Map of model breed names to our attributes data breed names
const breedNameMap: Record<string, string> = {
  "Flat-coated_retriever": "Chesapeake Bay Retriever",
  "Labrador_retriever": "Labrador Retriever",
  "Golden_retriever": "Golden Retriever",
  "Icelandic_sheepdog": "Shetland Sheepdog",
  "Belgian_sheepdog": "German Shepherd",
  "Border_collie": "Border Collie",
  "Bernese_mountain_dog": "Bernese Mountain Dog",
  "Siberian_husky": "Siberian Husky",
  "Great_pyrenees": "Great Dane", 
  "Basset_hound": "Basset Hound",
  "Beagle": "Beagle",
  "Poodle": "Poodle",
  "Boxer": "Boxer",
  "Bulldog": "Bulldog",
  "Rottweiler": "Rottweiler",
  "German_shepherd": "German Shepherd",
  "Doberman": "Doberman Pinscher",
  "Chihuahua": "Chihuahua",
  "Pug": "Pug",
  "Shih-tzu": "Shih Tzu",
  "Pomeranian": "Pomeranian",
  "French_bulldog": "French Bulldog",
  "Pembroke_welsh_corgi": "Pembroke Welsh Corgi"
};

/**
 * Helper function to find a breed in the attributes data using various matching strategies
 */
function findBreedInAttributesData(
  breedName: string, 
  matchedBreeds: string[], 
  totalWeightApplied: { value: number },
  probability: number
): any {
  // First check if we have a direct mapping for this breed name
  if (breedName.includes('_') && breedNameMap[breedName]) {
    const mappedBreedName = breedNameMap[breedName];
    const breedData = breedAttributesData.find(
      (breed: any) => breed.name === mappedBreedName
    );

    if (breedData) {
      matchedBreeds.push(`${breedName} → ${breedData.name} (direct map) (${(probability * 100).toFixed(0)}%)`);
      totalWeightApplied.value += probability;
      return breedData;
    }
  }

  // Normalize breed name for better matching
  const normalizedBreedName = breedName.replace(/_/g, ' ').toLowerCase().trim();

  // First try: exact match
  let breedData = breedAttributesData.find(
    (breed: any) => breed.name.toLowerCase() === normalizedBreedName
  );

  // Second try: match by inclusion
  if (!breedData) {
    breedData = breedAttributesData.find(
      (breed: any) => normalizedBreedName.includes(breed.name.toLowerCase())
    );
  }

  // Third try: match by any significant word
  if (!breedData) {
    const nameWords = normalizedBreedName.split(' ');
    for (const word of nameWords) {
      if (word.length > 3) {
        breedData = breedAttributesData.find(
          (breed: any) => breed.name.toLowerCase().includes(word)
        );
        if (breedData) break;
      }
    }
  }

  if (breedData) {
    matchedBreeds.push(`${breedName} → ${breedData.name} (${(probability * 100).toFixed(0)}%)`);
    totalWeightApplied.value += probability;
  } else {
    console.warn(`No match found for breed: ${breedName}`);
  }

  return breedData;
}

/**
 * Predicts dog breed from an image using Hugging Face API
 */
export async function predictDogBreed(
  imageBuffer: Buffer,
  usePreprocessing: boolean = false
): Promise<BreedPrediction[]> {
  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString("base64");

    // Check for Hugging Face API key
    if (!config.huggingface.apiKey) {
      console.warn("No Hugging Face API key found. Using mock data.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      return [
        { name: "Labrador Retriever", probability: 55 },
        { name: "Golden Retriever", probability: 30 },
        { name: "Chesapeake Bay Retriever", probability: 15 }
      ];
    }

    // Make API call
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Pavarissy/ConvNextV2-large-DogBreed",
      {
        inputs: {
          image: base64Image
        },
        options: {
          wait_for_model: true,
          use_preprocessing: usePreprocessing
        }
      },
      {
        headers: {
          Authorization: `Bearer ${config.huggingface.apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Process response data: take top 3 predictions
    const predictionsRaw = response.data.map((pred: any) => ({
      name: pred.label,
      score: pred.score
    })).slice(0, 3);
    // Check if the maximum raw score is below a threshold (e.g., 0.2)
    // Adjust the threshold based on your model's output range.
    const maxRawScore = Math.max(...predictionsRaw.map(pred => pred.score));
    if (predictionsRaw.length === 0 || maxRawScore < 0.2) {
      throw new Error("The uploaded image does not appear to contain a clear dog. Please upload a clear photo of a dog.");
    }

    // Normalize scores to sum to 100%
    const totalScore = predictionsRaw.reduce((sum: number, pred: any) => sum + pred.score, 0);
    const predictions = predictionsRaw.map((pred: any) => ({
      name: pred.name,
      probability: Math.round((pred.score / totalScore) * 100)
    }));

    console.log("Raw predictions:", predictionsRaw);
    console.log("Normalized predictions:", predictions);

    return predictions;
  } catch (error) {
    console.error("Error predicting dog breed:", error);
    throw new Error("Failed to predict dog breed");
  }
}

/**
 * Calculates weighted dog attributes based on breed predictions.
 * Uses exponential decay normalization to convert raw confidence scores into a weighted mix.
 */
export async function calculateAttributes(
  breedPredictions: BreedPrediction[]
): Promise<DogAttributes> {
  try {
    // Initialize attributes
    const attributes: DogAttributes = {
      size: 0,
      weight: 0,
      aggression: 0,
      trainability: 0,
      energy_level: 0,
      lifespan: 0,
    };

    const matchedBreeds: string[] = [];
    const totalWeightApplied = { value: 0 };

    // Tuning parameter for exponential decay
    const alpha = 0.2;

    // Find maximum probability among predictions (assumed to be on 0-100 scale)
    const maxProbability = Math.max(...breedPredictions.map(p => p.probability));

    // Calculate exponential weights for each breed prediction
    let totalExpWeight = 0;
    const expWeights: { [key: string]: number } = {};
    const breedDataMap: { [key: string]: any } = {};

    // Loop through each predicted breed and compute its exponential weight
    for (const prediction of breedPredictions) {
      const breedName = prediction.name;
      const probability = prediction.probability; // already normalized (0-100)

      const breedData = findBreedInAttributesData(breedName, matchedBreeds, totalWeightApplied, probability / 100);

      if (breedData) {
        const weightForBreed = Math.exp(-alpha * (maxProbability - probability));
        expWeights[breedName] = weightForBreed;
        totalExpWeight += weightForBreed;
        breedDataMap[breedName] = breedData;
      }
    }

    // Normalize the weights: each breed's weighted probability = (expWeight / totalExpWeight) * 100
    for (const prediction of breedPredictions) {
      const weight = expWeights[prediction.name];
      if (weight !== undefined) {
        prediction.probability = Math.round((weight / totalExpWeight) * 100);
      }
    }

    // Calculate weighted attributes using the normalized weights
    for (const breedName in expWeights) {
      const normalizedWeight = expWeights[breedName] / totalExpWeight;
      const breedData = breedDataMap[breedName];

      attributes.size += breedData.size * normalizedWeight;
      attributes.weight += breedData.weight * normalizedWeight;
      attributes.aggression += breedData.aggression * normalizedWeight;
      attributes.trainability += breedData.trainability * normalizedWeight;
      attributes.energy_level += breedData.energy_level * normalizedWeight;
      attributes.lifespan += breedData.lifespan * normalizedWeight;
    }

    // If no breed was matched, use default attribute values
    if (totalWeightApplied.value === 0) {
      attributes.size = 5;
      attributes.weight = 5;
      attributes.aggression = 5;
      attributes.trainability = 5;
      attributes.energy_level = 5;
      attributes.lifespan = 5;
      console.warn("No breeds matched in attribute data. Using default values.");
    }

    // Logging for debugging
    console.log("Matched breeds:", matchedBreeds);
    console.log("Total weight applied:", totalWeightApplied.value);
    console.log("Calculated attributes (before rounding):", attributes);

    // Round each attribute to one decimal place
    for (const key in attributes) {
      attributes[key as keyof DogAttributes] = parseFloat(attributes[key as keyof DogAttributes].toFixed(1));
    }

    return attributes;
  } catch (error) {
    console.error("Error calculating attributes:", error);
    throw new Error("Failed to calculate dog attributes");
  }
}