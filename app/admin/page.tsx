import { BroadcastManagement } from "@/components/broadcast-management";
import { DataManagement } from "@/components/data-management";
import { UploadForm } from "@/components/upload-form";

export default function AdminPage() {
  return (
    <div className="mx-auto p-0 md:p-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 mb-6">
          Manage your activity data, upload new CSVs, and review group analytics
        </p>
      </div>

      {/* Broadcast Management Section */}
      <div className="mb-8">
        <BroadcastManagement />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
            <UploadForm />
          </div>
          <div className="bg-indigo-50 rounded-3xl p-4 md:p-6 border border-indigo-200">
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
                <strong>google_maps_url:</strong> Google Maps link for the
                activity
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
        </div>
        <div className="space-y-6 md:space-y-8">
          <DataManagement />
        </div>
      </div>
    </div>
  );
}
