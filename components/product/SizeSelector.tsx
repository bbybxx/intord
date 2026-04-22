"use client";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
  hasError?: boolean;
  errorText?: string;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  hasError = false,
  errorText
}: SizeSelectorProps) {
  return (
    <div className={`space-y-3 rounded-xl border p-3 ${hasError ? "border-red-300 bg-red-50" : "border-transparent"}`}>
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
        Размер
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const active = size === selectedSize;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              className={`min-w-11 rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-sand-200 bg-white text-ink hover:border-sand-400"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
      {hasError && errorText ? <p className="text-xs text-red-600">{errorText}</p> : null}
    </div>
  );
}
