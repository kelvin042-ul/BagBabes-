import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import '../styles/CategoryCircles.css'

function CategoryCircles() {
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'products'))
                const uniqueCats = [...new Set(snapshot.docs.map(doc => doc.data().category).filter(Boolean))]
                // Custom order: Tote, Clutch, Shoulder, Luxury, Coach, Casual
                const order = ['Tote', 'Clutch', 'Shoulder', 'Luxury', 'Coach', 'Casual']
                const sorted = order.filter(c => uniqueCats.includes(c))
                const others = uniqueCats.filter(c => !order.includes(c))
                setCategories([...sorted, ...others].slice(0, 8))
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    const handleCategoryClick = (category) => {
        navigate(`/shop?category=${category}`)
    }

    // Fallback images for circles (use bag images or placeholders)
    const getCategoryImage = (category) => {
        const images = {
            'Tote': '/images/bag1.JPG',
            'Clutch': '/images/bag4.JPG',
            'Shoulder': '/images/bag7.JPG',
            'Luxury': '/images/bag5.JPG',
            'Coach': '/images/bag2.JPG',
            'Casual': '/images/bag3.JPG'
        }
        return images[category] || '/images/bag1.JPG'
    }

    return (
        <div className="category-circles">
            <h2>Shop by Category</h2>
            <div className="circles-grid">
                {categories.map(cat => (
                    <div key={cat} className="circle-item" onClick={() => handleCategoryClick(cat)}>
                        <img src={getCategoryImage(cat)} alt={cat} className="circle-image" />
                        <span className="circle-name">{cat}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryCircles