// Mock data for development purposes
export const mockProducts = [
  {
    id: '1',
    name: 'Premium Leather Jacket',
    description: 'A premium quality leather jacket made from genuine full-grain leather. Perfect for all seasons.',
    price: 299.99,
    images: [
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg',
      'https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg',
    ],
    category: 'Apparel',
    subcategory: 'Jackets',
    rating: 4.8,
    reviews: 124,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Tan'],
    brand: 'LuxeLeather',
    inStock: true,
    features: [
      'Genuine full-grain leather',
      'Quilted lining for warmth',
      'Multiple pockets',
      'Durable YKK zippers',
    ],
  },
  {
    id: '2',
    name: 'Classic Denim Jeans',
    description: 'Premium quality denim jeans with perfect fit and comfort.',
    price: 89.99,
    images: [
      'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg',
      'https://images.pexels.com/photos/65676/nanjing-studio-jeans-65676.jpeg',
    ],
    category: 'Apparel',
    subcategory: 'Pants',
    rating: 4.6,
    reviews: 89,
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black', 'Gray'],
    brand: 'DenimCo',
    inStock: true,
    features: [
      'Premium denim fabric',
      'Comfortable stretch fit',
      'Reinforced stitching',
      'Classic 5-pocket design',
    ],
  },
  {
    id: '3',
    name: 'Cotton Casual Shirt',
    description: 'Comfortable cotton casual shirt perfect for everyday wear.',
    price: 49.99,
    images: [
      'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg',
      'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg',
    ],
    category: 'Apparel',
    subcategory: 'Shirts',
    rating: 4.7,
    reviews: 156,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black'],
    brand: 'CasualWear',
    inStock: true,
    features: [
      '100% cotton material',
      'Breathable fabric',
      'Regular fit',
      'Easy care fabric',
    ],
  },
  {
    id: '4',
    name: 'Summer Floral Dress',
    description: 'Beautiful floral print dress perfect for summer occasions.',
    price: 79.99,
    images: [
      'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg',
      'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg',
    ],
    category: 'Apparel',
    subcategory: 'Dresses',
    rating: 4.9,
    reviews: 78,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Print', 'Blue Print', 'Pink Print'],
    brand: 'StyleChic',
    inStock: true,
    features: [
      'Lightweight fabric',
      'Floral print design',
      'A-line cut',
      'Perfect for summer',
    ],
  },
  {
    id: '5',
    name: 'Wool Winter Coat',
    description: 'Elegant wool coat to keep you warm during winter months.',
    price: 199.99,
    images: [
      'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg',
      'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg',
    ],
    category: 'Apparel',
    subcategory: 'Coats',
    rating: 4.8,
    reviews: 92,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Black', 'Navy'],
    brand: 'WinterStyle',
    inStock: true,
    features: [
      'Premium wool blend',
      'Full lining',
      'Double-breasted design',
      'Deep pockets',
    ],
  },
];

export const mockCategories = [
  { id: '1', name: 'Apparel', count: 42 },
  { id: '2', name: 'Shirts', count: 15 },
  { id: '3', name: 'Pants', count: 12 },
  { id: '4', name: 'Dresses', count: 8 },
  { id: '5', name: 'Jackets', count: 7 },
];

export const mockVendors = [
  { id: '1', name: 'FashionHub', rating: 4.6, productCount: 96 },
  { id: '2', name: 'StyleSpace', rating: 4.7, productCount: 82 },
  { id: '3', name: 'LuxuryGoods', rating: 4.9, productCount: 64 },
];

export const mockPriceComparisons = [
  { 
    productId: '1',
    vendors: [
      { name: 'TechVillage', price: 299.99, inStock: true, link: 'https://example.com/techvillage/product1' },
      { name: 'FashionHub', price: 289.99, inStock: true, link: 'https://example.com/fashionhub/product1' },
      { name: 'LuxuryGoods', price: 319.99, inStock: true, link: 'https://example.com/luxurygoods/product1' }
    ]
  },
  { 
    productId: '2',
    vendors: [
      { name: 'TechVillage', price: 199.99, inStock: true, link: 'https://example.com/techvillage/product2' },
      { name: 'SportSpace', price: 189.99, inStock: true, link: 'https://example.com/sportspace/product2' },
      { name: 'HomeEssentials', price: 209.99, inStock: false, link: 'https://example.com/homeessentials/product2' }
    ]
  },
];

export const mockCart = {
  items: [
    {
      id: '1',
      productId: '1',
      name: 'Premium Leather Jacket',
      price: 299.99,
      quantity: 1,
      image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg',
      size: 'M',
      color: 'Black',
    },
    {
      id: '2',
      productId: '3',
      name: 'Wireless Noise-Cancelling Headphones',
      price: 249.99,
      quantity: 1,
      image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg',
      color: 'Black',
    },
  ],
  subtotal: 549.98,
  discount: 0,
  total: 549.98,
};

export const mockUserPreferences = {
  country: 'United States',
  preferredVendors: ['TechVillage', 'FashionHub'],
  gender: 'Male',
  apparelSizes: {
    tops: 'M',
    bottoms: '32',
    shoes: '10',
  },
  priceRange: {
    min: 50,
    max: 500,
  },
  preferredCategories: ['Electronics', 'Apparel', 'Footwear'],
  shippingPreferences: ['Express', 'Free'],
};

export const mockRecommendations = [
  {
    id: '7',
    name: 'Smart Home Speaker',
    price: 129.99,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg',
    category: 'Electronics',
  },
  {
    id: '8',
    name: 'Designer Watch',
    price: 199.99,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
    category: 'Accessories',
  },
  {
    id: '9',
    name: 'Premium Denim Jeans',
    price: 89.99,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg',
    category: 'Apparel',
  },
  {
    id: '10',
    name: 'Wireless Earbuds',
    price: 149.99,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    category: 'Electronics',
  },
];

export const mockUser = {
  id: '123456',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  memberSince: '2022-03-15',
};