import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchPriceComparisons,
  selectPriceComparisons,
  selectProductsLoading
} from '../../store/slices/productsSlice'
import Loading from '../ui/Loading'

const PriceComparison = ({ productId }) => {
  const dispatch = useDispatch()
  const priceComparisons = useSelector(selectPriceComparisons)
  const loading = useSelector(selectProductsLoading)

  useEffect(() => {
    if (productId) {
      dispatch(fetchPriceComparisons(productId))
    }
  }, [dispatch, productId])

  if (loading) {
    return <Loading />
  }

  if (!priceComparisons.length) {
    return (
      <div className="text-gray-500 italic">
        No price comparison data available for this product.
      </div>
    )
  }

  // Find the best (lowest) price
  const bestPrice = Math.min(...priceComparisons.map(vendor => vendor.price))

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Price Comparison</h3>
      
      <div className="space-y-3">
        {priceComparisons.map((vendor, index) => {
          const isBestPrice = vendor.price === bestPrice
          
          return (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-md ${
                isBestPrice ? 'bg-green-50 border border-green-100' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  {/* Vendor icon (replace with actual vendor logos in a real app) */}
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {vendor.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{vendor.name}</h4>
                  <p className="text-sm text-gray-500">
                    {vendor.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className={`font-bold ${isBestPrice ? 'text-green-600' : 'text-gray-900'}`}>
                  ${vendor.price.toFixed(2)}
                </span>
                
                {isBestPrice && (
                  <span className="text-xs text-green-600 font-medium">Best Price</span>
                )}
              </div>
              
              <a 
                href={vendor.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`ml-4 px-3 py-1 rounded text-sm font-medium ${
                  isBestPrice 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Visit
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PriceComparison