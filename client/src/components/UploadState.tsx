import FileUploader from "@/components/FileUploader";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UploadStateProps {
  uploadedPhotos: File[];
  setUploadedPhotos: (photos: File[]) => void;
  petName: string;
  setPetName: (name: string) => void;
  usePreprocessing: boolean;
  setUsePreprocessing: (value: boolean) => void;
  onIdentifyBreed: () => void;
}

const UploadState = ({
  uploadedPhotos,
  setUploadedPhotos,
  petName,
  setPetName,
  usePreprocessing,
  setUsePreprocessing,
  onIdentifyBreed
}: UploadStateProps) => {
  return (
    <div className="mb-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 font-heading">Upload Dog Photos</h3>
          <div className="space-y-4">
            <FileUploader
              uploadedPhotos={uploadedPhotos}
              setUploadedPhotos={setUploadedPhotos}
            />

            <div className="flex flex-col space-y-3">
              <div>
                <Label htmlFor="pet-name">Pet Name (optional)</Label>
                <Input
                  type="text"
                  id="pet-name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g., Buddy"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-preprocessing"
                  checked={usePreprocessing}
                  onCheckedChange={(checked) => 
                    setUsePreprocessing(checked === true)
                  }
                />
                <Label
                  htmlFor="use-preprocessing"
                  className="text-sm text-gray-700"
                >
                  Enable lightweight image preprocessing (may improve accuracy)
                </Label>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={onIdentifyBreed}
                className="w-full sm:w-auto px-6 py-3"
              >
                Identify Breed
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadState;
