import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 min-h-screen bg-slate-100">
      <div className="m-4 bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="p-6">
          <div className="mb-6">
            <SidebarTrigger className="h-8 w-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50" />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainLayout;
