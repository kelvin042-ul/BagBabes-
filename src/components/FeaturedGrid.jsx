import { useNavigate } from 'react-router-dom'
import '../styles/FeaturedGrid.css'

function FeatureGrid() {
    const navigate = useNavigate()

    const features = [
        {
            id: 'quality',
            title: 'Original Quality',
            description: 'Premium materials and craftsmanship',
            icon: '✨',
            filter: (products) => products.filter(p =>
                p.description?.toLowerCase().includes('quality') ||
                p.description?.toLowerCase().includes('premium') ||
                p.description?.toLowerCase().includes('genuine')
            )
        },
        {
            id: 'budget',
            title: 'Budget Friendly',
            description: 'Great value at affordable prices',
            icon: '💰',
            filter: (products) => [...products].sort((a, b) => a.price - b.price).slice(0, 12)
        },
        {
            id: 'design',
            title: 'Unique Design',
            description: 'Stand out with distinctive styles',
            icon: '🎨',
            filter: (products) => products.filter(p =>
                p.description?.toLowerCase().includes('design') ||
                p.description?.toLowerCase().includes('unique') ||
                p.description?.toLowerCase().includes('leather') ||
                p.description?.toLowerCase().includes('woven')
            )
        }
    ]

    const handleClick = (feature) => {
        // Store filter type in sessionStorage for shop page to read
        sessionStorage.setItem('filterType', feature.id)
        navigate('/shop')
    }

    return (
        <div className="feature-grid fade-up">
            <div className="feature-grid-container">
                {features.map(feature => (
                    <div key={feature.id} className="feature-card" onClick={() => handleClick(feature)}>
                        <div className="feature-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FeatureGrid