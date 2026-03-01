const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Property = require('./models/Property');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate');

const seedData = async () => {
  try {
    await Property.deleteMany();
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);
    const agent = await User.create({
      name: 'Nabeel Ahmed',
      email: 'agent@estatehub.com',
      password: hashedPassword,
      role: 'agent',
      company: 'EstateHub Premium Realty',
      phone: '+1 (555) 123-4567',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      rating: 4.9
    });

    const propertyTemplates = [
      { propertyType: 'villa', city: 'Los Angeles', location: 'Beverly Hills' },
      { propertyType: 'apartment', city: 'New York', location: 'Manhattan' },
      { propertyType: 'house', city: 'Miami', location: 'Coconut Grove' },
      { propertyType: 'apartment', city: 'Chicago', location: 'Lincoln Park' },
      { propertyType: 'villa', city: 'Miami Beach', location: 'Star Island' },
      { propertyType: 'house', city: 'Austin', location: 'West Lake Hills' },
      { propertyType: 'office', city: 'San Francisco', location: 'Financial District' },
      { propertyType: 'house', city: 'Seattle', location: 'Queen Anne' },
      { propertyType: 'apartment', city: 'Boston', location: 'Back Bay' },
      { propertyType: 'villa', city: 'Aspen', location: 'Red Mountain' },
      { propertyType: 'land', city: 'Las Vegas', location: 'Summerlin' },
      { propertyType: 'house', city: 'Nashville', location: 'Belle Meade' },
      { propertyType: 'apartment', city: 'Atlanta', location: 'Buckhead' },
      { propertyType: 'villa', city: 'Malibu', location: 'Broad Beach' },
      { propertyType: 'house', city: 'Denver', location: 'Cherry Creek' },
      { propertyType: 'office', city: 'Houston', location: 'Downtown' },
      { propertyType: 'apartment', city: 'Philadelphia', location: 'Rittenhouse Square' },
      { propertyType: 'villa', city: 'Palm Springs', location: 'Old Las Palmas' },
      { propertyType: 'house', city: 'Charleston', location: 'Historic District' },
      { propertyType: 'apartment', city: 'San Diego', location: 'La Jolla' }
    ];

    const unsplashImages = [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
      'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
      'https://images.unsplash.com/photo-1600570997594-3bc11144078c',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0'
    ];

    const properties = propertyTemplates.map((template, i) => ({
      title: `${template.location} ${template.propertyType.charAt(0).toUpperCase() + template.propertyType.slice(1)}`,
      description: `A stunning ${template.propertyType} located in the heart of ${template.location}, ${template.city}. This property offers luxury living with state-of-the-art facilities and breathtaking views.`,
      propertyType: template.propertyType,
      listingType: i % 3 === 0 ? 'rent' : 'sale',
      price: Math.floor(Math.random() * (10000000 - 500000 + 1) + 500000),
      location: `${Math.floor(Math.random() * 900) + 100} Luxury Ave, ${template.location}`,
      city: template.city,
      bedrooms: Math.floor(Math.random() * 6) + 2,
      bathrooms: Math.floor(Math.random() * 5) + 2,
      area: Math.floor(Math.random() * 8000) + 1500,
      parking: Math.floor(Math.random() * 4) + 1,
      yearBuilt: 2010 + Math.floor(Math.random() * 14),
      listingId: `EH-${10000 + i}`,
      agent: agent._id,
      featured: i < 6,
      images: [
        `${unsplashImages[i % 10]}?w=1200`,
        `${unsplashImages[(i + 1) % 10]}?w=1200`,
        `${unsplashImages[(i + 2) % 10]}?w=1200`
      ],
      amenities: [
        { name: 'Swimming Pool', iconKey: 'pool' },
        { name: 'Smart Home', iconKey: 'smart' },
        { name: 'Gym', iconKey: 'gym' }
      ],
      nearby: [
        { name: 'Elite School', distance: '0.5 miles', type: 'school' },
        { name: 'City Hospital', distance: '1.2 miles', type: 'hospital' },
        { name: 'Metro Station', distance: '0.3 miles', type: 'transport' }
      ]
    }));

    await Property.insertMany(properties);
    console.log('✅ 20 Properties Seeded Successfully');

    // Seed About Content
    const AboutContent = require('./models/AboutContent');
    await AboutContent.deleteMany();
    await AboutContent.create({
      hero: {
        title: "Redefining Real Estate",
        subtitle: "We are more than just a real estate agency. We are your partners in finding the perfect place to call home.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600"
      },
      mission: {
        title: "Helping You Find Your Perfect Match",
        description: "At EstateHub, we believe that finding a home is more than just a transaction. It's about finding a space where memories are made and dreams are realized. Our mission is to simplify the real estate process through technology, transparency, and personalized service.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
        points: [
          'Transparent and honest dealings',
          'Client-first approach',
          'Expert market knowledge',
          'Dedicated support team'
        ]
      },
      stats: [
        { label: 'Years of Experience', value: 15, suffix: '+' },
        { label: 'Properties Sold', value: 2500, suffix: '+' },
        { label: 'Happy Clients', value: 5000, suffix: '+' },
        { label: 'Awards Won', value: 25, suffix: '+' }
      ],
      values: [
        {
          iconKey: 'FiUsers',
          title: 'Client Focused',
          description: 'Your needs are our top priority. We listen, understand, and deliver results that exceed expectations.'
        },
        {
          iconKey: 'FiTarget',
          title: 'Market Experts',
          description: 'Deep local knowledge combined with data-driven insights to give you the competitive edge.'
        },
        {
          iconKey: 'FiAward',
          title: 'Excellence',
          description: 'We strive for excellence in every interaction, ensuring a seamless and professional experience.'
        }
      ],
      team: [
        {
          name: 'Sarah Johnson',
          role: 'CEO & Founder',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'
        },
        {
          name: 'Michael Chen',
          role: 'Head of Sales',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
        },
        {
          name: 'Emily Davis',
          role: 'Senior Agent',
          image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'
        },
        {
          name: 'David Wilson',
          role: 'Marketing Director',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
        }
      ]
    });
    console.log('✅ About Content Seeded Successfully');

    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
