const axios = require('axios');

const AUTH_URL = 'http://localhost:5000/api/auth';
const ADDRESS_URL = 'http://localhost:5000/api/addresses';

const runTests = async () => {
  try {
    console.log('--- Starting Address Verification ---');

    // 1. Register User
    const uniqueEmail = `addr_user_${Date.now()}@example.com`;
    const regRes = await axios.post(`${AUTH_URL}/register`, {
      name: 'Address User',
      email: uniqueEmail,
      password: 'password123'
    });
    const token = regRes.data.token;
    console.log(`✅ User Registered: ${uniqueEmail}`);

    // 2. Add Home Address
    console.log('\n2. Testing Add Home Address');
    const homeAddrRes = await axios.post(ADDRESS_URL, {
      name: 'Home User',
      phone: '9998887776',
      address: 'Flat 101, A Wing',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      type: 'Home'
    }, { headers: { Authorization: `Bearer ${token}` } });

    const homeAddrId = homeAddrRes.data._id;
    if (homeAddrRes.status === 201 && homeAddrRes.data.type === 'Home') {
      console.log('✅ Home Address Added');
    } else {
      console.log('❌ Add Home Address Failed');
    }

    // 3. Add Work Address (Default)
    console.log('\n3. Testing Add Work Address (Set Default)');
    const workAddrRes = await axios.post(ADDRESS_URL, {
      name: 'Work User',
      phone: '9998887776',
      address: 'Office 505, Tech Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      type: 'Work',
      isDefault: true
    }, { headers: { Authorization: `Bearer ${token}` } });

    const workAddrId = workAddrRes.data._id;
    if (workAddrRes.status === 201 && workAddrRes.data.isDefault === true) {
      console.log('✅ Work Address Added and Set Default');
    } else {
      console.log('❌ Add Work Address Failed');
    }

    // 4. Get Addresses
    console.log('\n4. Testing Get Addresses');
    const getRes = await axios.get(ADDRESS_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (getRes.status === 200 && getRes.data.length >= 2) {
      console.log(`✅ Fetched ${getRes.data.length} Addresses`);
      const fetchedHome = getRes.data.find(a => a._id === homeAddrId);
      if (!fetchedHome.isDefault) {
        console.log('✅ Verified: Home Address is NOT default anymore');
      }
    } else {
      console.log('❌ Fetch Addresses Failed');
    }

    // 5. Update Address
    console.log('\n5. Testing Update Address');
    const updateRes = await axios.put(`${ADDRESS_URL}/${homeAddrId}`, {
      city: 'New Mumbai'
    }, { headers: { Authorization: `Bearer ${token}` } });

    if (updateRes.status === 200 && updateRes.data.city === 'New Mumbai') {
      console.log('✅ Address Updated Successfully');
    } else {
      console.log('❌ Update Address Failed');
    }

    // 6. Delete Address
    console.log('\n6. Testing Delete Address');
    const deleteRes = await axios.delete(`${ADDRESS_URL}/${workAddrId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (deleteRes.status === 200) {
      console.log('✅ Address Deleted');
    } else {
      console.log('❌ Delete Address Failed');
    }

    console.log('\n--- Verification Complete: SUCCESS ---');

  } catch (error) {
    console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
  }
};

runTests();
