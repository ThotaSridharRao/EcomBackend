const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const runTests = async () => {
  try {
    console.log('--- Starting Auth Verification ---');

    // 1. Register User
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    console.log(`\n1. Testing Registration with email: ${uniqueEmail}`);
    const regRes = await axios.post(`${API_URL}/register`, {
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123'
    });

    if (regRes.status === 201 && regRes.data.token) {
      console.log('✅ Registration Successful');
      console.log('Token received:', regRes.data.token.substring(0, 10) + '...');
    } else {
      console.log('❌ Registration Failed');
    }

    // 2. Login User
    console.log('\n2. Testing Login');
    const loginRes = await axios.post(`${API_URL}/login`, {
      email: uniqueEmail,
      password: 'password123'
    });

    if (loginRes.status === 200 && loginRes.data.token) {
      console.log('✅ Login Successful');
    } else {
      console.log('❌ Login Failed');
    }

    const token = loginRes.data.token;

    // 3. Get Me
    console.log('\n3. Testing Protected Route (/me)');
    const meRes = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (meRes.status === 200 && meRes.data.email === uniqueEmail) {
      console.log('✅ Protected Route Verified');
      console.log('User ID:', meRes.data._id);
    } else {
      console.log('❌ Protected Route Failed');
    }

    console.log('\n--- Verification Complete: SUCCESS ---');

  } catch (error) {
    console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
  }
};

runTests();
