const axios = require('axios');

async function login() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@example.com',
      password: 'adminpassword123'
    });
    console.log('Login successful:', res.data.status);
    console.log('Token:', res.data.token ? 'Present' : 'Missing');
    console.log('User Role:', res.data.data.user.role);
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
  }
}

login();
