import React, { useState, useEffect } from 'react';
import server from '../../../public/images/server.png';
import pw from '../../../public/images/pw.png';
import mypage from '../../../public/images/mypage.png';
import friend from '../../../public/images/friend.png';
import file from '../../../public/images/file.png';
import emoji from '../../../public/images/emoji.png'
import login from '../../../public/images/login.png'
import './ImageSlider.css';

const ImageSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = [ server, pw, mypage, friend, file, emoji, login];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 3000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="image-slider">
            {banners.map((banner, index) => (
                <img
                    key={index}
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className={index === currentSlide ? 'active' : ''}
                />
            ))}
        </div>
    );
};

export default ImageSlider;
