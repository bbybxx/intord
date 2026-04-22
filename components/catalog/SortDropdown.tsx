"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowUpDown, DollarSign, TrendingUp } from "lucide-react";
import { SortOption } from "@/lib/products";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export function SortDropdown({ value, onChange, className = "" }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    {
      value: "price-asc" as SortOption,
      label: "Сначала дешевые",
      icon: <DollarSign size={16} className="text-green-600" />,
      description: "От низкой к высокой цене"
    },
    {
      value: "price-desc" as SortOption,
      label: "Сначала дорогие",
      icon: <TrendingUp size={16} className="text-amber-600" />,
      description: "От высокой к низкой цене"
    }
  ];

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: SortOption) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full min-w-[200px] rounded-xl border bg-white px-4 py-3
          text-sm font-medium transition-all duration-200
          ${isOpen 
            ? "border-sand-400 shadow-md ring-1 ring-sand-100" 
            : "border-sand-200 hover:border-sand-300 hover:shadow-sm"
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-3">
          <ArrowUpDown size={16} className="text-slate-500" />
          <div className="text-left">
            <div className="font-medium text-ink">Сортировка</div>
            <div className="text-xs text-slate-500 mt-0.5">{selectedOption.label}</div>
          </div>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-sand-200 bg-white py-2 shadow-xl">
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Сортировать по:</p>
          </div>
          
          <ul role="listbox" className="space-y-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors
                    ${value === option.value 
                      ? "bg-sand-50 text-ink font-medium" 
                      : "text-slate-700 hover:bg-sand-50"
                    }
                  `}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <div className={`p-2 rounded-lg ${value === option.value ? "bg-white shadow-sm" : "bg-sand-100"}`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{option.description}</div>
                  </div>
                  {value === option.value && (
                    <div className="w-2 h-2 rounded-full bg-ink" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-sand-100 px-4 py-3">
            <p className="text-xs text-slate-500">
              Сортировка влияет на порядок отображения товаров в каталоге
            </p>
          </div>
        </div>
      )}
    </div>
  );
}