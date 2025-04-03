import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DNATestModal from "@/components/DNATestModal";
import { Button } from "@/components/ui/button";
import { TestTube, Check, ArrowRight } from "lucide-react";

export default function DNATests() {
  const [showDNATestModal, setShowDNATestModal] = useState(false);
  const [kitType, setKitType] = useState<"standard" | "premium">("standard");
  
  const handleOpenModal = (type: "standard" | "premium") => {
    setKitType(type);
    setShowDNATestModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center font-heading">DNA Test Kits</h1>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">The Ultimate Guide to Your Dog's Genetics</h2>
              <p className="text-gray-600 mb-6">
                While our AI-powered image analysis provides valuable insights into your dog's breed 
                composition, a DNA test offers the gold standard in canine genetic identification.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 text-lg">Why Opt for DNA Testing?</h3>
                  <p className="text-gray-600 mb-3">
                    DNA testing provides the most accurate breed identification possible by analyzing 
                    your dog's genetic makeup. This offers several advantages over visual identification:
                  </p>
                  <ul className="text-gray-600 space-y-2 mb-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Precise breed percentages with accuracy up to 98%</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Detection of breeds that may not be visually apparent</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Identification of rare breed combinations</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Health screening for 170+ genetic conditions and traits</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-5 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-3 text-lg">Our Premium DNA Test Includes:</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <TestTube className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Breed identification across 350+ breeds, types and varieties</span>
                    </li>
                    <li className="flex items-start">
                      <TestTube className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Family tree tracing ancestry back to great-grandparents</span>
                    </li>
                    <li className="flex items-start">
                      <TestTube className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Health screening for over 170 genetic conditions</span>
                    </li>
                    <li className="flex items-start">
                      <TestTube className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Trait analysis explaining physical features and behaviors</span>
                    </li>
                    <li className="flex items-start">
                      <TestTube className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Comprehensive personalized report with actionable insights</span>
                    </li>
                    <li className="flex items-start">
                      <TestTube className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Optional vet consultation to discuss health implications</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How it Works</h2>
              <div className="mb-8">
                <ol className="space-y-6">
                  <li className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-bold mr-3">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Order Your Kit</h3>
                      <p className="text-gray-600">
                        Place your order through our website or after receiving your AI breed identification results.
                        We'll ship your DNA test kit directly to your address.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-bold mr-3">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Collect the Sample</h3>
                      <p className="text-gray-600">
                        Follow the simple instructions to collect a cheek swab sample from your dog.
                        The process is quick, painless, and can be done in just a minute.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-bold mr-3">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Mail it Back</h3>
                      <p className="text-gray-600">
                        Use the pre-paid return shipping label to send the sample back to our laboratory.
                        Your sample will be processed with state-of-the-art genetic testing technology.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-bold mr-3">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Get Your Results</h3>
                      <p className="text-gray-600">
                        Within 2-3 weeks, you'll receive your comprehensive results by email with a detailed
                        breakdown of your dog's genetic makeup, health insights, and trait analysis.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Our DNA Test Kits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h3 className="font-medium text-gray-900 mb-1 text-lg">Standard Kit</h3>
                    <p className="text-gray-600 mb-4">Includes breed identification, family tree, and trait analysis</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleOpenModal("standard")}
                    >
                      Request More Info <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="border-2 border-primary-600 rounded-lg p-5 relative">
                    <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                      POPULAR
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 text-lg">Premium Kit</h3>
                    <p className="text-gray-600 mb-4">Everything in Standard plus health screening for 170+ conditions</p>
                    <Button 
                      className="w-full"
                      onClick={() => handleOpenModal("premium")}
                    >
                      Request More Info <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-white mb-3">Try Our AI Breed Identification First</h2>
              <p className="text-indigo-100 mb-4">
                Not ready for DNA testing yet? Our free AI-powered breed identification can give you a starting point
                in understanding your dog's heritage.
              </p>
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Identify Breed Now
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <DNATestModal 
        isOpen={showDNATestModal} 
        onClose={() => setShowDNATestModal(false)}
      />
    </div>
  );
}