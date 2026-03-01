const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const categories = [
  {
    iconKey: 'FiHome',
    title: 'Residential',
    count: '500+',
    description: 'Apartments, Villas & Houses',
    link: '/properties?category=residential',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    iconKey: 'FaBuilding',
    title: 'Commercial',
    count: '200+',
    description: 'Offices & Retail Spaces',
    link: '/properties?category=commercial',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    iconKey: 'FiShoppingBag',
    title: 'For Rent',
    count: '300+',
    description: 'Rental Properties',
    link: '/properties?type=rent',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    iconKey: 'FiTrendingUp',
    title: 'New Projects',
    count: '50+',
    description: 'Latest Developments',
    link: '/properties?featured=true',
    gradient: 'from-green-500 to-teal-500'
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate');
    
    // Clear existing categories
    await Category.deleteMany();
    
    await Category.insertMany(categories);
    console.log('✅ Dummy Categories Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedCategories();
