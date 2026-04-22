"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export function Accordion({ title, content, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-sand-200 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-ink">{title}</span>
        <ChevronDown
          size={18}
          className={`transition ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      {isOpen ? <p className="mt-3 text-sm leading-6 text-slate-600">{content}</p> : null}
    </div>
  );
}
