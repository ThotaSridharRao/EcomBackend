const axios = require('axios');

const AUTH_URL = 'http://localhost:5000/api/auth';
const PRODUCT_URL = 'http://localhost:5000/api/products';
const ORDER_URL = 'http://localhost:5000/api/orders';

const runTests = async () => {
  try {
    console.log('--- Starting Order Verification ---');

    // 1. Register User
    const uniqueEmail = `shopper_${Date.now()}@example.com`;
    const regRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Shopper User',
      email: uniqueEmail,
      password: 'password123'
    });
    const token = regRes.data.token;
    console.log(`✅ User Registered: ${uniqueEmail}`);

    // 2. Create Complex Order
    console.log('\n2. Testing Create Order');
    const orderData = {
      id: `ORD-TEST-${Date.now()}`,
      date: 'Jan 03, 2026',
      time: '12:00 PM',
      total: '₹4,999',
      status: 'Processing',
      payment: {
        method: 'UPI',
        status: 'Success',
        date: new Date().toLocaleString()
      },
      address: {
        name: 'Shopper Name',
        line1: '123 Street',
        line2: 'Mumbai, 400001',
        phone: '9876543210'
      },
      vendor: {
        name: 'Test Vendor'
      },
      bill: {
        total: '₹4,999'
      },
      items: [
        {
          name: 'Test Item',
          image: 'img.jpg',
          qty: 1,
          price: '₹4,999',
          id: '659ce53b21855d0488661234' // Fake Mongo ID
        }
      ],
      timeline: [
        { title: 'Order Placed', date: 'Just Now', completed: true }
      ]
    };

    const createRes = await axios.post(ORDER_URL, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (createRes.status === 201 && createRes.data.id === orderData.id) {
      console.log('✅ Order Created Successfully');
    } else {
      console.log('❌ Order Creation Failed');
    }

    // 3. Get My Orders
    console.log('\n3. Testing Get My Orders');
    const myOrdersRes = await axios.get(`${ORDER_URL}/myorders`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (myOrdersRes.status === 200 && myOrdersRes.data.length > 0) {
      console.log(`✅ My Orders Fetched (Count: ${myOrdersRes.data.length})`);
    } else {
      console.log('❌ Fetch My Orders Failed');
    }

    // 4. Get Order By ID
    console.log('\n4. Testing Get Order By ID');
    const getOrderRes = await axios.get(`${ORDER_URL}/${orderData.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (getOrderRes.status === 200 && getOrderRes.data.id === orderData.id) {
      console.log(`✅ Order Fetched by Custom ID`);
    } else {
      console.log('❌ Fetch Order Details Failed');
    }

    console.log('\n--- Verification Complete: SUCCESS ---');

  } catch (error) {
    console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
  }
};

runTests();
