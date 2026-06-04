// Cloudinary upload utility - automatic compression & upload

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

// Compress image before upload (reduces file size)
const compressImage = (file, maxWidth = 1000, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                // Resize if too large
                if (width > maxWidth) {
                    height = (height * maxWidth) / width
                    width = maxWidth
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                // Convert to blob with compression
                canvas.toBlob(
                    (blob) => {
                        resolve(blob)
                    },
                    'image/jpeg',
                    quality
                )
            }
            img.onerror = reject
        }
        reader.onerror = reject
    })
}

// Upload image to Cloudinary
export const uploadToCloudinary = async (file, onProgress) => {
    try {
        // Step 1: Compress the image (reduces size by 70-90%)
        const compressedBlob = await compressImage(file)

        // Step 2: Create form data for Cloudinary
        const formData = new FormData()
        formData.append('file', compressedBlob, 'product.jpg')
        formData.append('upload_preset', UPLOAD_PRESET)

        // Step 3: Upload to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Upload failed')
        }

        const data = await response.json()

        // Return the compressed image URL
        return {
            success: true,
            url: data.secure_url,
            publicId: data.public_id,
            size: data.bytes,
            format: data.format
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// Delete image from Cloudinary (optional - for when product is deleted)
export const deleteFromCloudinary = async (publicId) => {
    // Note: Delete requires API signature (backend only)
    // For now, just return true
    console.log('Delete requested for:', publicId)
    return true
}