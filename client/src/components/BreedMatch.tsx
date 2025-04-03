import { formatBreedName } from "@/lib/utils";

interface BreedMatchProps {
  name: string;
  probability: number;
  maxConfidence: number;
  totalExpWeight: number; // Sum of exponential weights for the top predictions.
}

const BreedMatch = ({ name, probability, maxConfidence, totalExpWeight }: BreedMatchProps) => {
  // Tuning parameter for exponential decay (adjust to control bias)
  const alpha = 0.2;

  // Calculate the exponential weight for this breed
  const weightForBreed = Math.exp(-alpha * (maxConfidence - probability));

  // Normalize the weight so that the sum of weights equals 1 (then scale to 100)
  const normalizedWeightedProbability = totalExpWeight > 0 
    ? Math.round((weightForBreed / totalExpWeight) * 100)
    : probability; // fallback if totalExpWeight is zero

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-900">
          {formatBreedName(name)}
        </span>
        <div className="text-right">
          <span className="text-sm font-medium text-primary-700">{probability}%</span>
          <span className="text-xs text-gray-500 ml-2">
            (weighted: {normalizedWeightedProbability}%)
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${normalizedWeightedProbability}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BreedMatch;