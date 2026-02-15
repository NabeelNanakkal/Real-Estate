import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX } from 'react-icons/fi';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    listingType: 'sale',
    price: '',
    location: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnished: false,
    parking: '',
    amenities: [],
  });

  const [images, setImages] = useState([]);

  const amenitiesList = ['Swimming Pool', 'Garden', 'Garage', 'Security System', 'Smart Home', 'Gym', 'Balcony', 'Elevator'];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Property Data:', formData);
    console.log('Images:', images);
    // API call will be added later
    navigate('/dashboard/properties');
  };

  const toggleAmenity = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity]
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-1">Fill in the details to list a new property</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Modern Luxury Villa"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="4"
                placeholder="Describe your property..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="office">Office</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
              <select
                value={formData.listingType}
                onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                className="input-field"
                required
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input-field"
                placeholder="1250000"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field"
                placeholder="123 Main Street"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input-field"
                placeholder="Los Angeles"
                required
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="input-field"
                placeholder="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="input-field"
                placeholder="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area (sqft)</label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="input-field"
                placeholder="3500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parking Spaces</label>
              <input
                type="number"
                value={formData.parking}
                onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                className="input-field"
                placeholder="2"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.furnished}
                  onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                  className="w-5 h-5 text-primary rounded"
                />
                <span className="text-gray-700 font-medium">Furnished</span>
              </label>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-5 h-5 text-primary rounded"
                />
                <span className="text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Property Images</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop images here, or click to select</p>
            <input type="file" multiple accept="image/*" className="hidden" />
            <button type="button" className="btn-secondary mt-4">
              Select Images
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/dashboard/properties')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Publish Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
