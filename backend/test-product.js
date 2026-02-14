const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

let adminToken = "";

// Step 1: Login to get admin token
async function loginAdmin() {
  try {
    console.log("\n🔐 Step 1: Logging in as Admin...");
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: "admin@example.com",
      password: "adminpassword123",
    });

    adminToken = res.data.token;
    console.log("✅ Login successful!");
    return true;
  } catch (error) {
    console.error(
      "❌ Login failed:",
      error.response?.data?.message || error.message,
    );
    return false;
  }
}

// Step 2: Create a category
async function createCategory(categoryName) {
  try {
    console.log(`\n📝 Creating category "${categoryName}"...`);
    const res = await axios.post(
      `${BASE_URL}/products/categories`,
      { name: categoryName },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ Category created!", res.data.data.category.id);
    return res.data.data.category.id;
  } catch (error) {
    console.error(
      "❌ Create category failed:",
      error.response?.data?.message || error.message,
    );
    return null;
  }
}

// Step 3: Create a product
async function createProduct(categoryId) {
  try {
    console.log(`\n📦 Creating product...`);

    const FormData = require("form-data");
    const form = new FormData();

    form.append("name", "iPhone 15 Pro");
    form.append("price", "999.99"); // Sent as string, will be coerced to number
    form.append("stock", "50"); // Sent as string, will be coerced to number
    form.append("categoryId", categoryId);
    form.append("description", "Latest iPhone with advanced features");

    const res = await axios.post(`${BASE_URL}/products`, form, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        ...form.getHeaders(),
      },
    });

    console.log("✅ Product created successfully!");
    console.log("Product ID:", res.data.data.product.id);
    console.log("Product Name:", res.data.data.product.name);
    console.log("Price:", res.data.data.product.price);
    console.log("Stock:", res.data.data.product.stock);

    return res.data.data.product;
  } catch (error) {
    console.error(
      "❌ Create product failed:",
      error.response?.data?.message || error.message,
    );
    if (error.response?.data?.error) {
      console.error("Validation error:", error.response.data.error.message);
    }
    return null;
  }
}

// Step 4: Get all products
async function getAllProducts() {
  try {
    console.log(`\n📋 Fetching all products...`);
    const res = await axios.get(`${BASE_URL}/products`);

    console.log("✅ Products fetched!");
    console.log("Total products:", res.data.results);
    console.log("\nProducts:");
    res.data.data.products.forEach((prod, index) => {
      console.log(
        `  ${index + 1}. ${prod.name} - $${prod.price} (Stock: ${prod.stock})`,
      );
    });
  } catch (error) {
    console.error(
      "❌ Get products failed:",
      error.response?.data?.message || error.message,
    );
  }
}

// Main test function
async function runTests() {
  console.log("🚀 PRODUCT API TEST SUITE");
  console.log("═══════════════════════════════════");

  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log("\n❌ Cannot proceed without login");
    return;
  }

  const categoryId = await createCategory("Electronics");
  if (!categoryId) {
    console.log("\n❌ Cannot proceed without category");
    return;
  }

  await createProduct(categoryId);
  await getAllProducts();

  console.log("\n═══════════════════════════════════");
  console.log("✅ TEST COMPLETED!");
}

runTests();
