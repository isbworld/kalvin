import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center font-heading">About Our Dog Breed Identification</h1>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                Our mission is to help dog owners understand their pets better through advanced
                AI-powered breed identification. By providing accurate breed insights and characteristics,
                we aim to enhance the bond between owners and their canine companions.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 mb-6">
                Our Dog Breed Identification Tool uses advanced AI technology to analyze photos of dogs and 
                determine their breed composition. This can be especially helpful for mixed-breed dogs or 
                when you've adopted a dog and are curious about its heritage.
              </p>
              <p className="text-gray-600 mb-6">
                Beyond just identifying breeds, our tool provides valuable insights about your dog's likely 
                attributes and behavior traits, helping you better understand your furry companion.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-3 text-lg">Why Identify Your Dog's Breed?</h3>
                  <ul className="text-gray-600 space-y-2 list-disc pl-5">
                    <li>Better understand your dog's behavior and needs</li>
                    <li>Learn about potential health issues common to specific breeds</li>
                    <li>Develop appropriate training and exercise regimens</li>
                    <li>Satisfy your curiosity about your beloved pet</li>
                    <li>Provide better healthcare with breed-specific insights</li>
                    <li>Connect with other owners of similar dog breeds</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-5 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-3 text-lg">DNA Test Option</h3>
                  <p className="text-gray-600 mb-2">
                    After receiving your AI-based breed identification results, you'll have the option to order a DNA test kit 
                    for more precise genetic analysis. The DNA test provides:
                  </p>
                  <ul className="text-gray-600 space-y-2 list-disc pl-5">
                    <li>Exact breed percentages based on genetic markers</li>
                    <li>Health screening for 170+ genetic conditions</li>
                    <li>Detailed trait analysis and predictions</li>
                    <li>Family tree going back to great-grandparents</li>
                    <li>Insights into potential inherited conditions</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Technology</h2>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 mb-3">
                  Our breed identification system is powered by a deep learning neural network that has been
                  trained on over 10,000 labeled dog images across more than 120 breeds. This allows the system
                  to recognize visual patterns and characteristics that define different breeds.
                </p>
                
                <h3 className="font-medium text-gray-900 mb-2">Optional Image Preprocessing</h3>
                <p className="text-gray-600 mb-3">
                  We offer lightweight image preprocessing which enhances identification accuracy by:
                </p>
                <ul className="text-gray-600 space-y-1 list-disc pl-5 mb-3">
                  <li>Adjusting lighting and contrast for better feature detection</li>
                  <li>Focusing on the dog's physical features and reducing background noise</li>
                  <li>Normalizing image characteristics for consistent analysis</li>
                </ul>
                <p className="text-gray-600">
                  This preprocessing is optional but can significantly improve accuracy, especially with photos
                  taken in suboptimal lighting conditions.
                </p>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Team</h2>
              <p className="text-gray-600 mb-3">
                Our team consists of animal lovers, AI specialists, and veterinarians who are passionate about
                animal welfare and leveraging technology to improve the lives of pets and their owners.
              </p>
              <p className="text-gray-600">
                We continually update our models and database to improve breed recognition accuracy and provide
                the most relevant health and behavior information.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-white mb-3">Try Our Tool Today</h2>
              <p className="text-indigo-100 mb-4">
                Upload a photo of your dog and discover their breed composition, characteristics, and care recommendations.
              </p>
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}