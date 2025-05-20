import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRecommendedProducts, selectRecommendedProducts } from '../store/slices/productsSlice'
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice'
import ProductCard from '../components/product/ProductCard'
import Loading from '../components/ui/Loading'
import AIChatPopup from '../components/chat/AIChatPopup'
import { mockRecommendations, mockProducts } from '../services/mockData'

const Home = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const recommendedProducts = useSelector(selectRecommendedProducts)
  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchRecommendedProducts())
    }
  }, [dispatch, isAuthenticated])

  // For demo purposes, use mock data
  const featuredProducts = mockProducts.slice(0, 4)
  const recommendations = recommendedProducts.length > 0 ? recommendedProducts : mockRecommendations

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              AI-Powered Shopping Experience
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 animate-slide-up">
              Find the perfect products, compare prices across vendors, and try them on virtually before you buy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="btn bg-white text-primary-600 hover:bg-gray-100"
              >
                Start Shopping
              </Link>
              {!isAuthenticated && (
                <Link 
                  to="/register" 
                  className="btn bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-shadow">
              <img 
                src="https://images.pexels.com/photos/1893868/pexels-photo-1893868.jpeg" 
                alt="Apparel"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-medium text-lg mb-1">Apparel</h3>
                  <Link to="/products?category=Apparel" className="text-white/80 text-sm hover:text-white transition-colors">
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-shadow">
              <img 
                src="https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg" 
                alt="Electronics"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-medium text-lg mb-1">Electronics</h3>
                  <Link to="/products?category=Electronics" className="text-white/80 text-sm hover:text-white transition-colors">
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-shadow">
              <img 
                src="https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg" 
                alt="Accessories"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-medium text-lg mb-1">Accessories</h3>
                  <Link to="/products?category=Accessories" className="text-white/80 text-sm hover:text-white transition-colors">
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-shadow">
              <img 
                src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" 
                alt="Footwear"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-medium text-lg mb-1">Footwear</h3>
                  <Link to="/products?category=Footwear" className="text-white/80 text-sm hover:text-white transition-colors">
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Personalized Recommendations */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {isAuthenticated ? `Recommended for You, ${user?.name?.split(' ')[0]}` : 'Popular Products'}
            </h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <ProductCard key={product.productID} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.productID} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Virtual Try-On Feature Highlight */}
      <section className="py-12 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold mb-4">Virtual Try-On Experience</h2>
              <p className="text-lg mb-6 opacity-90">
                Try before you buy with our state-of-the-art AR technology. See how clothes, accessories, and more will look on you before making a purchase.
              </p>
              <Link 
                to={isAuthenticated ? "/products" : "/login"} 
                className="btn bg-white text-secondary-600 hover:bg-gray-100"
              >
                Try It Now
              </Link>
            </div>
            <div className="lg:w-5/12">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img 
                  src="https://images.pexels.com/photos/4886285/pexels-photo-4886285.jpeg" 
                  alt="Virtual Try-On" 
                  className="rounded w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Price Comparison Feature */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pl-12">
              <h2 className="text-3xl font-bold mb-4">Find the Best Deals</h2>
              <p className="text-lg mb-6 text-gray-600">
                Our AI compares prices across multiple vendors to ensure you always get the best deal on your purchases.
              </p>
              <Link 
                to="/products" 
                className="btn btn-primary"
              >
                Compare Prices
              </Link>
            </div>
            <div className="lg:w-5/12">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Price Comparison Example</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 border border-green-100 rounded-md">
                    <span className="font-medium">TechVillage</span>
                    <span className="font-bold text-green-600">$199.99</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">FashionHub</span>
                    <span className="font-bold">$229.99</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">SportSpace</span>
                    <span className="font-bold">$249.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Subscribe to our newsletter for personalized product recommendations and exclusive deals.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow input rounded-r-none"
            />
            <button
              type="submit"
              className="btn btn-primary rounded-l-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* AI Chat Popup */}
      <AIChatPopup />
    </div>
  )
}

export default Home