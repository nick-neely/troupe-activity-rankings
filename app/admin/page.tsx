import { DataManagement } from "@/components/data-management";
import { UploadForm } from "@/components/upload-form";

export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Upload Activity Data
        </h1>
        <p className="text-slate-600">
          Upload a CSV file containing your Troupe activity data to analyze
          group preferences
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <UploadForm />
      </div>

      <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-2">
          CSV Format Requirements
        </h3>
        <p className="text-sm text-indigo-700 mb-3">
          Your CSV file should contain the following columns:
        </p>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>
            <strong>name:</strong> Activity name
          </li>
          <li>
            <strong>category:</strong> Activity category (Food, Tours, etc.)
          </li>
          <li>
            <strong>groupNames:</strong> Group names (e.g. &quot;Mini-Golf /
            Putt Putt&quot;)
          </li>
          <li>
            <strong>website_link:</strong> Website URL for the activity
          </li>
          <li>
            <strong>google_maps_url:</strong> Google Maps link for the activity
          </li>
          <li>
            <strong>price:</strong> Price information
          </li>
          <li>
            <strong>love_votes:</strong> Number of love votes
          </li>
          <li>
            <strong>like_votes:</strong> Number of like votes
          </li>
          <li>
            <strong>pass_votes:</strong> Number of pass votes
          </li>
        </ul>
      </div>
      <DataManagement />
    </div>
  );
}
