import { useRef, useState, DragEvent } from "react";
import { Upload, X } from "lucide-react";

interface FileUploaderProps {
  uploadedPhotos: File[];
  setUploadedPhotos: (photos: File[]) => void;
}

const FileUploader = ({ uploadedPhotos, setUploadedPhotos }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(
      file => file.type.startsWith("image/")
    );
    setUploadedPhotos([...uploadedPhotos, ...validFiles]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...uploadedPhotos];
    newPhotos.splice(index, 1);
    setUploadedPhotos(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? "border-primary-300 bg-primary-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4 flex flex-col sm:flex-row justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative cursor-pointer bg-primary-600 rounded-md font-medium text-white hover:bg-primary-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 px-4 py-2"
          >
            <span>Upload photos</span>
            <input
              id="file-upload"
              ref={fileInputRef}
              name="file-upload"
              type="file"
              className="sr-only"
              multiple
              accept="image/*"
              onChange={handleChange}
            />
          </button>
          <p className="text-sm text-gray-600 mt-2 sm:mt-0 sm:ml-3 sm:self-center">or drag and drop</p>
        </div>
        <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>

      {uploadedPhotos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Uploaded Photos</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className="relative h-24 bg-gray-100 rounded overflow-hidden">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Uploaded dog photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
