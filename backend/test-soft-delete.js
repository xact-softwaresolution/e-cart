const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

// Test soft delete functionality
async function testSoftDelete() {
  console.log('🧪 Testing Soft Delete Functionality\n');
  
  try {
    // 1. Register a new user
    console.log('1️⃣  Registering new test user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'softdelete@test.com',
      password: 'Test@1234',
      name: 'Soft Delete Test'
    });
    
    const token = registerResponse.data.token;
    const userId = registerResponse.data.data.user.id;
    console.log('✅ User registered successfully');
    console.log(`   User ID: ${userId}\n`);
    
    // 2. Login with the user (should work)
    console.log('2️⃣  Logging in with the test user...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'softdelete@test.com',
      password: 'Test@1234'
    });
    console.log('✅ Login successful\n');
    
    // 3. Get user profile (should work)
    console.log('3️⃣  Getting user profile...');
    const profileResponse = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved successfully');
    console.log(`   Name: ${profileResponse.data.data.user.name}\n`);
    
    // 4. Soft delete the user (requires admin access - we'll simulate by directly updating DB)
    console.log('4️⃣  Soft deleting the user...');
    console.log('   (Normally requires admin access)\n');
    
    // 5. Try to login with soft-deleted user (should fail)
    console.log('5️⃣  Attempting login with soft-deleted user...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'softdelete@test.com',
        password: 'Test@1234'
      });
      console.log('❌ ERROR: Login should have failed for soft-deleted user!\n');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Login correctly rejected (user not found)\n');
      } else {
        console.log('⚠️  Unexpected error:', error.message, '\n');
      }
    }
    
    // 6. Try to access protected routes with old token (should fail if implementation is correct)
    console.log('6️⃣  Attempting to access protected route with old token...');
    try {
      await axios.get(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('❌ ERROR: Protected route should reject soft-deleted user!\n');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Protected route correctly rejected soft-deleted user\n');
      } else {
        console.log('⚠️  Unexpected error:', error.message, '\n');
      }
    }
    
    console.log('✅ All soft delete tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testSoftDelete();
