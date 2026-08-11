import React from 'react';
import { Check, User, FileText, Send } from 'lucide-react';

/**
 * Default steps for the 3-step advocacy reporting form.
 */
export const DEFAULT_STEPS = [
  { number: 1, title: 'Identitas Pelapor', icon: User },
  { number: 2, title: 'Detail Laporan', icon: FileText },
  { number: 3, title: 'Konfirmasi & Kirim', icon: Send },
];

/**
 * Helper function to determine the CSS class for a step dot based on current progress.
 */

const getStepClass = (stepNumber, currentStep) => {
  if (stepNumber < currentStep) {
    return 'step-dot-completed';
  }
  if (stepNumber === currentStep) {
    return 'step-dot-active';
  }
  return 'step-dot-inactive';
};

/**
 * StepIndicator component displaying a multi-step form progress indicator.
 *
 * @param {Object} props
 * @param {number} props.currentStep - Current active step index (1-3)
 * @param {Array} props.steps - Array of step items { number, title, icon }
 */
export default function StepIndicator({ currentStep = 1, steps = DEFAULT_STEPS }) {
  const stepsToRender = steps && steps.length > 0 ? steps : DEFAULT_STEPS;
  const activeStep = Number(currentStep) || 1;

  return (
    <div className="w-full max-w-lg mx-auto mb-10 px-4">
      <div className="flex items-start justify-between relative">
        {stepsToRender.map((step, index) => {
          const stepNum = step.number ?? index + 1;
          const isCompleted = stepNum < activeStep;
          const isActive = stepNum === activeStep;
          const IconComponent = step.icon;

          return (
            <React.Fragment key={stepNum}>
              {/* Step dot & label column */}
              <div className="flex flex-col items-center gap-2 group relative z-10">
                <div
                  className={`${getStepClass(stepNum, activeStep)} ${
                    isActive ? 'ring-4 ring-primary-100 scale-105' : ''
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5] animate-fade-in" />
                  ) : IconComponent ? (
                    typeof IconComponent === 'function' || typeof IconComponent === 'object' ? (
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" />
                    ) : (
                      IconComponent
                    )
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>

                {/* Step label (hidden on mobile, visible on sm and up) */}
                <span
                  className={`text-xs font-medium hidden sm:block text-center transition-colors duration-300 max-w-[120px] leading-tight ${
                    isActive
                      ? 'text-primary-600 font-semibold'
                      : isCompleted
                      ? 'text-surface-700 font-medium'
                      : 'text-surface-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector line between step dots (not after last step) */}
              {index < stepsToRender.length - 1 && (
                <div
                  className={`mt-5 ${
                    stepNum < activeStep ? 'step-line-active' : 'step-line-inactive'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
