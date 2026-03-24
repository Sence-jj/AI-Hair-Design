"use client";

import { useState } from "react";
import { HairstyleOption } from "@/app/page";
import { ArrowLeft } from "lucide-react";

const HAIRSTYLES: HairstyleOption[] = [
  { id: "short-bob", name: "短发波波头", category: "短发", color: "#8B4513", preview: "💇" },
  { id: "pixie", name: "精灵短发", category: "短发", color: "#2c1810", preview: "✂️" },
  { id: "medium-wave", name: "中长波浪卷", category: "中长发", color: "#8B4513", preview: "🌊" },
  { id: "straight-long", name: "长直发", category: "长发", color: "#1a1a1a", preview: "📏" },
  { id: "curly-long", name: "长卷发", category: "长发", color: "#8B4513", preview: "🌀" },
  { id: "ponytail", name: "高马尾", category: "扎发", color: "#2c1810", preview: "🎀" },
  { id: "bun", name: "丸子头", category: "扎发", color: "#2c1810", preview: "⭕" },
  { id: "braids", name: "编发", category: "编发", color: "#8B4513", preview: "🔗" },
  { id: "shaggy", name: "慵懒碎发", category: "短发", color: "#C68642", preview: "🪄" },
  { id: "side-part", name: "侧分长发", category: "长发", color: "#1a1a1a", preview: "💫" },
];

const HAIR_COLORS = [
  { name: "自然黑", value: "#1a1a1a" },
  { name: "深棕", value: "#2c1810" },
  { name: "栗棕", value: "#8B4513" },
  { name: "金棕", value: "#C68642" },
  { name: "亚麻金", value: "#D4A853" },
  { name: "酒红", value: "#722F37" },
  { name: "玫瑰棕", value: "#9B4F6A" },
  { name: "灰白", value: "#C0C0C0" },
];

const CATEGORIES = ["全部", "短发", "中长发", "长发", "扎发", "编发"];

interface HairstyleSelectorProps {
  userPhoto: string;
  hairColor: string;
  onColorChange: (color: string) => void;
  onSelect: (style: HairstyleOption) => void;
  onBack: () => void;
}

export default function HairstyleSelector({
  userPhoto,
  hairColor,
  onColorChange,
  onSelect,
  onBack,
}: HairstyleSelectorProps) {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered =
    activeCategory === "全部"
      ? HAIRSTYLES
      : HAIRSTYLES.filter((s) => s.category === activeCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: user photo + color picker */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-4">
          <p className="text-sm font-medium text-gray-600 mb-3">你的照片</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={userPhoto}
            alt="用户照片"
            className="w-full rounded-xl object-cover max-h-64"
          />

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600 mb-2">选择发色</p>
            <div className="grid grid-cols-4 gap-2">
              {HAIR_COLORS.map((c) => (
                <button
                  key={c.value}
                  title={c.name}
                  onClick={() => onColorChange(c.value)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${
                    hairColor === c.value
                      ? "border-pink-500 scale-110"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              当前：{HAIR_COLORS.find((c) => c.value === hairColor)?.name}
            </p>
          </div>

          <button
            onClick={onBack}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 重新上传照片
          </button>
        </div>
      </div>

      {/* Right: hairstyle grid */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">选择发型</h2>

        <div className="flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-pink-500 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-pink-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((style) => (
            <button
              key={style.id}
              onClick={() => onSelect(style)}
              onMouseEnter={() => setHovered(style.id)}
              onMouseLeave={() => setHovered(null)}
              className={`bg-white rounded-2xl p-4 text-center shadow-sm border-2 transition-all hover:shadow-md cursor-pointer ${
                hovered === style.id
                  ? "border-pink-400 scale-105"
                  : "border-transparent"
              }`}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
                style={{ backgroundColor: hairColor + "33" }}
              >
                {style.preview}
              </div>
              <p className="font-medium text-gray-800 text-sm">{style.name}</p>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                {style.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
