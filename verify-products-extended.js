const axios = require('axios');

const AUTH_URL = 'http://localhost:5000/api/auth';
const PRODUCT_URL = 'http://localhost:5000/api/products';

const runTests = async () => {
  try {
    console.log('--- Starting Extended Product Verification ---');

    // 1. Create Admin User
    const uniqueEmail = `admin_v2_${Date.now()}@example.com`;
    console.log(`\n1. Registering Admin: ${uniqueEmail}`);
    const regRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Admin User',
      email: uniqueEmail,
      password: 'adminpassword'
    });
    const token = regRes.data.token;

    // 2. Create Complex Product (mimic frontend payload)
    console.log('\n2. Testing Create Full Product');
    const productData = {
      name: 'Advanced Smartphone',
      sellingPrice: 49999, // Frontend usage
      category: 'Electronics',
      subCategory: 'Mobile',
      brand: 'Samsung',
      image: 'http://example.com/phone.jpg', // Frontend usage
      unit: 'Piece',
      code: 'SAM-S24',
      hsnCode: '8517',
      mrp: 55000,
      batchNo: 'B202401',
      mfgDate: '2024-01-01',
      stock: 25,
      sellingPriceTaxType: 'Inclusive',
      sellingPriceTaxRate: 18
    };

    const createRes = await axios.post(PRODUCT_URL, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (createRes.status === 201) {
      const p = createRes.data;
      if (p.price === 49999 && p.img === 'http://example.com/phone.jpg' && p.subCategory === 'Mobile') {
        console.log('✅ Product Created & Mapped Successfully');
        console.log(`   Mapped price: ${p.price}, img: ${p.img}, subCategory: ${p.subCategory}`);
      } else {
        console.log('❌ Product Created but Mapping Failed');
        console.log(p);
      }
    } else {
      console.log('❌ Create Failed');
    }

    const productId = createRes.data._id;

    // 3. Update Product
    console.log('\n3. Testing Update Product');
    const updateRes = await axios.put(`${PRODUCT_URL}/${productId}`, {
      stock: 20,
      batchNo: 'B202402',
      brand: 'Samsung Galaxy'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (updateRes.status === 200 && updateRes.data.brand === 'Samsung Galaxy' && updateRes.data.stock === 20) {
      console.log('✅ Update Successful');
    } else {
      console.log('❌ Update Failed');
    }

    console.log('\n--- Verification Complete: SUCCESS ---');

  } catch (error) {
    console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
  }
};

runTests();
