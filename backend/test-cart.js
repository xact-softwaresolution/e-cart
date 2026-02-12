const axios = require('axios');

async function testCart() {
  try {
    // 1. Login as Admin to create product
    console.log('Logging in as Admin...');
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@example.com',
      password: 'adminpassword123'
    });
    const token = loginRes.data.token;
    
    // 2. Create a product (if not exists, or just get one)
    console.log('Creating/Getting Product...');
    // For simplicity, let's just list products and pick one, or create if empty
    let product;
    try {
      const productsRes = await axios.get('http://localhost:5000/api/v1/products');
      if (productsRes.data.data.length > 0) {
        product = productsRes.data.data[0];
      } else {
        const createProductRes = await axios.post('http://localhost:5000/api/v1/products', {
          name: 'Test Product',
          price: 100,
          description: 'A test product',
          stock: 50,
          categoryId: 'some-category-id' // This might fail if cat doesn't exist, strictly we should ensure cat exists.
        }, { headers: { Authorization: `Bearer ${token}` } });
        product = createProductRes.data.data;
      }
    } catch (e) {
      // If product creation fails (e.g. category missing), let's skip or handle
      console.log('Product fetch/create warning:', e.message);
    }
    
    if (!product) {
        // Create category first
        const catRes = await axios.post('http://localhost:5000/api/v1/products/categories', {
            name: 'Test Category ' + Date.now()
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        const createProductRes = await axios.post('http://localhost:5000/api/v1/products', {
          name: 'Test Product',
          price: 100,
          description: 'A test product',
          stock: 50,
          categoryId: catRes.data.data.id
        }, { headers: { Authorization: `Bearer ${token}` } });
        product = createProductRes.data.data;
    }

    console.log('Using Product:', product.id);

    // 3. Add to Cart
    console.log('Adding to Cart...');
    const addRes = await axios.post('http://localhost:5000/api/v1/cart', {
      productId: product.id,
      quantity: 2
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Added:', addRes.data.data.items.length, 'items');

    // 4. Get Cart
    console.log('Fetching Cart...');
    const getRes = await axios.get('http://localhost:5000/api/v1/cart', {
       headers: { Authorization: `Bearer ${token}` } 
    });
    console.log('Cart Total:', getRes.data.data.totalAmount);

    // 5. Update Cart Item
    const itemId = getRes.data.data.items[0].id; // Assuming items exist
    console.log('Updating Item:', itemId);
    const updateRes = await axios.patch(`http://localhost:5000/api/v1/cart/${itemId}`, {
        quantity: 5
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Updated Quantity:', updateRes.data.data.items[0].quantity);

    // 6. Clear Cart
    console.log('Clearing Cart...');
    await axios.delete('http://localhost:5000/api/v1/cart', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Cart Cleared');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testCart();
