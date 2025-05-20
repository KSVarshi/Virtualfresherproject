import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchRecommendedProducts,
  selectRecommendedProducts,
  selectProductsLoading
} from '../../store/slices/productsSlice'
import ProductCard from './ProductCard'
import Loading from '../ui/Loading'

const ProductRecommendations = () => {
  const dispatch = useDispatch()
  const recommendedProducts = useSelector(selectRecommendedProducts)
  const loading = useSelector(selectProductsLoading)

  useEffect(() => {
    dispatch(fetchRecommendedProducts())
  }, [dispatch])

  if (loading && recommendedProducts.length === 0) {
    return <Loading />
  }

  if (recommendedProducts.length === 0) {
    return null
  }

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductRecommendations