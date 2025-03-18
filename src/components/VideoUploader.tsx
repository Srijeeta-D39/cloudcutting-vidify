
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { uploadVideo } from '@/lib/aws';
import { Upload, X, Check, AlertCircle, FileVideo } from 'lucide-react';

interface VideoUploaderProps {
  onUploadComplete?: (videoUrl: string, fileName: string) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const VideoUploader = ({
  onUploadComplete,
  maxSizeMB = 1000, // 1GB default max
  acceptedFormats = ['video/mp4', 'video/webm', 'video/quicktime']
}: VideoUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    // Reset states
    setError(null);
    
    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError(`File type not supported. Please upload: ${acceptedFormats.join(', ')}`);
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB`);
      return;
    }
    
    // Create preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setSelectedFile(file);
    
  }, [acceptedFormats, maxSizeMB]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadResult = await uploadVideo(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      
      // Simulate successful upload for demo purposes
      setUploadProgress(100);
      
      toast({
        title: "Upload Complete",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
      
      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(uploadResult.videoUrl, selectedFile.name);
      }
      
      // Reset the component after successful upload (optional)
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsUploading(false);
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setError('Failed to upload video. Please try again.');
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedFile, onUploadComplete, toast]);

  const resetUploader = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* File Input Area */}
      {!selectedFile && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-accent/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Upload video"
          />
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-accent text-primary">
                <Upload className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload your video</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your video file here, or click to select
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Supported formats: {acceptedFormats.map(format => format.split('/')[1]).join(', ')}</p>
              <p>Maximum size: {maxSizeMB}MB</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected File Preview */}
      {selectedFile && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-md bg-accent">
                  <FileVideo className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isUploading && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetUploader} 
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Video Preview */}
          {previewUrl && (
            <div className="relative aspect-video w-full bg-black">
              <video 
                src={previewUrl} 
                className="absolute inset-0 w-full h-full object-contain"
                controls
              />
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border-t border-destructive/20 text-destructive">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isUploading && !error && (
            <div className="p-4 bg-muted/30 flex justify-end">
              <Button 
                onClick={handleUpload} 
                className="flex items-center"
                disabled={isUploading}
              >
                {uploadProgress === 100 ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Complete
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default VideoUploader;
