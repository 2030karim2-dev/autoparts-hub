import { useState } from "react";
import { ArrowRight, Car, ChevronLeft, Check, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { vehicleMakes, years } from "@/data/products";

type Step = "make" | "model" | "year";

const VehicleSelect = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("make");
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const stepTitle = { make: "اختر الشركة المصنعة", model: "اختر الموديل", year: "اختر سنة الصنع" };
  const stepNum = { make: 1, model: 2, year: 3 };

  const make = vehicleMakes.find((m) => m.id === selectedMake);

  const handleMakeSelect = (id: string) => {
    setSelectedMake(id);
    setSelectedModel(null);
    setSelectedYear(null);
    setStep("model");
    setSearch("");
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setStep("year");
    setSearch("");
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
  };

  const handleConfirm = () => {
    navigate("/");
  };

  const handleBack = () => {
    if (step === "model") { setStep("make"); setSearch(""); }
    else if (step === "year") { setStep("model"); setSearch(""); }
    else navigate(-1);
  };

  const filteredMakes = search
    ? vehicleMakes.filter((m) => m.name.includes(search) || m.nameEn.toLowerCase().includes(search.toLowerCase()))
    : vehicleMakes;

  const filteredModels = make
    ? search ? make.models.filter((m) => m.includes(search)) : make.models
    : [];

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={handleBack} className="active:scale-95 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">اختيار المركبة</h1>
        <div className="w-5" />
      </header>

      {/* Progress */}
      <div className="px-4 py-3" dir="rtl">
        <div className="flex items-center gap-2 mb-4">
          {(["make", "model", "year"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                stepNum[step] > i + 1 ? "bg-success text-success-foreground" :
                step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {stepNum[step] > i + 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < 2 && <div className={`h-0.5 flex-1 rounded-full ${stepNum[step] > i + 1 ? "bg-success" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
        <h2 className="text-lg font-bold mb-3">{stepTitle[step]}</h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg bg-card border border-border pr-9 pl-3 text-sm outline-none"
            placeholder="بحث..."
            dir="rtl"
          />
        </div>
      </div>

      {/* Selection Lists */}
      <div className="px-4 pb-6 space-y-2" dir="rtl">
        {step === "make" && filteredMakes.map((m, i) => (
          <button
            key={m.id}
            onClick={() => handleMakeSelect(m.id)}
            className={`w-full bg-card rounded-xl px-4 py-3.5 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.nameEn}</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        {step === "model" && filteredModels.map((model, i) => (
          <button
            key={model}
            onClick={() => handleModelSelect(model)}
            className={`w-full bg-card rounded-xl px-4 py-3.5 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-bold">{make?.name} {model}</p>
            </div>
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        {step === "year" && years.map((year, i) => (
          <button
            key={year}
            onClick={() => handleYearSelect(year)}
            className={`w-full bg-card rounded-xl px-4 py-3.5 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform ${
              selectedYear === year ? "border-2 border-primary" : ""
            } animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
          >
            <p className="text-sm font-bold">{year}</p>
            {selectedYear === year && <Check className="w-5 h-5 text-primary" />}
          </button>
        ))}
      </div>

      {/* Confirm */}
      {selectedYear && step === "year" && (
        <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-4 py-3" dir="rtl">
          <div className="bg-secondary rounded-lg px-3 py-2 mb-3 text-sm">
            <span className="font-bold">{make?.name} {selectedModel} {selectedYear}</span>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl active:scale-[0.97] transition-transform shadow-md"
          >
            تأكيد اختيار المركبة
          </button>
        </div>
      )}
    </AppLayout>
  );
};

export default VehicleSelect;
