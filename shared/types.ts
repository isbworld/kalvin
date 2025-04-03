// Types for API responses and requests

export interface BreedPrediction {
  name: string;
  probability: number;
}

export interface DogAttributes {
  size: number;
  weight: number;
  aggression: number;
  trainability: number;
  energy_level: number;
  lifespan: number;
}

export interface PredictionResults {
  topBreeds: BreedPrediction[];
  attributes: DogAttributes;
  selectedImage: string;
}

export interface GenerateReportRequest {
  petName: string;
  selectedImage: string;
  topBreeds: BreedPrediction[];
  attributes: DogAttributes;
}

export interface GenerateReportResponse {
  pdfUrl: string;
}
