import { Step } from "@/app/page";
import { Check } from "lucide-react";

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: "upload", label: "上传照片", icon: "📷" },
  { key: "select", label: "选择发型", icon: "💇" },
  { key: "result", label: "查看效果", icon: "✨" },
];

const ORDER: Step[] = ["upload", "select", "result"];

export default function StepIndicator({ currentStep }: { currentStep: Step }) {
  const currentIndex = ORDER.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isDone
                    ? "bg-pink-500 text-white"
                    : isActive
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-200 scale-110"
                    : "bg-white text-gray-400 border-2 border-gray-200"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : step.icon}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? "text-pink-500" : isDone ? "text-gray-500" : "text-gray-300"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mb-4 mx-1 transition-all ${
                  index < currentIndex ? "bg-pink-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
