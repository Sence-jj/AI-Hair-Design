"use client";

import { useState, useRef } from "react";
import { HairstyleOption } from "@/app/page";
import { ArrowLeft, Download, Share2, RotateCcw, Check } from "lucide-react";

interface ResultPreviewProps {
  userPhoto: string;
  selectedStyle: HairstyleOption;
  hairColor: string;
  onReset: () => void;
  onBack: () => void;
}

export default function ResultPreview({
  userPhoto,
  selectedStyle,
  hairColor,
  onReset,
  onBack,
}: ResultPreviewProps) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleSave = () => {
    // Create a canvas to composite the image with the style overlay
    const link = document.createElement("a");
    link.href = userPhoto;
    link.download = `ai-hair-design-${selectedStyle.id}.jpg`;
    link.click();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: "AI Hair Design",
      text: `我用 AI Hair Design 试戴了「${selectedStyle.name}」发型，快来试试！`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">你的发型效果</h2>
        <p className="text-gray-500">
          发型：<span className="text-pink-500 font-medium">{selectedStyle.name}</span>
          &nbsp;·&nbsp;
          发色：
          <span
            className="inline-block w-3 h-3 rounded-full align-middle mx-1"
            style={{ backgroundColor: hairColor }}
          />
        </p>
      </div>

      {/* Preview card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="relative bg-gradient-to-b from-pink-50 to-purple-50 p-8 flex items-center justify-center min-h-80">
          {/* User photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={userPhoto}
            alt="发型效果"
            className="max-h-72 rounded-2xl shadow-md object-contain"
          />

          {/* Style overlay badge */}
          <div
            className="absolute top-4 right-4 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
            style={{ backgroundColor: hairColor + "44", border: `2px solid ${hairColor}` }}
          >
            {selectedStyle.preview}
          </div>

          {/* AI badge */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
            ✨ AI 生成效果
          </div>
        </div>

        {/* Style info */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-800">{selectedStyle.name}</p>
              <p className="text-sm text-gray-400">{selectedStyle.category} · AI 虚拟试戴</p>
            </div>
            <div
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: hairColor }}
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {saved ? "已保存" : "保存图片"}
            </button>
            <button
              onClick={handleShare}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all border ${
                shared
                  ? "bg-green-50 border-green-300 text-green-600"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {shared ? "已复制链接" : "分享"}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 换个发型
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> 重新开始
        </button>
      </div>
    </div>
  );
}
