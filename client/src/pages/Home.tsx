import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadState from "@/components/UploadState";
import LoadingState from "@/components/LoadingState";
import ResultsState from "@/components/ResultsState";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BreedPrediction, DogAttributes, PredictionResults } from "@shared/types";

export default function Home() {
  const [currentState, setCurrentState] = useState<"upload" | "loading" | "results">("upload");
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [petName, setPetName] = useState<string>("");
  const [usePreprocessing, setUsePreprocessing] = useState<boolean>(false);
  const [predictionResults, setPredictionResults] = useState<PredictionResults | null>(null);
  const { toast } = useToast();

  const predictMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest<{ topBreeds: BreedPrediction[], attributes: DogAttributes, selectedImage: string }>("/api/predict-breed", {
        method: "POST",
        body: data
      });
    },
    onSuccess: (data: { topBreeds: BreedPrediction[], attributes: DogAttributes, selectedImage: string }) => {
      setPredictionResults({
        topBreeds: data.topBreeds,
        attributes: data.attributes,
        selectedImage: data.selectedImage
      });
      setCurrentState("results");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to analyze the image: ${error.message}`,
        variant: "destructive",
      });
      setCurrentState("upload");
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (data: {
      petName: string;
      selectedImage: string;
      topBreeds: BreedPrediction[];
      attributes: DogAttributes;
    }) => {
      return apiRequest<{ pdfUrl: string }>("/api/generate-report", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data: { pdfUrl: string }) => {
      window.open(data.pdfUrl, "_blank");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleIdentifyBreed = () => {
    if (uploadedPhotos.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one photo",
        variant: "destructive",
      });
      return;
    }

    setCurrentState("loading");

    const formData = new FormData();
    uploadedPhotos.forEach((photo, index) => {
      formData.append("images", photo);
    });
    formData.append("petName", petName);
    formData.append("usePreprocessing", usePreprocessing.toString());

    predictMutation.mutate(formData);
  };

  const handleGenerateReport = () => {
    if (!predictionResults) return;

    reportMutation.mutate({
      petName,
      selectedImage: predictionResults.selectedImage,
      topBreeds: predictionResults.topBreeds,
      attributes: predictionResults.attributes
    });
  };

  const handleOrderDNATest = () => {
    // The DNA Test modal will be handled in the ResultsState component
    // This function is passed to maintain the interface but actual functionality 
    // is now implemented there
  };

  const handleStartOver = () => {
    setUploadedPhotos([]);
    setPetName("");
    setUsePreprocessing(false);
    setPredictionResults(null);
    setCurrentState("upload");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Intro Section */}
          <section className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-heading sm:text-3xl">Dog Breed Identification Tool</h2>
            <p className="text-gray-600 mb-4">Upload a photo of your dog to identify its breed and learn about its characteristics.</p>
            <div className="flex justify-center flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Powered by AI
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                100+ Breeds
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Instant Results
              </span>
            </div>
          </section>
          
          {/* Process Steps Section */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">1</div>
                  <h4 className="font-medium text-gray-900">Upload a Photo</h4>
                </div>
                <p className="text-gray-600 text-sm">Take a clear photo of your dog or upload an existing one. For best results, ensure the dog is the main subject.</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">2</div>
                  <h4 className="font-medium text-gray-900">AI Analysis</h4>
                </div>
                <p className="text-gray-600 text-sm">Our advanced AI analyzes the photo to identify the most likely breeds and calculates physical and behavioral attributes.</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">3</div>
                  <h4 className="font-medium text-gray-900">Get Results</h4>
                </div>
                <p className="text-gray-600 text-sm">Receive breed matches with confidence scores, attribute ratings, and tailored care recommendations for your dog.</p>
              </div>
            </div>
          </section>

          {currentState === "upload" && (
            <UploadState
              uploadedPhotos={uploadedPhotos}
              setUploadedPhotos={setUploadedPhotos}
              petName={petName}
              setPetName={setPetName}
              usePreprocessing={usePreprocessing}
              setUsePreprocessing={setUsePreprocessing}
              onIdentifyBreed={handleIdentifyBreed}
            />
          )}

          {currentState === "loading" && (
            <LoadingState />
          )}

          {currentState === "results" && predictionResults && (
            <ResultsState
              petName={petName}
              topBreeds={predictionResults.topBreeds}
              attributes={predictionResults.attributes}
              selectedImage={predictionResults.selectedImage}
              onStartOver={handleStartOver}
              onGenerateReport={handleGenerateReport}
              onOrderDNATest={handleOrderDNATest}
              isGeneratingReport={reportMutation.isPending}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
