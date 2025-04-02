import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTranslateY(0);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleTouchStart = (e: any) => {
    if (isScrolling) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: any) => {
    if (!isDragging || isScrolling) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    if (translateY > 150) {
      onClose();
    } else {
      setTranslateY(0);
    }
    setIsDragging(false);
  };

  const handleScroll = (e: any) => {
    setIsScrolling(true);
    
    // Reset scrolling state after a short delay
    setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <view
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isVisible ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)",
        zIndex: 50,
        transition: "background-color 0.3s ease-out",
      }}
      bindtap={onClose}
    >
      <view
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "94%",
          backgroundColor: "#000000",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          transform: isVisible ? `translateY(${translateY}px)` : "translateY(100%)",
          transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        bindtap={() => {}}
      >
        {/* Drag Handle */}
        <view 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
          bindtouchstart={handleTouchStart}
          bindtouchmove={handleTouchMove}
          bindtouchend={handleTouchEnd}
        >
          <view style={{
            width: "40px",
            height: "4px",
            backgroundColor: "#4b5563",
            borderRadius: "2px",
          }} />
        </view>

        {/* Content Area */}
        <scroll-view
          scroll-orientation="vertical"
          enable-scroll={true}
          scroll-bar-enable={false}
          bounces={true}
          bindscroll={handleScroll}
          style={{
            marginTop: "48px",
            height: "calc(100% - 48px)",
            padding: "0 20px 20px 20px",
          }}
        >
          <view style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            {children}
          </view>
        </scroll-view>
      </view>
    </view>
  );
} 