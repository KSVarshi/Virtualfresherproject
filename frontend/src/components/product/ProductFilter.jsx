import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter, clearFilters, selectFilters, selectCategories } from '../../store/slices/productsSlice'

const ProductFilter = () => {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const categories = useSelector(selectCategories)
  
  // Local state for filter inputs
  const [localFilters, setLocalFilters] = useState(filters)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Update local state when redux filters change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalFilters({
      ...localFilters,
      [name]: value
    })
  }
  
  // Apply filters
  const handleApplyFilters = () => {
    dispatch(setFilter(localFilters))
    if (window.innerWidth < 768) {
      setIsFilterOpen(false)
    }
  }
  
  // Reset filters
  const handleResetFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <div className="mb-8">
      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <button
          className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      {/* Filter panel */}
      <div className={`bg-white rounded-lg shadow-md p-6 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          
          {/* Category filter */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={localFilters.category}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
          
          {/* Price range filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={localFilters.minPrice}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={localFilters.maxPrice}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
            </div>
          </div>
          
          {/* Vendor filter */}
          <div className="mb-4">
            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <select
              id="vendor"
              name="vendor"
              value={localFilters.vendor}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">All Vendors</option>
              <option value="TechVillage">TechVillage</option>
              <option value="FashionHub">FashionHub</option>
              <option value="SportSpace">SportSpace</option>
              <option value="HomeEssentials">HomeEssentials</option>
              <option value="LuxuryGoods">LuxuryGoods</option>
            </select>
          </div>
          
          {/* Sort by filter */}
          <div className="mb-6">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              value={localFilters.sortBy}
              onChange={handleInputChange}
              className="input"
            >
              <option value="popularity">Popularity</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
          
          {/* Filter action buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleApplyFilters}
              className="btn btn-primary flex-1"
            >
              Apply Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="btn btn-outline flex-1"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFilter