import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileCode, X, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File, content: string) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = ['.js', '.jsx', '.ts', '.tsx', '.py', '.cpp', '.java', '.c', '.cs', '.rb', '.go', '.rs'],
  maxSize = 5 * 1024 * 1024, // 5MB
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const content = await file.text();
      setUploadedFile(file);
      onFileSelect(file, content);
    } catch (error) {
      console.error('Error reading file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && file.size <= maxSize) {
      processFile(file);
    }
  }, [maxSize, onFileSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= maxSize) {
      processFile(file);
    }
  }, [maxSize, onFileSelect]);

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <Card className="relative overflow-hidden glow-card">
      <motion.div
        className={cn(
          "p-8 border-2 border-dashed transition-all duration-200",
          isDragOver 
            ? "border-primary bg-accent/50" 
            : "border-muted-foreground/25 hover:border-primary/50",
          uploadedFile && "border-success bg-success/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          {uploadedFile ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-3 rounded-full bg-success/10"
              >
                <Check className="h-8 w-8 text-success" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  File Uploaded Successfully
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <FileCode className="h-4 w-4" />
                  <span>{uploadedFile.name}</span>
                  <span>•</span>
                  <span>{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  className="mt-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove File
                </Button>
              </div>
            </>
          ) : (
            <>
              <motion.div
                animate={isProcessing ? { rotate: 360 } : {}}
                transition={isProcessing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                className={cn(
                  "p-4 rounded-full transition-colors",
                  isDragOver ? "bg-primary/20" : "bg-muted"
                )}
              >
                <Upload className={cn(
                  "h-10 w-10 transition-colors",
                  isDragOver ? "text-primary" : "text-muted-foreground"
                )} />
              </motion.div>
              
              <div className="space-y-2">
                <h3 className={cn(
                  "text-xl font-semibold transition-colors",
                  isDragOver ? "text-primary" : "text-foreground"
                )}>
                  {isProcessing ? "Processing..." : "Upload Your Code"}
                </h3>
                <p className="text-muted-foreground">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: {acceptedTypes.join(', ')} • Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
                </p>
              </div>

              <Button
                variant={isDragOver ? "default" : "outline"}
                className="relative overflow-hidden"
                disabled={isProcessing}
              >
                <input
                  type="file"
                  accept={acceptedTypes.join(',')}
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
                <FileCode className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </Card>
  );
};