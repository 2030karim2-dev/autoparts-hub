import { Check } from "lucide-react";

interface Props {
  currentStep: number;
  steps?: string[];
}

const CheckoutProgress = ({ currentStep, steps = ["العنوان", "الدفع", "التأكيد"] }: Props) => (
  <div className="px-4 py-3 bg-card border-b border-border" dir="rtl">
    <div className="flex items-center justify-between">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-initial">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < currentStep
                  ? "bg-primary text-primary-foreground"
                  : i === currentStep
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium ${i <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${i < currentStep ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default CheckoutProgress;