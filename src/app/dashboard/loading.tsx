// src/app/loading.tsx
import { Icon } from "@/components/landing/Icon";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <span className="flex h-10 w-10 animate-spin items-center justify-center rounded-lg bg-teal-800 text-white">
          <Icon name="pulse" className="h-6 w-6" />
        </span>
        <p className="text-xs font-medium text-slate-600">Loading MediAI Care...</p>
      </div>
    </div>
  );
}