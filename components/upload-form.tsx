"use client";

import { useActivityStore } from "@/lib/store";
import { parseCSVData } from "@/lib/utils";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export function UploadForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const setActivities = useActivityStore((state) => state.setActivities);

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
      await handleFileUpload(csvFile);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadStatus("uploading");

    try {
      const csvText = await file.text();
      const activities = parseCSVData(csvText);

      if (activities.length === 0) {
        setUploadStatus("error");
        setMessage("No valid data found in CSV file");
        return;
      }

      // Store the activities in Zustand store
      setActivities(activities);

      setUploadStatus("success");
      setMessage(`Successfully uploaded ${activities.length} activities!`);
    } catch (error) {
      setUploadStatus("error");
      setMessage("Failed to process CSV file");
      console.error("Upload error:", error);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleViewDashboard = () => {
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
          isDragging
            ? "border-indigo-400 bg-indigo-50"
            : uploadStatus === "success"
            ? "border-green-400 bg-green-50"
            : uploadStatus === "error"
            ? "border-red-400 bg-red-50"
            : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          {uploadStatus === "uploading" ? (
            <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto" />
          ) : uploadStatus === "success" ? (
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          ) : uploadStatus === "error" ? (
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          ) : (
            <Upload className="w-12 h-12 text-slate-400 mx-auto" />
          )}

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {uploadStatus === "uploading"
                ? "Processing CSV..."
                : uploadStatus === "success"
                ? "Upload Complete!"
                : uploadStatus === "error"
                ? "Upload Failed"
                : "Drop your CSV file here"}
            </h3>
            <p className="text-slate-600">
              {uploadStatus === "idle" && "or click to browse files"}
            </p>
            {message && (
              <p
                className={`mt-2 text-sm ${
                  uploadStatus === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {uploadStatus === "idle" && (
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: 2 }}
          />
        )}
      </div>

      {uploadStatus === "success" && (
        <div className="text-center space-y-4">
          <button
            onClick={handleViewDashboard}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all duration-200"
          >
            View Dashboard
          </button>
          <p className="text-sm text-slate-500">
            Your data has been loaded and is ready for analysis!
          </p>
        </div>
      )}
    </div>
  );
}
