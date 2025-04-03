import { useState } from 'react';
import { BreedPrediction, DogAttributes } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import BreedMatch from './BreedMatch';
import AttributeRadarChart from './AttributeRadarChart';
import DNATestModal from './DNATestModal';
import EmailCollection from './EmailCollection';

interface ResultsStateProps {
  petName: string;
  selectedImage: string;
  topBreeds: BreedPrediction[];
  attributes: DogAttributes;
  predictionId?: number;
  onStartOver?: () => void;
  onGenerateReport?: () => void;
  onOrderDNATest?: () => void;
  isGeneratingReport?: boolean;
}

const ResultsState = ({ 
  petName, 
  selectedImage, 
  topBreeds, 
  attributes, 
  predictionId,
  onStartOver,
  onGenerateReport: parentGenerateReport,
  onOrderDNATest,
  isGeneratingReport: parentIsGenerating
}: ResultsStateProps) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showDNATestModal, setShowDNATestModal] = useState(false);
  const [hasProvidedEmail, setHasProvidedEmail] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setHasProvidedEmail(true);
    toast({
      title: "Thank you!",
      description: "Your full breed analysis is now available.",
    });
  };

  const handleGenerateReport = async () => {
    // If parent provided a generate report function, use that
    if (parentGenerateReport) {
      parentGenerateReport();
      return;
    }
    
    // Otherwise use our local implementation
    setIsGeneratingReport(true);
    try {
      const response = await apiRequest<{ pdfUrl: string }>('/api/generate-report', {
        method: 'POST',
        body: JSON.stringify({
          petName,
          selectedImage,
          topBreeds,
          attributes,
        }),
      });
      
      setPdfUrl(response.pdfUrl);
      toast({
        title: "Report generated!",
        description: "Your PDF report is ready for download.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Report generation failed",
        description: "There was an error generating your PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Display only limited results if email not provided
  if (!hasProvidedEmail) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview panel with limited results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Breed Composition Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Show only top breed */}
                  {topBreeds.length > 0 && (
                    <BreedMatch 
                      name={topBreeds[0].name} 
                      probability={topBreeds[0].probability} 
                    />
                  )}
                  <p className="text-sm text-gray-500 mt-4">
                    Enter your email to see the full breed composition including all matching breeds.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Email collection form */}
          <div>
            <EmailCollection onSubmit={handleEmailSubmit} />
          </div>
        </div>
      </div>
    );
  }

  // Full results after email is provided
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Results section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Breed Composition Analysis for {petName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="breeds" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="breeds" className="flex-1">Breed Matches</TabsTrigger>
                  <TabsTrigger value="attributes" className="flex-1">Attributes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="breeds" className="space-y-4 mt-4">
                  {topBreeds.map((breed, index) => (
                    <BreedMatch 
                      key={index} 
                      name={breed.name} 
                      probability={breed.probability} 
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="attributes">
                  <div className="h-[350px] w-full flex justify-center">
                    <AttributeRadarChart attributes={attributes} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Action buttons and image preview */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <img 
                  src={`data:image/jpeg;base64,${selectedImage}`} 
                  alt="Analyzed dog" 
                  className="h-48 w-auto object-cover rounded-lg shadow-md" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={handleGenerateReport}
                  disabled={parentIsGenerating || isGeneratingReport}
                  className="w-full flex items-center justify-center"
                >
                  {(parentIsGenerating || isGeneratingReport) ? 'Generating...' : 'Generate PDF Report'}
                </Button>
                
                <Button 
                  onClick={() => setShowDNATestModal(true)}
                  variant="outline"
                  className="w-full"
                >
                  Order DNA Test Kit
                </Button>
              </div>
              
              {pdfUrl && (
                <div className="mt-6 flex justify-center">
                  <a 
                    href={pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline hover:text-indigo-800"
                  >
                    View/Download PDF Report
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Care Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Exercise Needs:</h3>
                <p className="text-gray-600 text-sm">
                  {attributes.energy_level > 7
                    ? "High energy level. Plan for at least 60 minutes of active exercise daily."
                    : attributes.energy_level > 4
                    ? "Moderate energy level. Aim for 30-45 minutes of daily exercise."
                    : "Lower energy level. Short walks and gentle play sessions are sufficient."}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Training Approach:</h3>
                <p className="text-gray-600 text-sm">
                  {attributes.trainability > 7
                    ? "High trainability. Will respond well to positive reinforcement methods."
                    : attributes.trainability > 4
                    ? "Moderate trainability. Be consistent with training and use positive reinforcement."
                    : "May be independent-minded. Keep training sessions short and engaging."}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Health Considerations:</h3>
                <p className="text-gray-600 text-sm">
                  Regular veterinary check-ups are essential. Watch for breed-specific health issues and maintain preventative care.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <DNATestModal 
        isOpen={showDNATestModal} 
        onClose={() => setShowDNATestModal(false)}
        predictionId={predictionId}
      />
    </div>
  );
};

export default ResultsState;