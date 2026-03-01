const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Partner = require('./models/Partner');

dotenv.config();

const partners = [
  { name: 'TechHome', icon: '🏠' },
  { name: 'EcoBuild', icon: '🌿' },
  { name: 'UrbanDesign', icon: '🏙️' },
  { name: 'SmartLiving', icon: '💡' },
  { name: 'FutureSpace', icon: '🚀' },
  { name: 'GreenHouse', icon: '🌲' },
  { name: 'SkyHigh', icon: '☁️' },
  { name: 'ModernEst', icon: '🏢' },
];

const seedPartners = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate');
    
    // Clear existing partners first to avoid duplicates if re-run
    await Partner.deleteMany();
    
    await Partner.insertMany(partners);
    console.log('✅ Dummy Partners Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedPartners();
