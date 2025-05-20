import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { 
  fetchProducts, 
  fetchCategories,
  setFilter,
  forceProductRefresh,
  setPage,
  selectFilteredProducts,
  selectFilters,
  selectPagination,
  selectProductsLoading
} from '../store/slices/productsSlice'
import ProductCard from '../components/product/ProductCard'
import ProductFilter from '../components/product/ProductFilter'
import Loading from '../components/ui/Loading'
import { mockProducts } from '../services/mockData'



const Products = () => {
  //console.log("PRODUCTS")
  const dispatch = useDispatch()
  const location = useLocation()
  const filteredProducts = useSelector(selectFilteredProducts)
  const filters = useSelector(selectFilters)
  const pagination = useSelector(selectPagination)
  const loading = useSelector(selectProductsLoading)
  
  // Filter mock products to only show clothing items
  const clothingCategories = ['Apparel', 'Clothing', 'Shirts', 'Pants', 'Dresses', 'Jackets']
 // console.log("filtered products", filteredProducts)
  const products = (filteredProducts.length > 0 ? filteredProducts : mockProducts)
    .filter(product => 
//console.log("Product", product) ||
      clothingCategories.includes(product.category) || 
      product.ProductName.toLowerCase().includes('shirt') ||
      product.ProductName.toLowerCase().includes('jacket') ||
      product.ProductName.toLowerCase().includes('dress') ||
      product.ProductName.toLowerCase().includes('pants')
    )

  // Parse search params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const urlFilters = {}
    
    // Extract filters from URL
    if (searchParams.has('category')) urlFilters.category = searchParams.get('category')
    if (searchParams.has('search')) urlFilters.search = searchParams.get('search')
    if (searchParams.has('minPrice')) urlFilters.minPrice = searchParams.get('minPrice')
    if (searchParams.has('maxPrice')) urlFilters.maxPrice = searchParams.get('maxPrice')
    if (searchParams.has('vendor')) urlFilters.vendor = searchParams.get('vendor')
    if (searchParams.has('sortBy')) urlFilters.sortBy = searchParams.get('sortBy')
    
    // Set initial category filter to Apparel
    if (!urlFilters.category) {
      urlFilters.category = 'Apparel1'
    }
    
    // Only update filters if there are any in the URL
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilter(urlFilters))
    }
  }, [location.search, dispatch])
  // Fetch products and categories on initial load
 console.log("fetchproduct call")

  useEffect(() => {
    //dispatch(fetchCategories())
    console.log("in use effect")
    dispatch(fetchProducts(filters))
  }, [dispatch, filters, pagination.currentPage])




  const maxVisiblePages = 10;
  let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 1.5));
  let endPage = Math.min(pagination.totalPages, pagination.currentPage + Math.floor(maxVisiblePages / 3));

  // Adjust startPage and endPage if near the beginning or end
  if (startPage <= 1) {
    endPage = Math.min(pagination.totalPages, maxVisiblePages);
  }
  if (endPage >= pagination.totalPages) {
    startPage = Math.max(1, pagination.totalPages - maxVisiblePages + 1);
  }

  // Generate pagination buttons
  const paginationButtons = []
  for (let i = startPage; i < endPage; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => dispatch(setPage(i))}
        className={`px-4 py-2 border-t border-b border-r ${
          pagination.currentPage === i
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } ${i === 1 ? 'rounded-l-md border-l' : ''} ${
          i === pagination.totalPages ? 'rounded-r-md' : ''
        }`}
      >
        {i}
      </button>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Clothing Collection</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <ProductFilter />
        </div>
        
        {/* Product Listing */}
        <div className="w-full md:w-3/4">
          {/* Results summary */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {products.length} clothing items
              {filters.category && ` in ${filters.category}`}
              {filters.search && ` matching "${filters.search}"`}
            </p>
          </div>
          
          {loading ? (
            <Loading fullPage />
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No clothing items found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 
                  {products.map((product) => (
                  
                    <ProductCard key={product.productID} product={product} />
                  
                  ))}
                </div>
              )}
            </>
          )}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex">
                <button
                  onClick={() => dispatch(setPage(Math.max(1, pagination.currentPage - 1)))}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 rounded-l-md border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {paginationButtons}
                <button
                  onClick={() => dispatch(setPage(Math.min(pagination.totalPages, pagination.currentPage + 1)))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-r-md border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products