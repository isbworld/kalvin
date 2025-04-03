import { apiRequest } from "@/lib/queryClient";
import type { BreedPrediction, DogAttributes } from "@shared/types";

export const predictBreed = async (formData: FormData): Promise<{
  topBreeds: BreedPrediction[];
  attributes: DogAttributes;
  selectedImage: string;
}> => {
  const response = await apiRequest("POST", "/api/predict-breed", undefined, formData);
  return response.json();
};

export const generateReport = async (data: {
  petName: string;
  selectedImage: string;
  topBreeds: BreedPrediction[];
  attributes: DogAttributes;
}): Promise<{ pdfUrl: string }> => {
  const response = await apiRequest("POST", "/api/generate-report", data);
  return response.json();
};
