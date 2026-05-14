import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepperStep {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepperStep[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex flex-col gap-3 sm:flex-row">
      {steps.map((step, index) => {
        const active = index === current;
        const done = index < current;
        return (
          <li key={step.label} className="flex flex-1 items-start gap-3">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                done || active ? "border-primary-600 bg-primary-600 text-white" : "border-border text-text-muted",
              )}
            >
              {done ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            <span>
              <span className="block text-sm font-medium text-text">{step.label}</span>
              {step.description && <span className="text-xs text-text-muted">{step.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
