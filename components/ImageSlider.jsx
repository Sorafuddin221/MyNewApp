'use client';
import React, { useState, useEffect, useRef } from 'react';
import '../componentStyles/ImageSlider.css';

const images = [
  '/images/img-1.jpg',
  '/images/img-2.jpg',
  '/images/img-3.jpg',
  '/images/img-4.jpg',
];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);

  const extendedImages = [images[images.length - 1], ...images, images[0]];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === extendedImages.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 500);
    } else if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(extendedImages.length - 2);
      }, 500);
    }
  }, [currentIndex, extendedImages.length]);

  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  }, [isTransitioning]);

  const goToSlide = (index) => {
    setCurrentIndex(index + 1);
  };

  return (
    <div className="image-slider-container">
      <div
        ref={sliderRef}
        className="slider-images"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease' : 'none',
        }}
      >
        {extendedImages.map((image, index) => (
          <div className="slider-item" key={index}>
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index + 1 ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;