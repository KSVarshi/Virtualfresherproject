import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  selectIsAuthenticated, 
  selectUser, 
  logout 
} from '../../store/slices/authSlice'
import { selectCartItemCount } from '../../store/slices/cartSlice'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const cartItemCount = useSelector(selectCartItemCount)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen || profileMenuOpen) {
        if (!event.target.closest('.mobile-menu') && !event.target.closest('.profile-menu') &&
            !event.target.closest('.mobile-menu-button') && !event.target.closest('.profile-button')) {
          setMobileMenuOpen(false)
          setProfileMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen, profileMenuOpen])

  const handleLogout = () => {
    dispatch(logout())
    setProfileMenuOpen(false)
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className={`text-2xl font-bold ${isScrolled ? 'text-primary-600' : 'text-primary-600'}`}>
              ShopSmart AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${
                isScrolled ? 'text-gray-700' : 'text-gray-800'
              } hover:text-primary-600 transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`${
                isScrolled ? 'text-gray-700' : 'text-gray-800'
              } hover:text-primary-600 transition-colors`}
            >
              Shop
            </Link>
            {isAuthenticated && (
              <Link 
                to="/preferences" 
                className={`${
                  isScrolled ? 'text-gray-700' : 'text-gray-800'
                } hover:text-primary-600 transition-colors`}
              >
                Preferences
              </Link>
            )}
          </nav>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full ${
                isScrolled ? 'hover:bg-gray-100' : 'hover:bg-gray-200/30'
              }`}
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <Link 
              to="/cart" 
              className={`p-2 rounded-full relative ${
                isScrolled ? 'hover:bg-gray-100' : 'hover:bg-gray-200/30'
              }`}
              aria-label="Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Authentication */}
            {isAuthenticated ? (
              <div className="relative profile-button">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center focus:outline-none"
                  aria-label="User Profile"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-600">
                    <img
                      src={user?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 profile-menu">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/preferences"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Preferences
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`${
                  isScrolled
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                } px-4 py-2 rounded-md transition-colors`}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md mobile-menu-button"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-md shadow-lg mobile-menu">
            <Link
              to="/"
              className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/preferences"
                  className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Preferences
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}

        {/* Search Bar */}
        {searchOpen && (
          <div className="mt-4 relative animate-fade-in">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full p-2 pl-10 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header