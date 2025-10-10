// /src/components/templates/MainLayout.tsx
import type { ReactNode } from "react";

import SupportPanel from "../organisms/SupportPanel";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-blue-600">LiveDrop</h1>
      </header>

      <main className="flex-1 container mx-auto p-4">{children}</main>

      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600">
        © {new Date().getFullYear()} LiveDrop
      </footer>

      {/* ✅ SupportPanel visible everywhere */}
      <SupportPanel />
    </div>
  );
}
