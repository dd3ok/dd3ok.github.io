
import React, { useRef } from 'react';
import { UploadIcon } from './Icon';

interface ImageUploaderProps {
  id: string;
  title: string;
  imageSrc: string | null;
  onImageChange: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  title,
  imageSrc,
  onImageChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-semibold text-slate-700 mb-4 text-center">{title}</h2>
      <div
        className="relative flex-grow flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all duration-300 aspect-w-1 aspect-h-1"
        onClick={handleClick}
      >
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="업로드된 이미지"
            className="object-contain w-full h-full max-h-[400px] rounded-lg p-2"
          />
        ) : (
          <div className="text-center text-slate-500">
            <UploadIcon className="w-12 h-12 mx-auto mb-2" />
            <p className="font-medium">클릭하여 이미지 업로드</p>
            <p className="text-sm">또는 파일을 여기로 드래그하세요</p>
          </div>
        )}
      </div>
    </div>
  );
};
