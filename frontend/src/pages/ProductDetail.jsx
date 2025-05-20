import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchProductById, 
  fetchPriceComparisons, 
  fetchRelatedProducts,
  selectCurrentProduct,
  selectRelatedProducts,
  selectProductsLoading 
} from '../store/slices/productsSlice'
import { addToCart, selectAddingToCart } from '../store/slices/cartSlice'
import { selectIsAuthenticated } from '../store/slices/authSlice'
import ProductCard from '../components/product/ProductCard'
import PriceComparison from '../components/product/PriceComparison'
import Loading from '../components/ui/Loading'
import { mockProducts } from '../services/mockData'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  
  const product = useSelector(selectCurrentProduct)
  const relatedProducts = useSelector(selectRelatedProducts)
  const loading = useSelector(selectProductsLoading)
  const addingToCart = useSelector(selectAddingToCart)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showDescription, setShowDescription] = useState(true)
  const [showFeatures, setShowFeatures] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  
  useEffect(() => {
    // Fetch product data
    if (id) {
      dispatch(fetchProductById(id))
      dispatch(fetchPriceComparisons(id))
      dispatch(fetchRelatedProducts(id))
    }
    
    // Reset scroll position
    window.scrollTo(0, 0)
  }, [dispatch, id])
  
  // useEffect(() => {
  //   // Set default selected options when product loads
  //   if (product) {
  //     if (product.colors && product.colors.length > 0) {
  //       setSelectedColor(product.colors[0])
  //     }
  //     if (product.sizes && product.sizes.length > 0) {
  //       setSelectedSize(product.sizes[0])
  //     }
  //   }
  // }, [product])
  
  // Use mock data for demo if product is not loaded
  const demoProduct = mockProducts.find(p => p.id === id) || mockProducts[0]
  const currentProduct = product || demoProduct
  const related = relatedProducts.length > 0 ? relatedProducts : mockProducts.slice(0, 3)
  console.log(currentProduct)
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/products/${id}`
      return
    }
    
    dispatch(addToCart({
      productId: id,
      quantity,
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
        <Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Images */}
          <div className="w-full md:w-1/2 p-4">
            <div className="mb-4">
              <img
                src={currentProduct.image ? currentProduct.image : ""}
                alt={currentProduct.ProductName}
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {/* {currentProduct.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-primary-500' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )} */}
          </div>
          
          {/* Product Details */}
          <div className="w-full md:w-1/2 p-6">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {currentProduct.ProductName}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        index < Math.floor(currentProduct.Ratings ? currentProduct.Ratings.avgRating : 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {currentProduct.Ratings ? currentProduct.Ratings.avgRating : 0} ({currentProduct.Ratings ? currentProduct.Ratings.totalRatings : 0} reviews)
                  </span>
                </div>
                
                <span className="text-gray-600">Brand: {currentProduct.ProductDescription ? currentProduct.ProductDescription.brand : ""}</span>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                ₹{currentProduct.productCost  ? currentProduct.productCost.toFixed(2) : 0}
                </div>
                {currentProduct.originalPrice > currentProduct.price && (
                  <div className="mt-1">
                    <span className="text-gray-500 line-through">
                    ₹{currentProduct.originalPrice.toFixed(2)}
                    </span>
                    <span className="ml-2 text-accent-500 font-medium">
                      Save ${(currentProduct.originalPrice - currentProduct.price).toFixed(2)}
                    </span>
                  </div>
                )}
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
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                      Size Guide
                    </a>
                  </div>
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
              
              {/* Quantity Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                <div className="flex">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-16 text-center border-t border-b border-gray-300 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="btn btn-primary flex-1 flex justify-center items-center"
                >
                  {addingToCart ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                
                <Link 
                  to={`/virtual-try-on/${currentProduct.id}`}
                  className="btn btn-outline flex-1"
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault()
                      window.location.href = `/login?redirect=/virtual-try-on/${currentProduct.id}`
                    }
                  }}
                >
                  Virtual Try-On
                </Link>
              </div>
              
              {/* Availability */}
              <div className="mb-6">
                <div className="flex items-center">
                  <svg 
                    className={`h-5 w-5 ${currentProduct  ? 'text-green-500' : 'text-red-500'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    {currentProduct? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  <span className={`ml-2 ${currentProduct.inStock ? 'text-green-700' : 'text-red-700'}`}>
                    {currentProduct ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex border-b">
            <button
              onClick={() => {
                setShowDescription(true)
                setShowFeatures(false)
                setShowReviews(false)
              }}
              className={`py-4 px-6 font-medium text-sm ${
                showDescription
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => {
                setShowDescription(false)
                setShowFeatures(true)
                setShowReviews(false)
              }}
              className={`py-4 px-6 font-medium text-sm ${
                showFeatures
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => {
                setShowDescription(false)
                setShowFeatures(false)
                setShowReviews(true)
              }}
              className={`py-4 px-6 font-medium text-sm ${
                showReviews
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews
            </button>
          </div>
          
          <div className="p-6">
            {showDescription && (
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {currentProduct.description}
                </p>
              </div>
            )}
            
            {showFeatures && (
              <div>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {currentProduct.features ? (
                    currentProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))
                  ) : (
                    <li>No features listed for this product.</li>
                  )}
                </ul>
              </div>
            )}
            
            {showReviews && (
              <div>
                <p className="text-gray-700">
                  This product has {currentProduct.reviews} reviews with an average rating of {currentProduct.rating} out of 5 stars.
                </p>
                {/* In a real app, this would display actual reviews */}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Price Comparison Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Price Comparison</h2>
        <PriceComparison productId={id} />
      </div>
      
      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail