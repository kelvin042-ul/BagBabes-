import { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { uploadToCloudinary } from '../utils/cloudinaryUpload'
import '../styles/ProductManager.css'

function ProductManager() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'Hand Bags',
        isNew: false,
        isBestSeller: false,
        outOfStock: false
    })
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const categories = [
        { id: 'Channel Bags', name: 'Channel Bags' },
        { id: 'Clutch Bags', name: 'Clutch Bags' },
        { id: 'Tote Bags', name: 'Tote Bags' },
        { id: 'Hand Bags', name: 'Hand Bags' },
        { id: 'Luxury Bags', name: 'Luxury Bags' },
        { id: 'Coach Bags', name: 'Coach Bags' }
    ]

    const fetchProducts = async () => {
        try {
            const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(q)
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                isNew: doc.data().isNew || false,
                isBestSeller: doc.data().isBestSeller || false,
                outOfStock: doc.data().outOfStock || false
            }))
            setProducts(productsData)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    // Handle image upload to Cloudinary (AUTOMATIC)
    const handleImageUpload = async (e, isEdit = false) => {
        const file = e.target.files[0]
        if (!file) return

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('❌ Please upload an image file')
            return
        }

        // Show preview immediately
        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
        setUploading(true)
        setUploadProgress(0)

        // Simulate progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 200)

        try {
            // Upload to Cloudinary (auto-compresses)
            const result = await uploadToCloudinary(file)

            clearInterval(progressInterval)
            setUploadProgress(100)

            if (result.success) {
                // Save the Cloudinary URL
                if (isEdit && editingProduct) {
                    setEditingProduct({ ...editingProduct, image: result.url })
                } else {
                    setNewProduct({ ...newProduct, image: result.url })
                }

                setTimeout(() => {
                    alert(`✅ Image uploaded successfully!\n📦 Size: ${(result.size / 1024).toFixed(1)}KB`)
                }, 500)
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('❌ Upload failed: ' + error.message)
            setImagePreview(null)
        } finally {
            clearInterval(progressInterval)
            setTimeout(() => {
                setUploading(false)
                setUploadProgress(0)
            }, 1000)
        }
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        if (!newProduct.image) {
            alert('❌ Please upload an image first')
            return
        }

        try {
            await addDoc(collection(db, 'products'), {
                ...newProduct,
                price: parseFloat(newProduct.price),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            setShowAddForm(false)
            setNewProduct({ name: '', price: '', description: '', image: '', category: 'Hand Bags', isNew: false, isBestSeller: false, outOfStock: false })
            setImagePreview(null)
            fetchProducts()
            alert('✅ Product added successfully!')
        } catch (error) {
            console.error('Error adding product:', error)
            alert('❌ Failed to add product: ' + error.message)
        }
    }

    const handleEditProduct = async (e) => {
        e.preventDefault()
        if (!editingProduct.image) {
            alert('❌ Please upload an image')
            return
        }

        try {
            const productRef = doc(db, 'products', editingProduct.id)
            await updateDoc(productRef, {
                name: editingProduct.name,
                price: parseFloat(editingProduct.price),
                description: editingProduct.description,
                image: editingProduct.image,
                category: editingProduct.category,
                isNew: editingProduct.isNew || false,
                isBestSeller: editingProduct.isBestSeller || false,
                outOfStock: editingProduct.outOfStock || false,
                updatedAt: new Date().toISOString()
            })
            setShowEditForm(false)
            setEditingProduct(null)
            setImagePreview(null)
            fetchProducts()
            alert('✅ Product updated successfully!')
        } catch (error) {
            console.error('Error updating product:', error)
            alert('❌ Failed to update product.')
        }
    }

    const toggleBestSeller = async (product) => {
        try {
            const productRef = doc(db, 'products', product.id)
            await updateDoc(productRef, {
                isBestSeller: !product.isBestSeller,
                updatedAt: new Date().toISOString()
            })
            fetchProducts()
            alert(product.isBestSeller ? '❌ Removed from Best Sellers' : '⭐ Added to Best Sellers!')
        } catch (error) {
            console.error('Error toggling best seller:', error)
            alert('❌ Failed to update.')
        }
    }

    const toggleOutOfStock = async (product) => {
        try {
            const productRef = doc(db, 'products', product.id)
            await updateDoc(productRef, {
                outOfStock: !product.outOfStock,
                updatedAt: new Date().toISOString()
            })
            fetchProducts()
            alert(product.outOfStock ? '✅ Product back in stock!' : '⚠️ Product marked as Out of Stock')
        } catch (error) {
            console.error('Error toggling stock:', error)
            alert('❌ Failed to update.')
        }
    }

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, 'products', productId))
            setDeleteConfirm(null)
            fetchProducts()
            alert('✅ Product deleted successfully!')
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('❌ Failed to delete product.')
        }
    }

    const openEditForm = (product) => {
        setEditingProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
            isNew: product.isNew || false,
            isBestSeller: product.isBestSeller || false,
            outOfStock: product.outOfStock || false
        })
        setImagePreview(product.image)
        setShowEditForm(true)
    }

    if (loading) {
        return <div className="loading">Loading products...</div>
    }

    return (
        <div className="product-manager">
            <div className="product-manager-header">
                <h2>Product Management</h2>
                <button onClick={() => setShowAddForm(true)} className="add-product-btn">
                    + Add New Product
                </button>
            </div>

            {/* Add Product Modal */}
            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add New Product</h3>
                        <form onSubmit={handleAddProduct}>
                            <div className="form-group">
                                <label>Product Image *</label>
                                <div className="image-upload-area">
                                    {uploading ? (
                                        <div className="upload-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                                            </div>
                                            <p>Uploading & compressing... {uploadProgress}%</p>
                                        </div>
                                    ) : imagePreview ? (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => {
                                                    setImagePreview(null)
                                                    setNewProduct({ ...newProduct, image: '' })
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <label className="upload-label">
                                                📸 Click to Upload Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, false)}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            <small>Max 5MB. Auto-compressed on upload</small>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Product Name *</label>
                                <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
                            </div>

                            <div className="form-group">
                                <label>Price (₦) *</label>
                                <input type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows="3" required />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" checked={newProduct.isNew} onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })} />
                                    Mark as New Arrival
                                </label>
                                <label>
                                    <input type="checkbox" checked={newProduct.isBestSeller} onChange={(e) => setNewProduct({ ...newProduct, isBestSeller: e.target.checked })} />
                                    Mark as Best Seller
                                </label>
                                <label>
                                    <input type="checkbox" checked={newProduct.outOfStock} onChange={(e) => setNewProduct({ ...newProduct, outOfStock: e.target.checked })} />
                                    Mark as Out of Stock
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="save-btn" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Save Product'}
                                </button>
                                <button type="button" onClick={() => {
                                    setShowAddForm(false)
                                    setImagePreview(null)
                                    setNewProduct({ name: '', price: '', description: '', image: '', category: 'Hand Bags', isNew: false, isBestSeller: false, outOfStock: false })
                                }} className="cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditForm && editingProduct && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Edit Product</h3>
                        <form onSubmit={handleEditProduct}>
                            <div className="form-group">
                                <label>Product Image *</label>
                                <div className="image-upload-area">
                                    {uploading ? (
                                        <div className="upload-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                                            </div>
                                            <p>Uploading & compressing... {uploadProgress}%</p>
                                        </div>
                                    ) : imagePreview ? (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => {
                                                    setImagePreview(null)
                                                    setEditingProduct({ ...editingProduct, image: '' })
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <label className="upload-label">
                                                📸 Click to Change Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, true)}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            <small>Max 5MB. Auto-compressed on upload</small>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Product Name *</label>
                                <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                            </div>

                            <div className="form-group">
                                <label>Price (₦) *</label>
                                <input type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} required />
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows="3" required />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" checked={editingProduct.isNew} onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })} />
                                    Mark as New Arrival
                                </label>
                                <label>
                                    <input type="checkbox" checked={editingProduct.isBestSeller} onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })} />
                                    Mark as Best Seller
                                </label>
                                <label>
                                    <input type="checkbox" checked={editingProduct.outOfStock} onChange={(e) => setEditingProduct({ ...editingProduct, outOfStock: e.target.checked })} />
                                    Mark as Out of Stock
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="save-btn" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Update Product'}
                                </button>
                                <button type="button" onClick={() => {
                                    setShowEditForm(false)
                                    setImagePreview(null)
                                    setEditingProduct(null)
                                }} className="cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-thumb"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'
                                        }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>₦{product.price}</td>
                                <td><span className="category-badge">{product.category}</span></td>
                                <td className="status-cell">
                                    {product.isNew && <span className="status-new">🆕 New</span>}
                                    {product.isBestSeller && <span className="status-bestseller">⭐ Best Seller</span>}
                                    {product.outOfStock && <span className="status-outofstock">❌ Out of Stock</span>}
                                    {!product.isNew && !product.isBestSeller && !product.outOfStock && <span className="status-normal">—</span>}
                                </td>
                                <td className="actions-cell">
                                    <button onClick={() => toggleBestSeller(product)} className={`action-btn bestseller-btn ${product.isBestSeller ? 'active' : ''}`} title="Toggle Best Seller">
                                        ⭐
                                    </button>
                                    <button onClick={() => toggleOutOfStock(product)} className={`action-btn stock-btn ${product.outOfStock ? 'active' : ''}`} title="Toggle Out of Stock">
                                        📦
                                    </button>
                                    <button onClick={() => openEditForm(product)} className="action-btn edit-btn" title="Edit product">
                                        ✏️
                                    </button>
                                    {deleteConfirm === product.id ? (
                                        <div className="delete-confirm">
                                            <span>Sure?</span>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="confirm-yes">✓</button>
                                            <button onClick={() => setDeleteConfirm(null)} className="confirm-no">✗</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setDeleteConfirm(product.id)} className="action-btn delete-btn" title="Delete product">
                                            🗑️
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductManager