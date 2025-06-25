"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageData } from '@/utils/getGeminiAnalysis';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/utils';

interface ImageUploaderProps {
  onImageAnalyzed: (description: string) => void;
  onAnalysisStarted: () => void;
}

export default function ImageUploader({ onImageAnalyzed, onAnalysisStarted }: ImageUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleImageUpload = useCallback(async (imageData: ImageData) => {
    setIsAnalyzing(true);
    onAnalysisStarted();
    
    try {
      // Make a server-side request to analyze the image
      const response = await fetch('/api/analyze-outfit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      const data = await response.json();
      onImageAnalyzed(data.description);
    } catch (error) {
      console.error('Error analyzing image:', error);
      onImageAnalyzed("I couldn't analyze your outfit properly. Please try again with a clearer image.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [onImageAnalyzed, onAnalysisStarted]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;
    
    // Create a preview of the image
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    
    // Convert the image to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) return;
      
      const base64Data = event.target.result.toString().split(',')[1];
      const mimeType = file.type;
      
      await handleImageUpload({
        data: base64Data,
        mimeType
      });
    };
    
    reader.readAsDataURL(file);
  }, [handleImageUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });
  
  const clearImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
  };
  
  return (
    <div className="w-full max-w-md mx-auto mb-4">
      {!previewImage ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            "hover:border-primary hover:bg-primary/5",
            isDragActive ? "border-primary bg-primary/10" : "border-border"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground/80" />
            <p className="font-medium">
              {isDragActive
                ? "Drop your outfit image here"
                : "Drag & drop your outfit image here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse files
            </p>
            
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  // This would open the camera on mobile devices
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.capture = 'environment';
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files.length > 0) {
                      onDrop([files[0]]);
                    }
                  };
                  input.click();
                }}
              >
                <Camera className="h-4 w-4" />
                <span>Take Photo</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={previewImage}
            alt="Outfit preview"
            className="w-full object-cover"
            style={{ maxHeight: '300px' }}
          />
          
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="rounded-full w-8 h-8 p-0"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm font-medium">Analyzing your outfit...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
