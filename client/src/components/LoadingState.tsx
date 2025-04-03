import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const LoadingState = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6 text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 font-heading">Analyzing your dog...</h3>
          <p className="text-gray-600">Our AI is examining the photo to identify the breed and characteristics.</p>
          <div className="mt-4 w-full">
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
