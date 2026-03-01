const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ContactContent = require('./models/ContactContent');

dotenv.config();

const content = {
  phone: '+1 (800) REAL EST',
  email: 'concierge@estatehub.com',
  address: 'Fifth Avenue, Manhattan, NY',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.472227123985!2d-73.98471968459422!3d40.7484405793284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620311746524!5m2!1sen!2sus',
  workingHours: 'Mon - Fri: 08:00 - 20:00',
  faqs: [
    {
      question: "How quickly can I schedule a property viewing?",
      answer: "We typically arrange viewings within 24-48 hours of your request. For premier properties, we can often facilitate same-day private viewings for qualified clients."
    },
    {
      question: "Do you offer virtual consultations?",
      answer: "Yes, we provide immersive virtual tours and video consultations worldwide via Zoom or FaceTime, ensuring you can explore properties from anywhere in the world."
    },
    {
      question: "What documents do I need to begin the buying process?",
      answer: "Initially, only a government-issued ID and proof of funds or a pre-approval letter are required. Our concierge will guide you through the specific requirements for your target location."
    },
    {
      question: "Can you assist with international relocations?",
      answer: "Our Global Relocation Team specializes in seamless international transitions, including legal referrals, school placements, and logistics management."
    }
  ]
};

const seedContact = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate');
    await ContactContent.deleteMany();
    await ContactContent.create(content);
    console.log('✅ Contact Content Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedContact();
