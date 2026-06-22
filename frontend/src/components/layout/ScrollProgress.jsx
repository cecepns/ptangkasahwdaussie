import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgress() {
  const progress = useScrollProgress();
  const scale = progress / 100;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-1 pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div className="h-full w-full bg-gray-200/30 overflow-hidden">
        <div
          className="h-full w-full origin-left bg-gradient-to-r from-brand-red via-brand-blue to-brand-blue will-change-transform"
          style={{ transform: `scaleX(${scale})` }}
        />
      </div>
    </div>
  );
}
