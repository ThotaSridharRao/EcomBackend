const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const productsData = [
  // Electronics
  { name: "Noise Cancelling Headphones", price: 19999, category: "Electronics", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80", description: "Immerse yourself in music with industry-leading noise cancellation.", specs: ["30h Battery", "Bluetooth 5.0", "Over-ear"], stock: 50 },
  { name: "4K Action Camera", price: 15999, category: "Electronics", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80", description: "Capture your adventures in stunning 4K resolution.", specs: ["4K 60fps", "Waterproof", "Touchscreen"], stock: 50 },
  { name: "Bluetooth Speaker", price: 6399, category: "Electronics", img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80", description: "Portable speaker with powerful bass and long battery life.", specs: ["12h Playtime", "Water Resistant", "Stereo Sound"], stock: 50 },
  { name: "Drone with Camera", price: 39999, category: "Electronics", img: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=600&q=80", description: "Professional grade drone for aerial photography.", specs: ["4K Camera", "5km Range", "30min Flight"], stock: 50 },

  // Fashion
  { name: "Classic Denim Jacket", price: 6999, category: "Fashion", img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80", description: "Timeless denim jacket for casual wear.", specs: ["100% Cotton", "Blue Wash"], stock: 50 },
  { name: "Summer Floral Dress", price: 4799, category: "Fashion", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80", description: "Light and breezy dress for summer days.", specs: ["Floral Pattern", "Midi Length"], stock: 50 },
  { name: "Leather Boots", price: 11999, category: "Fashion", img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80", description: "Durable and stylish leather boots.", specs: ["Genuine Leather", "Ankle height"], stock: 50 },

  // Home & Kitchen
  { name: "Espresso Machine", price: 23999, category: "Home & Kitchen", img: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80", description: "Barista quality coffee at home.", specs: ["15 Bar Pressure", "Milk Frother"], stock: 50 },
  { name: "Stand Mixer", price: 15999, category: "Home & Kitchen", img: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&w=600&q=80", description: "Perfect for baking and mixing.", specs: ["5L Bowl", "Multi-speed"], stock: 50 },

  // Beauty
  { name: "Luxury Face Cream", price: 3599, category: "Beauty", img: "https://images.unsplash.com/photo-1612817288484-92913477a8ae?auto=format&fit=crop&w=600&q=80", description: "Rejuvenating face cream.", specs: ["50ml", "Anti-aging"], stock: 50 },
  { name: "Organic Shampoo", price: 1999, category: "Beauty", img: "https://images.unsplash.com/photo-1585232351009-31336193e63d?auto=format&fit=crop&w=600&q=80", description: "Gentle organic shampoo.", specs: ["Sulfate Free", "300ml"], stock: 50 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Products Cleared');

    // Insert new products
    await Product.insertMany(productsData);
    console.log('Products Seeded Successfully');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
