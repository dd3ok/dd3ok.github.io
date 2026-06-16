/* eslint-disable @next/next/no-img-element */
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
    <div className="glass-card p-5 md:p-6 flex flex-col h-full shadow-lg">
      <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-4 text-center">{title}</h2>
      <div
        className="relative flex-grow flex items-center justify-center border-2 border-dashed border-[var(--input-border)] rounded-xl cursor-pointer hover:border-[var(--accent-color)] hover:bg-[var(--accent-glow)] transition-all duration-300 min-h-[250px] md:min-h-[300px] overflow-hidden"
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
            className="object-contain w-full h-full max-h-[300px] md:max-h-[400px] rounded-lg p-2 transition-transform duration-500 hover:scale-[1.02]"
          />
        ) : (
          <div className="text-center text-[var(--text-secondary)] p-4">
            <UploadIcon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 text-[var(--accent-color)] opacity-80" />
            <p className="font-semibold text-sm md:text-base text-[var(--text-primary)]">클릭하여 이미지 업로드</p>
            <p className="text-xs md:text-sm mt-1 text-[var(--text-muted)] font-medium">또는 파일을 여기로 드래그하세요</p>
          </div>
        )}
      </div>
    </div>
  );
};
