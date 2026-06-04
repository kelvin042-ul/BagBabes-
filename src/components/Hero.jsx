import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Hero.css'

function Hero() {
    // Hardcoded bag images for slider
    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1600",
            title: "Premium Leather Bags",
            subtitle: "Crafted for the modern lifestyle"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600",
            title: "Luxury Collection",
            subtitle: "Elegance meets durability"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1600",
            title: "Shop the Latest Trends",
            subtitle: "Free shipping on some orders"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1600",
            title: "Timeless Designs",
            subtitle: "Built to last a lifetime"
        }
    ]

    const [currentSlide, setCurrentSlide] = useState(0)

    // Auto-slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [slides.length])

    // Go to specific slide
    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    // Next/Prev functions
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    return (
        <div className="hero-slider">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1>{slide.title}</h1>
                        <p>{slide.subtitle}</p>
                        <Link to="/shop" className="hero-btn">Shop Now →</Link>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button className="slider-arrow prev" onClick={prevSlide}>❮</button>
            <button className="slider-arrow next" onClick={nextSlide}>❯</button>

            {/* Dots Indicator */}
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Hero