'use client';
import React, { useState, useEffect, useRef } from 'react';
import '../componentStyles/ImageSlider.css';

const defaultSlidesData = [
  { imageUrl: '/images/img-1.jpg', buttonUrl: '#' },
  { imageUrl: '/images/img-2.jpg', buttonUrl: '#' },
  { imageUrl: '/images/img-3.jpg', buttonUrl: '#' },
  { imageUrl: '/images/img-4.jpg', buttonUrl: '#' },
];

function ImageSlider() {
  const [slides, setSlides] = useState(defaultSlidesData);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Load slides from localStorage
    const savedSlides = JSON.parse(localStorage.getItem('adminSlides'));
    if (savedSlides && savedSlides.length > 0) {
      setSlides(savedSlides);
    }
  }, []);

  // Create extended slides for infinite loop effect
  const extendedSlides = slides.length > 0
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : defaultSlidesData; // Fallback if slides are still empty somehow

  useEffect(() => {
    if (slides.length > 0) { // Only set interval if there are slides
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 5000); // 5 seconds interval

      return () => clearInterval(interval);
    }
  }, [slides.length]); // Re-run effect if number of slides changes

  useEffect(() => {
    if (slides.length > 0) { // Only run carousel logic if there are slides
      if (currentIndex === extendedSlides.length - 1) {
        // If last extended slide, smoothly transition to the first real slide (index 1)
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(1);
        }, 500); // Transition duration
      } else if (currentIndex === 0) {
        // If first extended slide, smoothly transition to the last real slide (index slides.length)
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(slides.length);
        }, 500); // Transition duration
      }
    }
  }, [currentIndex, extendedSlides.length, slides.length]); // Dependencies for carousel logic

  useEffect(() => {
    if (!isTransitioning) {
      // After jump, re-enable transition for next slide
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  }, [isTransitioning]);

  const goToSlide = (index) => {
    setCurrentIndex(index + 1); // Adjust for extended slides
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
        {extendedSlides.map((slide, index) => (
          <div className="slider-item" key={index}>
            {slide.buttonUrl ? (
              <a href={slide.buttonUrl} target="_blank" rel="noopener noreferrer">
                <img src={slide.imageUrl} alt={`Slide ${index}`} />
              </a>
            ) : (
              <img src={slide.imageUrl} alt={`Slide ${index}`} />
            )}
          </div>
        ))}
      </div>
      <div className="slider-dots">
        {slides.map((_, index) => ( // Dots correspond to actual number of unique slides
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