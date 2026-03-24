"use client";

import { useEffect, useState } from "react";
import { HairstyleOption } from "@/app/page";
import { ArrowLeft, Download, Share2, RotateCcw, Check, Loader2 } from "lucide-react";

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
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      setError(null);
      setAiImage(null);

      try {
        const res = await fetch("/api/hairstyle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hairstyle: selectedStyle.name,
            hairColor,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "生成失败");

        // result is array of image URLs
        const url = Array.isArray(data.result) ? data.result[0] : data.result;
        setAiImage(url);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "AI 生成失败，请重试";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [userPhoto, selectedStyle, hairColor]);

  const handleSave = () => {
    const link = document.createElement("a");
    link.href = aiImage || userPhoto;
    link.download = `ai-hair-${selectedStyle.id}.jpg`;
    link.click();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "AI Hair Design",
        text: `我用 AI 试戴了「${selectedStyle.name}」发型！`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">AI 发型效果</h2>
        <p className="text-gray-500">
          发型：<span className="text-pink-500 font-medium">{selectedStyle.name}</span>
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Preview area */}
        <div className="relative bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center min-h-80 p-6">
          {loading && (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="w-12 h-12 text-pink-400 animate-spin" />
              <div className="text-center">
                <p className="text-gray-600 font-medium">AI 正在生成发型效果...</p>
                <p className="text-gray-400 text-sm mt-1">大约需要 15-30 秒</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <span className="text-5xl">⚠️</span>
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-pink-500 text-white rounded-xl text-sm"
              >
                重新生成
              </button>
            </div>
          )}

          {!loading && aiImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={aiImage}
                alt="AI 发型效果"
                className="max-h-96 rounded-2xl shadow-md object-contain"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                ✨ AI 生成效果
              </div>
            </>
          )}
        </div>

        {/* Before/After comparison */}
        {!loading && aiImage && (
          <div className="px-6 pt-4 grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">原图</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={userPhoto} alt="原图" className="w-full h-24 object-cover rounded-xl" />
            </div>
            <div className="text-center">
              <p className="text-xs text-pink-500 mb-1 font-medium">AI 效果 ✨</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={aiImage} alt="效果图" className="w-full h-24 object-cover rounded-xl" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSave}
              disabled={loading || !!error}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                saved ? "bg-green-500 text-white" : "bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-40"
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {saved ? "已保存" : "保存图片"}
            </button>
            <button
              onClick={handleShare}
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium border transition-all ${
                shared ? "bg-green-50 border-green-300 text-green-600" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              }`}
            >
              {shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {shared ? "已复制" : "分享"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" /> 换个发型
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4" /> 重新开始
        </button>
      </div>
    </div>
  );
}
