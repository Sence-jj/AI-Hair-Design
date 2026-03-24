"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

interface PhotoUploadProps {
  onUpload: (photoUrl: string) => void;
}

export default function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError("图片大小不能超过 20MB");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) setPreview(result);
    };
    reader.onerror = () => setError("图片读取失败，请重试");
    reader.readAsDataURL(file);
  };

  if (preview) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl p-6 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="预览" className="w-full max-h-80 object-contain rounded-xl" />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setPreview(null)}
            className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600"
          >
            重新上传
          </button>
          <button
            onClick={() => onUpload(preview)}
            className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-medium"
          >
            开始试戴 →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">上传你的照片</h2>
        <p className="text-gray-500">上传一张清晰的正脸照片，开始虚拟发型试戴</p>
      </div>

      <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl">📷</span>
          <p className="text-gray-500 text-sm">选择照片或直接拍照</p>

          {/* Fully visible input — no hiding tricks */}
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-6
              file:rounded-xl file:border-0
              file:text-base file:font-medium
              file:bg-pink-500 file:text-white
              hover:file:bg-pink-600
              cursor-pointer"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}

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
