"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

interface PhotoUploadProps {
  onUpload: (photoUrl: string) => void;
}

export default function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleChange = function (this: HTMLInputElement) {
      const file = this.files && this.files[0];
      if (!file) return;
      if (file.size > 20 * 1024 * 1024) {
        setError("图片大小不能超过 20MB");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = function (ev) {
        const result = ev.target && (ev.target.result as string);
        if (result) {
          setPreview(result);
        }
      };
      reader.readAsDataURL(file);
    };

    input.addEventListener("change", handleChange);
    return () => {
      input.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">上传你的照片</h2>
        <p className="text-gray-500">上传一张清晰的正脸照片，开始虚拟发型试戴</p>
      </div>

      {!preview ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-5">
            <span className="text-6xl">📷</span>
            <p className="text-gray-500">点击下方按钮选择照片</p>

            {/* label直接包裹input，最原生的方式 */}
            <label
              className="px-8 py-4 bg-pink-500 text-white rounded-2xl font-semibold text-lg cursor-pointer active:bg-pink-700 select-none"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              📂 选择照片
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
              />
            </label>

            <p className="text-xs text-gray-400">支持 JPG / PNG，最大 20MB</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="预览"
            className="w-full max-h-80 object-contain rounded-xl"
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600"
            >
              重新上传
            </button>
            <button
              type="button"
              onClick={() => onUpload(preview)}
              className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-medium"
            >
              开始试戴 →
            </button>
          </div>
        </div>
      )}

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
