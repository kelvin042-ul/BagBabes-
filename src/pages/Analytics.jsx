import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import '../styles/Analytics.css'

function Analytics() {
    const [stats, setStats] = useState({
        todayTotal: 0,
        weeklyTotal: 0,
        activeOrders: 0,
        totalRevenue: 0,
        totalOrders: 0
    })
    const [weeklyData, setWeeklyData] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // Calculate stats from orders in real-time
    useEffect(() => {
        const calculateStats = () => {
            // Listen to all orders in real-time
            const ordersQuery = query(collection(db, 'orders'), orderBy('date', 'desc'))

            const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
                let totalRevenue = 0
                let totalOrders = 0
                let todayTotal = 0
                let weeklyTotal = 0
                let activeOrders = 0
                const productSales = {}
                const dailyRevenue = {}

                const today = new Date().toDateString()
                const oneWeekAgo = new Date()
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

                snapshot.docs.forEach(doc => {
                    const order = doc.data()
                    const orderTotal = order.total || 0
                    const orderDate = new Date(order.date)
                    const orderDateString = orderDate.toLocaleDateString()

                    // Total revenue
                    totalRevenue += orderTotal
                    totalOrders++

                    // Today's total
                    if (orderDate.toDateString() === today) {
                        todayTotal += orderTotal
                    }

                    // Weekly total
                    if (orderDate >= oneWeekAgo) {
                        weeklyTotal += orderTotal
                    }

                    // Active orders (Pending or Processing)
                    if (order.status === 'Pending' || order.status === 'Processing') {
                        activeOrders++
                    }

                    // Daily revenue for chart
                    dailyRevenue[orderDateString] = (dailyRevenue[orderDateString] || 0) + orderTotal

                    // Product sales
                    if (order.items) {
                        order.items.forEach(item => {
                            productSales[item.name] = (productSales[item.name] || 0) + item.quantity
                        })
                    }
                })

                // Format chart data (last 7 days)
                const chartData = Object.entries(dailyRevenue)
                    .map(([date, revenue]) => ({ date, revenue }))
                    .slice(-7)

                // Get top 3 products
                const top3 = Object.entries(productSales)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([name, sales]) => ({ name, sales }))

                setStats({
                    todayTotal,
                    weeklyTotal,
                    activeOrders,
                    totalRevenue,
                    totalOrders
                })

                setWeeklyData(chartData)
                setTopProducts(top3)
                setLoading(false)
            })

            return unsubscribe
        }

        const unsubscribe = calculateStats()
        return () => unsubscribe()
    }, [])

    if (loading) {
        return <div className="analytics-loading">Loading analytics...</div>
    }

    return (
        <div className="analytics-dashboard">
            <h1 className="analytics-title">📊 Analytics Dashboard</h1>

            <div className="bento-grid">

                {/* Card A: Revenue Chart */}
                <div className="bento-card card-large">
                    <h3>Revenue Growth</h3>
                    <p className="card-subtitle">Last 7 days</p>
                    {weeklyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₦${value}`} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#6B46C1"
                                    strokeWidth={2}
                                    dot={{ fill: '#6B46C1', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="no-data">No orders yet</p>
                    )}
                </div>

                {/* Card B: Today's Total */}
                <div className="bento-card card-small">
                    <div className="card-icon">💰</div>
                    <h3>Today's Total</h3>
                    <p className="card-value">₦{stats.todayTotal.toLocaleString()}</p>
                </div>

                {/* Card C: Weekly Total */}
                <div className="bento-card card-small">
                    <div className="card-icon">📊</div>
                    <h3>Weekly Total</h3>
                    <p className="card-value">₦{stats.weeklyTotal.toLocaleString()}</p>
                </div>

                {/* Card D: Active Orders */}
                <div className="bento-card card-small">
                    <div className="card-icon">📦</div>
                    <h3>Active Orders</h3>
                    <p className="card-value">{stats.activeOrders}</p>
                </div>

                {/* Card E: Top Products */}
                <div className="bento-card card-medium">
                    <h3>🏆 Top Selling Products</h3>
                    <div className="top-products-list">
                        {topProducts.length === 0 ? (
                            <p className="no-data">No sales yet</p>
                        ) : (
                            topProducts.map((product, index) => (
                                <div key={index} className="top-product-item">
                                    <span className="product-rank">{index + 1}</span>
                                    <span className="product-name">{product.name}</span>
                                    <span className="product-sales">{product.sales} sold</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Card F: Total Revenue & Orders */}
                <div className="bento-card card-wide">
                    <div className="total-revenue">
                        <div>
                            <h3>Total Revenue</h3>
                            <p className="total-value">₦{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                            <h3>Total Orders</h3>
                            <p className="total-value">{stats.totalOrders}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics