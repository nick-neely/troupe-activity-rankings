import { BarChart3, Upload } from "lucide-react";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto">
          <BarChart3 className="w-12 h-12 text-indigo-600" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            No Data Available
          </h2>
          <p className="text-slate-600">
            Upload your Troupe activity CSV file to start analyzing your
            group&apos;s preferences and see beautiful insights.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all duration-200"
        >
          <Upload className="w-5 h-5" />
          Upload CSV Data
        </Link>
      </div>
    </div>
  );
}
