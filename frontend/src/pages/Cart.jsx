import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchCart, 
  getCartRecommendations,
  applyCoupon,
  selectCartItems, 
  selectCartTotal, 
  selectCartSubtotal,
  selectCartDiscount,
  selectCartLoading,
  selectCartRecommendations 
} from '../store/slices/cartSlice'
import CartItem from '../components/cart/CartItem'
import ProductCard from '../components/product/ProductCard'
import Loading from '../components/ui/Loading'
import { mockCart, mockRecommendations } from '../services/mockData'

const Cart = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const cartSubtotal = useSelector(selectCartSubtotal)
  const cartDiscount = useSelector(selectCartDiscount)
  const loading = useSelector(selectCartLoading)
  const recommendations = useSelector(selectCartRecommendations)
  
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  
  useEffect(() => {
    dispatch(fetchCart())
    dispatch(getCartRecommendations())
  }, [dispatch])
  
  // Use mock data for demo
  const items = cartItems.length > 0 ? cartItems : mockCart.items
  const subtotal = cartItems.length > 0 ? cartSubtotal : mockCart.subtotal
  const discount = cartItems.length > 0 ? cartDiscount : mockCart.discount
  const total = cartItems.length > 0 ? cartTotal : mockCart.total
  const cartRecommendations = recommendations.length > 0 ? recommendations : mockRecommendations
  
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return
    
    setIsApplyingCoupon(true)
    dispatch(applyCoupon(couponCode))
      .finally(() => {
        setIsApplyingCoupon(false)
        setCouponCode('')
      })
  }

  if (loading && items.length === 0) {
    return <Loading fullPage />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link 
            to="/products" 
            className="btn btn-primary inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6 pb-4 border-b border-gray-200">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Coupon Code */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex mb-4">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input rounded-r-none flex-grow"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="btn bg-gray-900 text-white rounded-l-none hover:bg-black disabled:bg-gray-400"
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                
                <Link
                  to="/checkout"
                  className="btn btn-primary w-full text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recommended Products */}
      {cartRecommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cartRecommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart