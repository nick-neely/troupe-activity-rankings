"use client";

import { useUploadActivities } from "@/hooks/use-activities";
import { CheckCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export function UploadForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const uploadMutation = useUploadActivities();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find((file) => file.name.endsWith(".csv"));

    if (csvFile) {
      setSelectedFile(csvFile);
      toast.success("File selected!", {
        description: `${csvFile.name} is ready to upload.`,
      });
    } else {
      toast.error("Invalid file type", {
        description: "Please select a CSV file.",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
      toast.success("File selected!", {
        description: `${file.name} is ready to upload.`,
      });
    } else if (file) {
      toast.error("Invalid file type", {
        description: "Please select a CSV file.",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (description.trim()) {
      formData.append("description", description.trim());
    }

    // Show loading toast
    const loadingToast = toast.loading("Uploading activities...", {
      description: "Processing your CSV file and saving to database.",
    });

    try {
      const result = await uploadMutation.mutateAsync(formData);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Activities uploaded successfully!", {
        description: `${result.activitiesCount} activities processed and saved to database.`,
        duration: 3000,
      });

      setSelectedFile(null);
      setDescription("");

      // Navigate to dashboard after a brief delay to show the toast
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      console.error("Upload failed:", error);
      toast.error("Upload failed", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your CSV format and try again.",
        duration: 5000,
      });
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
          isDragging
            ? "border-indigo-400 bg-indigo-50"
            : selectedFile
            ? "border-green-400 bg-green-50"
            : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          {isUploading ? (
            <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto" />
          ) : selectedFile ? (
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          ) : (
            <Upload className="w-12 h-12 text-slate-400 mx-auto" />
          )}

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {isUploading
                ? "Processing CSV..."
                : selectedFile
                ? `Selected: ${selectedFile.name}`
                : "Drop your CSV file here"}
            </h3>
            <p className="text-slate-600">
              {!selectedFile && !isUploading && "or click to browse files"}
            </p>
          </div>
        </div>

        {!selectedFile && !isUploading && (
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: 2 }}
          />
        )}
      </div>

      {selectedFile && !isUploading && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Description (optional)
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Weekend activities for Miami trip"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSelectedFile(null)}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-2xl font-medium hover:bg-slate-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload Activities"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
