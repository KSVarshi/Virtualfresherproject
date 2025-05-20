import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateCartItem, removeFromCart } from '../../store/slices/cartSlice'

const CartItem = ({ item }) => {
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10)
    if (newQuantity > 0) {
      setQuantity(newQuantity)
      updateQuantity(newQuantity)
    }
  }

  const updateQuantity = (newQuantity) => {
    if (newQuantity === item.quantity) return
    
    setIsUpdating(true)
    dispatch(updateCartItem({ itemId: item.id, quantity: newQuantity }))
      .finally(() => {
        setIsUpdating(false)
      })
  }

  const handleRemove = () => {
    setIsRemoving(true)
    dispatch(removeFromCart(item.id))
      .finally(() => {
        setIsRemoving(false)
      })
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
        <Link to={`/products/${item.productId}`}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-grow ml-0 sm:ml-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full sm:w-auto mb-2 sm:mb-0">
            <Link to={`/products/${item.productId}`} className="text-lg font-medium text-gray-900 hover:text-primary-600">
              {item.name}
            </Link>
            
            <div className="mt-1 text-sm text-gray-500">
              {item.size && <span className="mr-2">Size: {item.size}</span>}
              {item.color && <span>Color: {item.color}</span>}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quantity Selector */}
            <div className="flex items-center">
              <label htmlFor={`quantity-${item.id}`} className="sr-only">
                Quantity
              </label>
              <select
                id={`quantity-${item.id}`}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={isUpdating}
                className="rounded border-gray-300 text-sm py-1 pl-2 pr-6 focus:ring-primary-500 focus:border-primary-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              
              {isUpdating && (
                <svg className="animate-spin ml-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </div>
            
            {/* Item Price */}
            <div className="font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-gray-400 hover:text-accent-500 transition-colors"
              aria-label="Remove item"
            >
              {isRemoving ? (
                <svg className="animate-spin h-5 w-5 text-accent-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem