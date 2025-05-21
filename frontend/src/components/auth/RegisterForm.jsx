import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { register, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice'

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required'),
  name: Yup.string()
    .required('Full name is required'),
  age: Yup.number()
    .required('Age is required')
    .min(13, 'Must be at least 13 years old')
    .max(120, 'Invalid age'),
  gender: Yup.string()
    .required('Gender is required'),
  country: Yup.string()
    .required('Country is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  preference: Yup.object().shape({
    style: Yup.string().required('Style preference is required'),
    color: Yup.string().required('Color preference is required'),
    size: Yup.string().required('Size preference is required'),
  }),
})

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (values) => {
    const result = await dispatch(register(values))
    if (register.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <div className="w-full max-w-md">
      <Formik
        initialValues={{
          username: '',
          name: '',
          age: '',
          gender: '',
          country: '',
          password: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary-600">Create Account</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Field
                type="text"
                name="username"
                id="username"
                className={`input ${
                  errors.username && touched.username ? 'border-red-500' : ''
                }`}
                placeholder="Choose a username"
              />
              <ErrorMessage
                name="username"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className={`input ${
                  errors.name && touched.name ? 'border-red-500' : ''
                }`}
                placeholder="Enter your full name"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <Field
                  type="number"
                  name="age"
                  id="age"
                  className={`input ${
                    errors.age && touched.age ? 'border-red-500' : ''
                  }`}
                  placeholder="Your age"
                />
                <ErrorMessage
                  name="age"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Field
                  as="select"
                  name="gender"
                  id="gender"
                  className={`input ${
                    errors.gender && touched.gender ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <Field
                as="select"
                name="country"
                id="country"
                className={`input ${
                  errors.country && touched.country ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
              </Field>
              <ErrorMessage
                name="country"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  className={`input pr-10 ${
                    errors.password && touched.password ? 'border-red-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span className="text-sm">Hide</span>
                  ) : (
                    <span className="text-sm">Show</span>
                  )}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn btn-primary w-full flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default RegisterForm