import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchUserPreferences, 
  updateUserPreferences,
  selectUserPreferences,
  selectUserPreferencesLoading 
} from '../store/slices/userPreferencesSlice'
import Loading from '../components/ui/Loading'
import { toast } from 'react-toastify'
import { mockUserPreferences, mockCategories } from '../services/mockData'

const UserPreferences = () => {
  const dispatch = useDispatch()
  const preferences = useSelector(selectUserPreferences)
  const loading = useSelector(selectUserPreferencesLoading)
  
  // Local state for form
  const [formData, setFormData] = useState({
    country: '',
    preferredVendors: [],
    gender: '',
    apparelSizes: {
      tops: '',
      bottoms: '',
      shoes: '',
    },
    priceRange: {
      min: 0,
      max: 1000,
    },
    preferredCategories: [],
    shippingPreferences: [],
  })
  
  // Load user preferences on component mount
  useEffect(() => {
    dispatch(fetchUserPreferences())
  }, [dispatch])
  
  // Update local state when preferences are loaded
  useEffect(() => {
    if (!loading && Object.keys(preferences).length > 0) {
      setFormData(preferences)
    } else {
      // Use mock data for demo
      setFormData(mockUserPreferences)
    }
  }, [preferences, loading])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  
  const handleApparelSizeChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      apparelSizes: {
        ...formData.apparelSizes,
        [name]: value,
      },
    })
  }
  
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      priceRange: {
        ...formData.priceRange,
        [name]: parseInt(value, 10),
      },
    })
  }
  
  const handleCheckboxChange = (e, category) => {
    const { checked } = e.target
    if (checked) {
      setFormData({
        ...formData,
        preferredCategories: [...formData.preferredCategories, category],
      })
    } else {
      setFormData({
        ...formData,
        preferredCategories: formData.preferredCategories.filter(c => c !== category),
      })
    }
  }
  
  const handleVendorChange = (e, vendor) => {
    const { checked } = e.target
    if (checked) {
      setFormData({
        ...formData,
        preferredVendors: [...formData.preferredVendors, vendor],
      })
    } else {
      setFormData({
        ...formData,
        preferredVendors: formData.preferredVendors.filter(v => v !== vendor),
      })
    }
  }
  
  const handleShippingChange = (e, option) => {
    const { checked } = e.target
    if (checked) {
      setFormData({
        ...formData,
        shippingPreferences: [...formData.shippingPreferences, option],
      })
    } else {
      setFormData({
        ...formData,
        shippingPreferences: formData.shippingPreferences.filter(o => o !== option),
      })
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateUserPreferences(formData))
      .then(() => {
        toast.success('Preferences updated successfully!')
      })
  }

  if (loading) {
    return <Loading fullPage />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Preferences</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Preferences */}
            <div>
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
                General Preferences
              </h2>
              
              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Country</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Price Range
                </label>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label htmlFor="min" className="block text-xs text-gray-500 mb-1">
                      Min ($)
                    </label>
                    <input
                      type="number"
                      id="min"
                      name="min"
                      min="0"
                      value={formData.priceRange.min}
                      onChange={handlePriceRangeChange}
                      className="input"
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="max" className="block text-xs text-gray-500 mb-1">
                      Max ($)
                    </label>
                    <input
                      type="number"
                      id="max"
                      name="max"
                      min="0"
                      value={formData.priceRange.max}
                      onChange={handlePriceRangeChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Categories
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mockCategories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={formData.preferredCategories.includes(category.name)}
                        onChange={(e) => handleCheckboxChange(e, category.name)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Size and Vendor Preferences */}
            <div>
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
                Size Preferences
              </h2>
              
              <div className="mb-4">
                <label htmlFor="tops" className="block text-sm font-medium text-gray-700 mb-1">
                  Tops Size
                </label>
                <select
                  id="tops"
                  name="tops"
                  value={formData.apparelSizes.tops}
                  onChange={handleApparelSizeChange}
                  className="input"
                >
                  <option value="">Select Size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="bottoms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bottoms Size
                </label>
                <select
                  id="bottoms"
                  name="bottoms"
                  value={formData.apparelSizes.bottoms}
                  onChange={handleApparelSizeChange}
                  className="input"
                >
                  <option value="">Select Size</option>
                  <option value="28">28</option>
                  <option value="30">30</option>
                  <option value="32">32</option>
                  <option value="34">34</option>
                  <option value="36">36</option>
                  <option value="38">38</option>
                  <option value="40">40</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="shoes" className="block text-sm font-medium text-gray-700 mb-1">
                  Shoes Size
                </label>
                <select
                  id="shoes"
                  name="shoes"
                  value={formData.apparelSizes.shoes}
                  onChange={handleApparelSizeChange}
                  className="input"
                >
                  <option value="">Select Size</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
              
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
                Vendor Preferences
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Vendors
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vendor-techvillage"
                      checked={formData.preferredVendors.includes('TechVillage')}
                      onChange={(e) => handleVendorChange(e, 'TechVillage')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="vendor-techvillage" className="ml-2 text-sm text-gray-700">
                      TechVillage
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vendor-fashionhub"
                      checked={formData.preferredVendors.includes('FashionHub')}
                      onChange={(e) => handleVendorChange(e, 'FashionHub')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="vendor-fashionhub" className="ml-2 text-sm text-gray-700">
                      FashionHub
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vendor-sportspace"
                      checked={formData.preferredVendors.includes('SportSpace')}
                      onChange={(e) => handleVendorChange(e, 'SportSpace')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="vendor-sportspace" className="ml-2 text-sm text-gray-700">
                      SportSpace
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vendor-homeessentials"
                      checked={formData.preferredVendors.includes('HomeEssentials')}
                      onChange={(e) => handleVendorChange(e, 'HomeEssentials')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="vendor-homeessentials" className="ml-2 text-sm text-gray-700">
                      HomeEssentials
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Preferences
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shipping-free"
                      checked={formData.shippingPreferences.includes('Free')}
                      onChange={(e) => handleShippingChange(e, 'Free')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="shipping-free" className="ml-2 text-sm text-gray-700">
                      Free Shipping
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shipping-express"
                      checked={formData.shippingPreferences.includes('Express')}
                      onChange={(e) => handleShippingChange(e, 'Express')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="shipping-express" className="ml-2 text-sm text-gray-700">
                      Express Shipping
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserPreferences