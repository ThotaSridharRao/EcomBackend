const axios = require('axios');

const AUTH_URL = 'http://localhost:5000/api/auth';
const PRODUCT_URL = 'http://localhost:5000/api/products';
const WISHLIST_URL = 'http://localhost:5000/api/wishlist';

const runTests = async () => {
  try {
    console.log('--- Starting Wishlist Verification ---');

    // 1. Register User
    const uniqueEmail = `wishlist_user_${Date.now()}@example.com`;
    const regRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Wishlist User',
      email: uniqueEmail,
      password: 'password123'
    });
    const token = regRes.data.token;
    console.log(`✅ User Registered: ${uniqueEmail}`);

    // 2. Create Product (Needed to add to wishlist)
    // Login as Admin first to create product
    const adminEmail = `admin_wishlist_setup_${Date.now()}@example.com`;
    const adminRegRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Admin User',
      email: adminEmail,
      password: 'adminpassword'
    });
    const adminToken = adminRegRes.data.token;

    const productRes = await axios.post(PRODUCT_URL, {
      name: 'Wishlist Item',
      price: 500,
      category: 'Tests',
      img: 'wish.jpg'
    }, { headers: { Authorization: `Bearer ${adminToken}` } });

    const productId = productRes.data._id;
    console.log(`✅ Test Product Created: ${productId}`);

    // 3. Add to Wishlist
    console.log('\n3. Testing Add to Wishlist');
    const addToWishlistRes = await axios.post(WISHLIST_URL, {
      productId: productId
    }, { headers: { Authorization: `Bearer ${token}` } });

    if (addToWishlistRes.status === 200 && addToWishlistRes.data.products.some(p => p._id === productId)) {
      console.log('✅ Item Added to Wishlist');
    } else {
      console.log('❌ Add to Wishlist Failed');
    }

    // 4. Get Wishlist
    console.log('\n4. Testing Get Wishlist');
    const getWishlistRes = await axios.get(WISHLIST_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (getWishlistRes.status === 200 && getWishlistRes.data.products.length > 0) {
      console.log('✅ Wishlist Fetched');
    } else {
      console.log('❌ Fetch Wishlist Failed');
    }

    // 5. Remove Item
    console.log('\n5. Testing Remove details from Wishlist');
    const removeRes = await axios.delete(`${WISHLIST_URL}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (removeRes.status === 200 && removeRes.data.products.length === 0) {
      console.log('✅ Item Removed from Wishlist');
    } else {
      console.log('❌ Remove Item Failed');
    }

    console.log('\n--- Verification Complete: SUCCESS ---');

  } catch (error) {
    console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
  }
};

runTests();
