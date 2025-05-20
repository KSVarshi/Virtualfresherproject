import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { selectIsAuthenticated } from '../../store/slices/authSlice'

const ProductCard = ({ product }) => {
  console.log("product card")
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=/products/${product.id}`
      return
    }
    
    setIsAddingToCart(true)
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
      .finally(() => {
        setIsAddingToCart(false)
      })
  }

  // Get best price for the product (if price comparison is available)
  const getBestPrice = () => {
    // if (product.priceComparison && product.priceComparison.length > 0) {
    //   const prices = product.priceComparison.map(vendor => vendor.price)
    //   return Math.min(...prices)
    // }
   console.log("product cost", product.productCost)
   if (product.productCost === undefined){
    return 0;
   }
   return product.productCost;
  //  return product.price
  }
  
  return (
    <div 
      className="card group transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.productID}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden h-64">
          <img
            src={product.image && product.image.length > 0 
              ? product.image 
              : 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
            alt={product.ProductName}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="badge badge-primary">New</span>
            )}
            {product.discount > 0 && (
              <span className="badge badge-accent">
                {product.discount}% OFF
              </span>
            )}
          </div>
          
          {/* Quick actions */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex justify-between">
              <button 
                onClick={handleAddToCart}
                className="btn btn-accent btn-sm"
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
              
              <Link 
                to={`/virtual-try-on/${product.id}`} 
                className="btn btn-outline text-black border-white btn-sm"
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault()
                    window.location.href = `/login?redirect=/virtual-try-on/${product.id}`
                  }
                }}
              >
                Try On
              </Link>
            </div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{product.ProductName}</h3>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm text-gray-600">{product.Ratings?product.Ratings.avgRating:0}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{product.ProductDescription?product.ProductDescription.shortDescription:""}</p>
          
          <div className="mt-auto">
            {/* Price and brand info */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-bold text-gray-900">${getBestPrice().toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-600">{product.brand}</span>
            </div>
            
            {/* Price comparison hint if available */}
            {product.priceComparison && product.priceComparison.length > 0 && (
              <div className="mt-2 text-xs text-secondary-600">
                Compare prices from {product.priceComparison.length} vendors
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard