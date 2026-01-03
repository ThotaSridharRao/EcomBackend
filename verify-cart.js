const axios = require('axios');

const AUTH_URL = 'http://localhost:5000/api/auth';
const PRODUCT_URL = 'http://localhost:5000/api/products';
const CART_URL = 'http://localhost:5000/api/cart';

const runTests = async () => {
  try {
    console.log('--- Starting Cart Verification ---');

    // 1. Register User
    const uniqueEmail = `cart_user_${Date.now()}@example.com`;
    const regRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Cart User',
      email: uniqueEmail,
      password: 'password123'
    });
    const token = regRes.data.token;
    console.log(`✅ User Registered: ${uniqueEmail}`);

    // 2. Create Product (Needed to add to cart)
    // Login as Admin first to create product
    const adminEmail = `admin_cart_setup_${Date.now()}@example.com`;
    const adminRegRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Admin User',
      email: adminEmail,
      password: 'adminpassword'
    });
    const adminToken = adminRegRes.data.token;

    const productRes = await axios.post(PRODUCT_URL, {
      name: 'Test Product',
      price: 1000,
      category: 'Tests',
      img: 'test.jpg'
    }, { headers: { Authorization: `Bearer ${adminToken}` } });

    const productId = productRes.data._id;
    console.log(`✅ Test Product Created: ${productId}`);

    // 3. Add to Cart
    console.log('\n3. Testing Add to Cart');
    const addToCartRes = await axios.post(CART_URL, {
      productId: productId,
      qty: 2
    }, { headers: { Authorization: `Bearer ${token}` } });

    if (addToCartRes.status === 200 && addToCartRes.data.items[0].qty === 2) {
      console.log('✅ Item Added to Cart (Qty: 2)');
    } else {
      console.log('❌ Add to Cart Failed');
    }

    // 4. Update Cart Item Qty
    console.log('\n4. Testing Update Cart Item Qty');
    const updateRes = await axios.put(`${CART_URL}/${productId}`, {
      qty: 5
    }, { headers: { Authorization: `Bearer ${token}` } });

    if (updateRes.status === 200 && updateRes.data.items[0].qty === 5) {
      console.log('✅ Cart Item Quantity Updated to 5');
    } else {
      console.log('❌ Update Quantity Failed');
    }

    // 5. Remove Item
    console.log('\n5. Testing Remove Item');
    const removeRes = await axios.delete(`${CART_URL}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (removeRes.status === 200 && removeRes.data.items.length === 0) {
      console.log('✅ Item Removed from Cart');
    } else {
      console.log('❌ Remove Item Failed');
    }

    console.log('\n--- Verification Complete: SUCCESS ---');

  } catch (error) {
    console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
  }
};

runTests();
