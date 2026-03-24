"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Camera } from "lucide-react";

interface PhotoUploadProps {
  onUpload: (photoUrl: string) => void;
}

export default function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("请上传 JPEG 或 PNG 格式的图片");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("图片大小不能超过 10MB");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
  });

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">上传你的照片</h2>
        <p className="text-gray-500">上传一张清晰的正脸照片，开始虚拟发型试戴</p>
      </div>

      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
            ${isDragActive
              ? "border-pink-400 bg-pink-50"
              : "border-gray-300 bg-white hover:border-pink-300 hover:bg-pink-50"
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-pink-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? "松开上传" : "拖拽或点击上传照片"}
              </p>
              <p className="text-sm text-gray-400 mt-1">支持 JPEG、PNG，最大 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="上传的照片"
              className="w-full max-h-80 object-contain rounded-xl"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setPreview(null)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              重新上传
            </button>
            <button
              onClick={() => onUpload(preview)}
              className="flex-1 py-2 px-4 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium"
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
