"use client";

import { useRef, useState } from "react";
import { Upload, Camera } from "lucide-react";

interface PhotoUploadProps {
  onUpload: (photoUrl: string) => void;
}

export default function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("请上传 JPEG 或 PNG 格式的图片");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("图片大小不能超过 10MB");
      return;
    }
    setError(null);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">上传你的照片</h2>
        <p className="text-gray-500">上传一张清晰的正脸照片，开始虚拟发型试戴</p>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging
              ? "border-pink-400 bg-pink-50"
              : "border-gray-300 bg-white"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-pink-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 mb-1">
                {isDragging ? "松开上传" : "选择或拖拽照片"}
              </p>
              <p className="text-sm text-gray-400">支持 JPEG、PNG，最大 10MB</p>
            </div>
            {/* Explicit button for mobile compatibility */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-2 px-8 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 active:bg-pink-700 transition-colors text-base"
            >
              📷 选择照片
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="上传的照片"
            className="w-full max-h-80 object-contain rounded-xl"
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              重新上传
            </button>
            <button
              type="button"
              onClick={() => onUpload(preview)}
              className="flex-1 py-3 px-4 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium"
            >
              开始试戴 →
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
      )}

      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Camera className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">拍照小贴士</p>
            <ul className="space-y-1 text-blue-600">
              <li>• 正面拍摄，光线充足</li>
              <li>• 头发自然垂落，露出发际线</li>
              <li>• 避免帽子、头饰遮挡</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
