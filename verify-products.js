const axios = require('axios');

const AUTH_URL = 'http://localhost:5000/api/auth';
const PRODUCT_URL = 'http://localhost:5000/api/products';

const runTests = async () => {
  try {
    console.log('--- Starting Product Verification ---');

    // 1. Create Admin User
    const uniqueEmail = `admin_${Date.now()}@example.com`;
    console.log(`\n1. Registering Admin with email: ${uniqueEmail}`);
    const regRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Admin User',
      email: uniqueEmail,
      password: 'adminpassword'
    });

    const token = regRes.data.token;
    console.log('✅ Admin Registered');

    // 2. Create Product
    console.log('\n2. Testing Create Product');
    const productData = {
      name: 'Test Gadget',
      price: 5000,
      category: 'Electronics',
      img: 'http://example.com/gadget.jpg',
      description: 'A test gadget',
      stock: 100
    };

    const createRes = await axios.post(PRODUCT_URL, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (createRes.status === 201 && createRes.data.name === 'Test Gadget') {
      console.log('✅ Product Created');
    } else {
      console.log('❌ Product Creation Failed');
    }

    const productId = createRes.data._id;

    // 3. Get Products
    console.log('\n3. Testing Get Products');
    const listRes = await axios.get(PRODUCT_URL);
    if (listRes.status === 200 && listRes.data.length > 0) {
      console.log(`✅ Products Fetched (Count: ${listRes.data.length})`);
    } else {
      console.log('❌ Fetch Products Failed');
    }

    // 4. Update Product
    console.log('\n4. Testing Update Product');
    const updateRes = await axios.put(`${PRODUCT_URL}/${productId}`, {
      price: 6000,
      stock: 90
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (updateRes.status === 200 && updateRes.data.price === 6000) {
      console.log('✅ Product Updated');
    } else {
      console.log('❌ Product Update Failed');
    }

    // 5. Delete Product
    console.log('\n5. Testing Delete Product');
    const deleteRes = await axios.delete(`${PRODUCT_URL}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (deleteRes.status === 200) {
      console.log('✅ Product Deleted');
    } else {
      console.log('❌ Product Delete Failed');
    }

    console.log('\n--- Verification Complete: SUCCESS ---');

  } catch (error) {
    console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
  }
};

runTests();
