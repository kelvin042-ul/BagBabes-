import { useEffect } from 'react'
import '../styles/Notification.css'

function Notification({ message, type }) {
    useEffect(() => {
        const notification = document.querySelector('.notification')
        if (notification) {
            notification.classList.add('show')

            return () => {
                notification.classList.remove('show')
            }
        }
    }, [])

    return (
        <div className={`notification notification-${type}`}>
            <span className="notification-message">{message}</span>
        </div>
    )
}

export default Notification