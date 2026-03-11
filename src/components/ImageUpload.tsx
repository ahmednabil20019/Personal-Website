import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { X, Upload } from 'lucide-react';

interface ImageUploadProps {
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
}

export const ImageUpload = ({ onFilesChange, multiple = false, maxFiles, accept }: ImageUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
      setFiles(newFiles);
      onFilesChange(newFiles);
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      const allPreviews = multiple ? [...previews, ...newPreviews] : newPreviews;
      setPreviews(allPreviews);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange(newFiles);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const newFiles = multiple ? [...files, ...droppedFiles] : droppedFiles;
      setFiles(newFiles);
      onFilesChange(newFiles);
      const newPreviews = droppedFiles.map(file => URL.createObjectURL(file));
      const allPreviews = multiple ? [...previews, ...newPreviews] : newPreviews;
      setPreviews(allPreviews);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`mb-4 border-2 border-dashed rounded-lg transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-blue bg-secondary/50'}`}
    >
      <label className="w-full flex flex-col items-center px-4 py-6 cursor-pointer">
        <Upload className="w-8 h-8" />
        <span className="mt-2 text-base leading-normal">Drag & drop or click to select files</span>
        <input
          type='file'
          className="hidden"
          onChange={handleFileChange}
          multiple={multiple}
          accept="image/*,video/*"
          ref={inputRef}
        />
      </label>
      <div className="grid grid-cols-3 gap-4 p-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative w-full h-24">
            <img src={preview} alt="preview" className="w-full h-full object-cover rounded-lg" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => removeFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}; 