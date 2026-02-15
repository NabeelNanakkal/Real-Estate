# EstateHub - Real Estate Platform

A fully dynamic, futuristic real estate website with a comprehensive admin dashboard for managing property listings.

## 🚀 Features

### Frontend
- **Modern UI/UX** with Tailwind CSS
- **Responsive Design** for all devices
- **Advanced Search** with filters
- **Property Listings** with grid/list views
- **Property Details** with image gallery
- **User Authentication** (Login/Register)
- **Admin Dashboard** for property management
- **Analytics** and insights
- **Inquiry Management**

### Backend
- **RESTful API** with Express.js
- **MongoDB** database
- **JWT Authentication**
- **Role-based Authorization**
- **Property CRUD Operations**
- **Advanced Search & Filters**
- **Image Upload** support (Cloudinary ready)

## 📦 Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- Swiper
- Leaflet (Maps)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary (for image uploads)

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Frontend Setup

```bash
# Navigate to project root
cd REALESTATE

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file and configure
# See .env.example for required variables

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realestate
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Protected)
- `PUT /api/properties/:id` - Update property (Protected)
- `DELETE /api/properties/:id` - Delete property (Protected)

### Inquiries
- `POST /api/inquiries` - Submit inquiry
- `GET /api/inquiries` - Get all inquiries (Protected)
- `PUT /api/inquiries/:id` - Update inquiry status (Protected)

## 🎨 Design Features

- **Glassmorphism** effects
- **Gradient backgrounds**
- **Smooth animations**
- **Hover effects**
- **Modern typography** (Inter font)
- **Responsive layouts**
- **Dark theme elements**

## 📱 Pages

1. **Home** - Hero section, search, featured properties, categories
2. **Property Listings** - Filterable property grid/list
3. **Property Details** - Full property information with gallery
4. **Login/Register** - Authentication pages
5. **Dashboard** - Admin panel with:
   - Overview with statistics
   - Property management
   - Add/Edit properties
   - Analytics
   - Inquiry management

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Render/Railway/DigitalOcean)
```bash
# Set environment variables
# Deploy with start command: npm start
```

## 📝 License

MIT License

## 👤 Author

Your Name

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
