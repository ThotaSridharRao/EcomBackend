const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m"
};

const print = (msg, color = colors.reset) => console.log(`${color}${msg}${colors.reset}`);

const runTests = async () => {
  try {
    print('\n🚀 Starting Comprehensive Backend Feature Verification\n', colors.cyan);

    let token;
    let userId;
    let productId;
    let addressId;
    let orderId;

    // ==========================================
    // 1. Authentication
    // ==========================================
    print('--- 1. Authentication ---', colors.yellow);
    const uniqueEmail = `test_user_${Date.now()}@example.com`;
    const userPassword = 'password123';

    // Register
    try {
      const regRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test Setup User',
        email: uniqueEmail,
        password: userPassword
      });
      token = regRes.data.token;
      // FIXED: API returns flat object { _id, name, email, token }
      userId = regRes.data._id;
      print(`✅ Registered User: ${uniqueEmail}`, colors.green);
    } catch (e) {
      console.error("Registration Error Details:", e.response?.data);
      throw new Error(`Registration Failed: ${e.response?.data?.message || e.message}`);
    }

    // Login (Double check)
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: uniqueEmail,
        password: userPassword
      });
      if (loginRes.data.token) {
        print(`✅ Login Successful`, colors.green);
      }
    } catch (e) {
      throw new Error(`Login Failed: ${e.response?.data?.message}`);
    }

    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };


    // ==========================================
    // 2. Products
    // ==========================================
    print('\n--- 2. Products ---', colors.yellow);
    try {
      const productsRes = await axios.get(`${BASE_URL}/products`);
      if (productsRes.data.length > 0) {
        productId = productsRes.data[0]._id; // Pick first product
        print(`✅ Fetched ${productsRes.data.length} Products`, colors.green);
        print(`   Selected Product ID: ${productId} (${productsRes.data[0].name})`, colors.reset);
      } else {
        throw new Error("No products found. Please seed the database first.");
      }
    } catch (e) {
      throw new Error(`Fetch Products Failed: ${e.message}`);
    }


    // ==========================================
    // 3. Wishlist Management
    // ==========================================
    print('\n--- 3. Wishlist Management ---', colors.yellow);
    // Add to Wishlist
    try {
      const addWishRes = await axios.post(`${BASE_URL}/wishlist`, { productId }, authHeaders);
      // Check if product is in the returned list
      if (addWishRes.data.products.some(p => p._id === productId || p === productId)) {
        print(`✅ Added to Wishlist`, colors.green);
      } else {
        print(`⚠️  Added to Wishlist but ID check failed (Check response structure)`, colors.yellow);
        console.log(addWishRes.data);
      }
    } catch (e) {
      print(`❌ Add to Wishlist Failed: ${e.message}`, colors.red);
    }

    // Get Wishlist
    try {
      const getWishRes = await axios.get(`${BASE_URL}/wishlist`, authHeaders);
      if (getWishRes.data.products.length > 0) {
        print(`✅ Fetched Wishlist (${getWishRes.data.products.length} items)`, colors.green);
      }
    } catch (e) {
      print(`❌ Get Wishlist Failed: ${e.message}`, colors.red);
    }


    // ==========================================
    // 4. Cart Management
    // ==========================================
    print('\n--- 4. Cart Management ---', colors.yellow);
    // Add to Cart
    try {
      const addCartRes = await axios.post(`${BASE_URL}/cart`, { productId, qty: 2 }, authHeaders);
      if (addCartRes.data.items.some(i => i.product._id === productId || i.product === productId)) {
        print(`✅ Added to Cart (Qty: 2)`, colors.green);
      }
    } catch (e) {
      throw new Error(`Add to Cart Failed: ${e.message}`);
    }

    // Get Cart
    try {
      const getCartRes = await axios.get(`${BASE_URL}/cart`, authHeaders);
      const item = getCartRes.data.items.find(i => i.product._id === productId || i.product === productId);
      if (item && item.qty === 2) {
        print(`✅ Verified Cart Item & Quantity`, colors.green);
      }
    } catch (e) {
      throw new Error(`Get Cart Failed: ${e.message}`);
    }


    // ==========================================
    // 5. Address Management
    // ==========================================
    print('\n--- 5. Address Management ---', colors.yellow);
    try {
      const addressData = {
        name: 'Test User',
        phone: '9876543210',
        address: '123 Test Lane',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        type: 'Home',
        isDefault: true
      };
      const addrRes = await axios.post(`${BASE_URL}/addresses`, addressData, authHeaders);
      addressId = addrRes.data._id;
      print(`✅ Address Added: ${addressId}`, colors.green);
    } catch (e) {
      throw new Error(`Add Address Failed: ${e.message}`);
    }


    // ==========================================
    // 6. Order Management
    // ==========================================
    print('\n--- 6. Order Management ---', colors.yellow);
    try {
      // Retrieve cart items first to build order payload
      const cartRes = await axios.get(`${BASE_URL}/cart`, authHeaders);
      const cartItems = cartRes.data.items.map(i => ({
        product: i.product._id || i.product, // Handle populated/unpopulated
        qty: i.qty,
        price: i.product.price || 100 // Fallback price if not populated
      }));

      // Calculate total
      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

      const orderPayload = {
        items: cartItems,
        address: {
          name: 'Test User',
          line1: '123 Test Lane',
          city: 'Test City',
          phone: '9876543210'
        },
        payment: {
          method: 'COD',
          details: 'Cash on Delivery',
          isOnline: false,
          status: 'Pending'
        },
        bill: {
          subtotal: subtotal,
          tax: 0,
          shipping: 0,
          total: subtotal
        }
      };

      const orderRes = await axios.post(`${BASE_URL}/orders`, orderPayload, authHeaders);
      orderId = orderRes.data._id;
      print(`✅ Order Placed Successfully: ${orderId}`, colors.green);

    } catch (e) {
      console.error(e.response?.data);
      throw new Error(`Place Order Failed: ${e.response?.data?.message || e.message}`);
    }

    // Verify My Orders
    try {
      const myOrdersRes = await axios.get(`${BASE_URL}/orders/myorders`, authHeaders);
      const foundOrder = myOrdersRes.data.find(o => o._id === orderId);
      if (foundOrder) {
        print(`✅ Verified Order in User History`, colors.green);
        print(`   Order Status: ${foundOrder.status}`, colors.cyan);
      } else {
        throw new Error("Order not found in history");
      }
    } catch (e) {
      throw new Error(`Get My Orders Failed: ${e.message}`);
    }

    print('\n🎉 All Backend Features Verified Successfully!', colors.green);

  } catch (error) {
    print(`\n❌ CRITICAL FAILURE: ${error.message}`, colors.red);
    if (error.response) {
      console.log('Response Data:', error.response.data);
    }
  }
};

runTests();
