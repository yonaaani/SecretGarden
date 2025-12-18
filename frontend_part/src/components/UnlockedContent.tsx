import React, { useState, useRef } from "react";
import "../pages/StartPage.css";
import "./UnlockedContent.css";

interface UnlockedContentProps {
  onImageUpload?: (file: File, imageDataUrl: string) => void;
}

const UnlockedContent: React.FC<UnlockedContentProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        // Передаємо фото в батьківський компонент
        if (onImageUpload) {
          onImageUpload(file, imageDataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="unlocked-content1">
      <div className="box1">
        <div 
          className={`group1 ${isDragging ? 'dragging1' : ''}`}
          style={{ backgroundImage: "url(/rectangle-2.png)" }}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          
          <img className="intersect1" alt="Intersect" src="/intersect-1.png" />

          <div className="div1">
            <p className="text-wrapper1">and let the garden uncover its secret</p>

            <div className="group-2-1">
              <p className="drop-your-bloom-her1">
                <span className="span">D</span>

                <span className="text-wrapper-2">R</span>

                <span className="span">OP YOUR&nbsp;&nbsp; </span>

                <span className="text-wrapper-2">B</span>

                <span className="span">LOOM HER</span>

                <span className="text-wrapper-2">E</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockedContent;

