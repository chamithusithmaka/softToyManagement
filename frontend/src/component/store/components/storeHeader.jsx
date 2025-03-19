import React, { useState, useEffect } from 'react';

// Import images from the 'pics' folder
import image1 from '../Pics/image1.jpg';
import image2 from '../Pics/image2.jpg';
import image3 from '../Pics/image3.jpg';

const BannerSlideshow = () => {
    const images = [image1, image2, image3];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) =>
                prevSlide === images.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(slideInterval);
    }, [images.length]);

    const slideshowContainerStyle = {
        maxWidth: "100%",
        
        position: "relative",
        margin: "auto",
    };

    const slideStyle = (isVisible) => ({
        display: isVisible ? "block" : "none",
        width: "100%",
    });

    const imgStyle = {
        width: "100%",
        borderRadius: "10px", // Optional: for rounded corners
    };

    return (
        <div style={slideshowContainerStyle}>
            {images.map((image, index) => (
                <div
                    key={index}
                    style={slideStyle(index === currentSlide)}
                >
                    <img src={image} alt={`slide-${index}`} style={imgStyle} />
                </div>
            ))}
        </div>
    );
};

export default BannerSlideshow;
