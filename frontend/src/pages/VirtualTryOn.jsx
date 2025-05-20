import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchProductById,
  selectCurrentProduct,
  selectProductsLoading 
} from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import Loading from '../components/ui/Loading'
import { mockProducts } from '../services/mockData'

const VirtualTryOn = () => {
  const { productId } = useParams()
  const dispatch = useDispatch()
  
  const product = useSelector(selectCurrentProduct)
  const loading = useSelector(selectProductsLoading)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  
  const [stream, setStream] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [takeSnapshot, setTakeSnapshot] = useState(false)
  const [snapshot, setSnapshot] = useState(null)
  
  // Use mock data for demo
  const demoProduct = mockProducts.find(p => p.id === productId) || mockProducts[0]
  const currentProduct = product || demoProduct
  
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId))
    }
    
    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [dispatch, productId])
  
  useEffect(() => {
    // Set default selected options when product loads
    if (currentProduct) {
      if (currentProduct.colors && currentProduct.colors.length > 0) {
        setSelectedColor(currentProduct.colors[0])
      }
      if (currentProduct.sizes && currentProduct.sizes.length > 0) {
        setSelectedSize(currentProduct.sizes[0])
      }
    }
  }, [currentProduct])
  
  const initCamera = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream
        setStream(videoStream)
        setIsInitialized(true)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Could not access camera. Please make sure you have granted camera permission.')
    }
  }
  
  const handleSnapshot = () => {
    if (!isInitialized || !videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // In a real app, we'd overlay the product on the image here
    
    // Get the snapshot as a data URL
    const dataUrl = canvas.toDataURL('image/png')
    setSnapshot(dataUrl)
    setTakeSnapshot(true)
  }
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      productId,
      quantity: 1,
      color: selectedColor,
      size: selectedSize
    }))
  }
  
  if (loading && !currentProduct) {
    return <Loading fullPage />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to={`/products/${productId}`} className="text-primary-600 hover:text-primary-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Product
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Virtual Try-On</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">{currentProduct.name}</h2>
              <p className="text-gray-600">
                Try on this product virtually using your camera to see how it looks on you!
              </p>
            </div>
            
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
              {!isInitialized ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-gray-500 mb-4">Camera access required for virtual try-on</p>
                  <button
                    onClick={initCamera}
                    className="btn btn-primary"
                  >
                    Enable Camera
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${takeSnapshot ? 'hidden' : 'block'}`}
                  />
                  
                  {takeSnapshot && snapshot && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={snapshot}
                        alt="Snapshot with virtual try-on"
                        className="max-w-full max-h-full"
                      />
                      
                      {/* Overlay product visualization here in a real app */}
                      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-md">
                        {currentProduct.name} - {selectedColor} - Size {selectedSize}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Hidden canvas for processing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {isInitialized && (
                <>
                  <button
                    onClick={handleSnapshot}
                    className="btn btn-primary"
                  >
                    {takeSnapshot ? 'Try Again' : 'Take Snapshot'}
                  </button>
                  
                  {takeSnapshot && (
                    <button
                      onClick={handleAddToCart}
                      className="btn bg-accent-500 hover:bg-accent-600 text-white"
                    >
                      Add to Cart
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-bold mb-4">How to Use Virtual Try-On</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Enable Camera" to grant camera access</li>
              <li>Position yourself correctly in the frame</li>
              <li>Select your preferred color and size</li>
              <li>Click "Take Snapshot" to see how the product looks on you</li>
              <li>If you like what you see, click "Add to Cart"</li>
            </ol>
          </div>
        </div>
        
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="mb-6">
              <img
                src={currentProduct.images[0]}
                alt={currentProduct.name}
                className="w-full h-64 object-contain mb-4"
              />
              
              <h3 className="text-lg font-bold">{currentProduct.name}</h3>
              <p className="text-xl font-bold text-primary-600 mt-2">
                ${currentProduct.price.toFixed(2)}
              </p>
            </div>
            
            {/* Color Selection */}
            {currentProduct.colors && currentProduct.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                <div className="flex space-x-2">
                  {currentProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === color
                          ? 'border-primary-500 ring-2 ring-primary-200'
                          : 'border-gray-300'
                      }`}
                      title={color}
                    >
                      <span className="sr-only">{color}</span>
                      {/* This would normally have the actual color, but using text for demo */}
                      <span className="flex items-center justify-center text-xs">{color.charAt(0)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {currentProduct.sizes && currentProduct.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 text-sm font-medium rounded-md ${
                        selectedSize === size
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Product Details</h3>
              <p className="text-gray-600 text-sm mb-4">
                {currentProduct.description}
              </p>
              
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {currentProduct.features ? (
                  currentProduct.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                ) : (
                  <li>No features listed for this product.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualTryOn