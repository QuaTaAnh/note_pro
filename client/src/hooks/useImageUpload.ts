import {
  CloudinaryUploadResponse,
  uploadImageToCloudinary,
} from "@/lib/cloudinary/cloudinary";
import { useState } from "react";
import { toast } from "sonner";
import { useLoading } from "@/context/LoadingContext";

interface UseImageUploadOptions {
  tags?: string[];
  onSuccess?: (imageUrl: string, response: CloudinaryUploadResponse) => void;
  onError?: (error: Error) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function useImageUpload({
  tags,
  onSuccess,
  onError,
  maxSizeMB = 5,
  allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
}: UseImageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { startLoading, stopLoading } = useLoading();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!allowedTypes.includes(file.type)) {
      const error = new Error(
        `Invalid file type. Only ${allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")} are allowed.`,
      );
      toast.error(error.message);
      onError?.(error);
      return null;
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      const error = new Error(`File size exceeds ${maxSizeMB}MB limit.`);
      toast.error(error.message);
      onError?.(error);
      return null;
    }

    setIsUploading(true);
    startLoading();

    try {
      const uploadResult = await uploadImageToCloudinary(file, {
        folder: "note_pro/images",
        tags,
      });
      setUploadedUrl(uploadResult.secure_url);
      toast.success("Image uploaded successfully");
      onSuccess?.(uploadResult.secure_url, uploadResult);

      return uploadResult.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload image. Please try again.";
      toast.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error("Upload failed"));
      return null;
    } finally {
      setIsUploading(false);
      stopLoading();
    }
  };

  const reset = () => {
    setUploadedUrl(null);
  };

  return {
    uploadImage,
    reset,
    isUploading,
    uploadedUrl,
  };
}
