"use client";

import { useEffect, useRef, useState } from "react";
import { HairstyleOption } from "@/app/page";
import { ArrowLeft, Download, Share2, RotateCcw, Check, Loader2 } from "lucide-react";

interface ResultPreviewProps {
  userPhoto: string;
  selectedStyle: HairstyleOption;
  hairColor: string;
  onReset: () => void;
  onBack: () => void;
}

// Hairstyle SVG path shapes (normalized 0-1 coordinates, drawn on top of face)
const HAIR_SHAPES: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number) => void> = {
  "short-bob": (ctx, w, h) => {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.18, w * 0.38, h * 0.22, 0, Math.PI, 0);
    ctx.bezierCurveTo(w * 0.88, h * 0.32, w * 0.85, h * 0.48, w * 0.78, h * 0.5);
    ctx.lineTo(w * 0.22, h * 0.5);
    ctx.bezierCurveTo(w * 0.15, h * 0.48, w * 0.12, h * 0.32, w * 0.12, h * 0.18);
    ctx.closePath();
  },
  "pixie": (ctx, w, h) => {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.15, w * 0.35, h * 0.18, 0, Math.PI, 0);
    ctx.bezierCurveTo(w * 0.85, h * 0.25, w * 0.82, h * 0.38, w * 0.75, h * 0.4);
    ctx.lineTo(w * 0.25, h * 0.4);
    ctx.bezierCurveTo(w * 0.18, h * 0.38, w * 0.15, h * 0.25, w * 0.15, h * 0.15);
    ctx.closePath();
  },
  "medium-wave": (ctx, w, h) => {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.16, w * 0.4, h * 0.2, 0, Math.PI, 0);
    ctx.bezierCurveTo(w * 0.9, h * 0.3, w * 0.92, h * 0.55, w * 0.82, h * 0.68);
    ctx.bezierCurveTo(w * 0.78, h * 0.72, w * 0.72, h * 0.7, w * 0.7, h * 0.65);
    ctx.lineTo(w * 0.3, h * 0.65);
    ctx.bezierCurveTo(w * 0.28, h * 0.7, w * 0.22, h * 0.72, w * 0.18, h * 0.68);
    ctx.bezierCurveTo(w * 0.08, h * 0.55, w * 0.1, h * 0.3, w * 0.1, h * 0.16);
    ctx.closePath();
  },
  "straight-long": (ctx, w, h) => {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.15, w * 0.38, h * 0.19, 0, Math.PI, 0);
    ctx.lineTo(w * 0.88, h * 0.85);
    ctx.lineTo(w * 0.12, h * 0.85);
    ctx.closePath();
  },
  "curly-long": (ctx, w, h) => {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.14, w * 0.42, h * 0.22, 0, Math.PI, 0);
    ctx.bezierCurveTo(w * 0.95, h * 0.3, w * 1.0, h * 0.6, w * 0.9, h * 0.82);
    ctx.bezierCurveTo(w * 0.85, h * 0.9, w * 0.75, h * 0.88, w * 0.72, h * 0.82);
    ctx.lineTo(w * 0.28, h * 0.82);
    ctx.bezierCurveTo(w * 0.25, h * 0.88, w * 0.15, h * 0.9, w * 0.1, h * 0.82);
    ctx.bezierCurveTo(w * 0.0, h * 0.6, w * 0.05, h * 0.3, w * 0.08, h * 0.14);
    ctx.closePath();
  },
  "ponytail": (ctx, w, h) => {
    // Top bun area
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.12, w * 0.36, h * 0.16, 0, Math.PI, 0);
    ctx.lineTo(w * 0.86, h * 0.35);
    ctx.lineTo(w * 0.14, h * 0.35);
    ctx.closePath();
    // Ponytail
    ctx.moveTo(w * 0.44, h * 0.28);
    ctx.bezierCurveTo(w * 0.42, h * 0.5, w * 0.44, h * 0.75, w * 0.5, h * 0.9);
    ctx.bezierCurveTo(w * 0.56, h * 0.75, w * 0.58, h * 0.5, w * 0.56, h * 0.28);
    ctx.closePath();
  },
  "bun": (ctx, w, h) => {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.12, w * 0.34, h * 0.15, 0, Math.PI, 0);
    ctx.lineTo(w * 0.84, h * 0.32);
    ctx.lineTo(w * 0.16, h * 0.32);
    ctx.closePath();
    // Bun circle on top
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.06, w * 0.12, 0, Math.PI * 2);
    ctx.closePath();
  },
  "braids": (ctx, w, h) => {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.15, w * 0.38, h * 0.19, 0, Math.PI, 0);
    ctx.lineTo(w * 0.88, h * 0.35);
    ctx.lineTo(w * 0.12, h * 0.35);
    ctx.closePath();
    // Left braid
    ctx.beginPath();
    ctx.moveTo(w * 0.28, h * 0.35);
    ctx.bezierCurveTo(w * 0.22, h * 0.55, w * 0.26, h * 0.7, w * 0.24, h * 0.88);
    ctx.lineTo(w * 0.32, h * 0.88);
    ctx.bezierCurveTo(w * 0.34, h * 0.7, w * 0.3, h * 0.55, w * 0.36, h * 0.35);
    ctx.closePath();
    // Right braid
    ctx.beginPath();
    ctx.moveTo(w * 0.64, h * 0.35);
    ctx.bezierCurveTo(w * 0.7, h * 0.55, w * 0.66, h * 0.7, w * 0.68, h * 0.88);
    ctx.lineTo(w * 0.76, h * 0.88);
    ctx.bezierCurveTo(w * 0.74, h * 0.7, w * 0.78, h * 0.55, w * 0.72, h * 0.35);
    ctx.closePath();
  },
  "shaggy": (ctx, w, h) => {
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h * 0.18);
    ctx.bezierCurveTo(w * 0.1, h * 0.08, w * 0.2, h * 0.02, w * 0.3, h * 0.05);
    ctx.bezierCurveTo(w * 0.35, h * 0.0, w * 0.45, h * -0.02, w * 0.5, h * 0.0);
    ctx.bezierCurveTo(w * 0.55, h * -0.02, w * 0.65, h * 0.0, w * 0.7, h * 0.05);
    ctx.bezierCurveTo(w * 0.8, h * 0.02, w * 0.9, h * 0.08, w * 0.88, h * 0.18);
    ctx.bezierCurveTo(w * 0.9, h * 0.32, w * 0.88, h * 0.46, w * 0.8, h * 0.5);
    ctx.lineTo(w * 0.2, h * 0.5);
    ctx.bezierCurveTo(w * 0.12, h * 0.46, w * 0.1, h * 0.32, w * 0.12, h * 0.18);
    ctx.closePath();
  },
  "side-part": (ctx, w, h) => {
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.05);
    ctx.bezierCurveTo(w * 0.15, h * 0.05, w * 0.1, h * 0.12, w * 0.1, h * 0.2);
    ctx.lineTo(w * 0.1, h * 0.85);
    ctx.lineTo(w * 0.22, h * 0.85);
    ctx.lineTo(w * 0.22, h * 0.35);
    ctx.bezierCurveTo(w * 0.22, h * 0.28, w * 0.28, h * 0.22, w * 0.35, h * 0.2);
    ctx.lineTo(w * 0.9, h * 0.2);
    ctx.bezierCurveTo(w * 0.9, h * 0.1, w * 0.8, h * 0.03, w * 0.65, h * 0.03);
    ctx.lineTo(w * 0.3, h * 0.05);
    ctx.closePath();
    // Right side long hair
    ctx.moveTo(w * 0.78, h * 0.35);
    ctx.lineTo(w * 0.9, h * 0.35);
    ctx.lineTo(w * 0.9, h * 0.85);
    ctx.lineTo(w * 0.78, h * 0.85);
    ctx.closePath();
  },
};

function applyHairToCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  styleId: string,
  hairColor: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  // Draw original photo
  ctx.drawImage(img, 0, 0, W, H);

  // Get hair draw function
  const drawHair = HAIR_SHAPES[styleId] || HAIR_SHAPES["short-bob"];

  // Draw hair with color + blend
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = hairColor;
  drawHair(ctx, W, H);
  ctx.fill();
  ctx.restore();

  // Add a soft overlay for depth
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = hairColor;
  drawHair(ctx, W, H);
  ctx.fill();
  ctx.restore();

  // Soft edge blur effect using shadow
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.5;
  ctx.shadowColor = hairColor;
  ctx.shadowBlur = 18;
  ctx.fillStyle = hairColor;
  drawHair(ctx, W, H);
  ctx.fill();
  ctx.restore();
}

export default function ResultPreview({
  userPhoto,
  selectedStyle,
  hairColor,
  onReset,
  onBack,
}: ResultPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setLoading(true);
    setResultUrl(null);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Scale to fit nicely
      const maxSize = 600;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      applyHairToCanvas(canvas, img, selectedStyle.id, hairColor);
      setResultUrl(canvas.toDataURL("image/jpeg", 0.92));
      setLoading(false);
    };
    img.src = userPhoto;
  }, [userPhoto, selectedStyle, hairColor]);

  const handleSave = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `hair-design-${selectedStyle.id}.jpg`;
    link.click();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share && resultUrl) {
      try {
        const blob = await (await fetch(resultUrl)).blob();
        const file = new File([blob], "hair-design.jpg", { type: "image/jpeg" });
        await navigator.share({ files: [file], title: "AI Hair Design" });
      } catch {
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">发型效果预览</h2>
        <p className="text-gray-500">
          发型：<span className="text-pink-500 font-medium">{selectedStyle.name}</span>
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="relative bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center min-h-72 p-6">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-10">
              <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
              <p className="text-gray-500">正在合成发型效果...</p>
            </div>
          )}

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          {!loading && resultUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt="发型效果"
                className="max-h-96 rounded-2xl shadow-md object-contain"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                ✨ 发型预览效果
              </div>
            </>
          )}
        </div>

        {/* Before / After */}
        {!loading && resultUrl && (
          <div className="px-6 pt-4 grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">原图</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={userPhoto} alt="原图" className="w-full h-28 object-cover rounded-xl" />
            </div>
            <div className="text-center">
              <p className="text-xs text-pink-500 mb-1 font-medium">{selectedStyle.name} ✨</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt="效果" className="w-full h-28 object-cover rounded-xl" />
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSave}
              disabled={loading || !resultUrl}
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
        <button onClick={onBack} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" /> 换个发型
        </button>
        <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
          <RotateCcw className="w-4 h-4" /> 重新开始
        </button>
      </div>
    </div>
  );
}
