import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/slices/authSlice'
import { mockUser } from '../services/mockData'
import Loading from '../components/ui/Loading'

const UserProfile = () => {
  const user = useSelector(selectUser)
  const [loading, setLoading] = useState(true)
  const [localUser, setLocalUser] = useState(null)
  
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setLocalUser(user || mockUser)
      setLoading(false)
    }, 500)
  }, [user])

  if (loading) {
    return <Loading fullPage />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <img
                  src={localUser.avatar}
                  alt={localUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-xl font-bold">{localUser.name}</h2>
              <p className="text-gray-600 mb-4">{localUser.email}</p>
              
              <p className="text-sm text-gray-500">
                Member since {new Date(localUser.memberSince).toLocaleDateString()}
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Edit Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Change Password
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Profile Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Account Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                <p className="text-gray-900">{localUser.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                <p className="text-gray-900">{localUser.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                <p className="text-gray-900">Not provided</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                <p className="text-gray-900">{new Date(localUser.memberSince).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile