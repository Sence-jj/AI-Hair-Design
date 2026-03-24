"use client";

import { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import HairstyleSelector from "@/components/HairstyleSelector";
import ResultPreview from "@/components/ResultPreview";
import StepIndicator from "@/components/StepIndicator";

export type Step = "upload" | "select" | "result";

export interface HairstyleOption {
  id: string;
  name: string;
  category: string;
  color: string;
  preview: string;
}

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HairstyleOption | null>(null);
  const [hairColor, setHairColor] = useState("#2c1810");

  const handlePhotoUpload = (photoUrl: string) => {
    setUserPhoto(photoUrl);
    setStep("select");
  };

  const handleStyleSelect = (style: HairstyleOption) => {
    setSelectedStyle(style);
    setStep("result");
  };

  const handleReset = () => {
    setStep("upload");
    setUserPhoto(null);
    setSelectedStyle(null);
    setHairColor("#2c1810");
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✂️</span>
            <h1 className="text-xl font-bold text-gray-800">AI Hair Design</h1>
          </div>
          <p className="text-sm text-gray-500 hidden sm:block">虚拟发型设计，找到最适合你的风格</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <StepIndicator currentStep={step} />

        <div className="mt-8">
          {step === "upload" && (
            <PhotoUpload onUpload={handlePhotoUpload} />
          )}
          {step === "select" && userPhoto && (
            <HairstyleSelector
              userPhoto={userPhoto}
              hairColor={hairColor}
              onColorChange={setHairColor}
              onSelect={handleStyleSelect}
              onBack={() => setStep("upload")}
            />
          )}
          {step === "result" && userPhoto && selectedStyle && (
            <ResultPreview
              userPhoto={userPhoto}
              selectedStyle={selectedStyle}
              hairColor={hairColor}
              onReset={handleReset}
              onBack={() => setStep("select")}
            />
          )}
        </div>
      </div>
    </main>
  );
}
