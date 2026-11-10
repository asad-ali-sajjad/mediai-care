import { Icon } from "@/components/landing/Icon";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-800 text-white shadow-sm">
        <Icon name="pulse" className="h-6 w-6 animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-ping rounded-full bg-teal-600"></span>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Loading MediAI Care...
        </p>
      </div>
    </div>
  );
}