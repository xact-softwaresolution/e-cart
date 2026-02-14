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
    console.log("Token received:", adminToken.substring(0, 20) + "...");
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
    console.log(`\n📝 Step 2: Creating category "${categoryName}"...`);
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

    console.log("✅ Category created successfully!");
    console.log("Category ID:", res.data.data.category.id);
    console.log("Category Name:", res.data.data.category.name);

    return res.data.data.category;
  } catch (error) {
    console.error(
      "❌ Create category failed:",
      error.response?.data?.message || error.message,
    );
    return null;
  }
}

// Step 3: Get all categories
async function getAllCategories() {
  try {
    console.log("\n📋 Step 3: Fetching all categories...");
    const res = await axios.get(`${BASE_URL}/products/categories`);

    console.log("✅ Categories fetched successfully!");
    console.log("Total categories:", res.data.count);
    console.log("\nCategories:");
    res.data.data.categories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} (ID: ${cat.id})`);
    });

    return res.data.data.categories;
  } catch (error) {
    console.error(
      "❌ Get categories failed:",
      error.response?.data?.message || error.message,
    );
    return [];
  }
}

// Main test function
async function runTests() {
  console.log("🚀 CATEGORY API TEST SUITE");
  console.log("═══════════════════════════════════");

  // Login first
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log("\n❌ Cannot proceed without login");
    return;
  }

  // Create categories
  const categories = ["Electronics", "Clothing", "Books"];

  for (const catName of categories) {
    await createCategory(catName);
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Get all categories
  await getAllCategories();

  console.log("\n═══════════════════════════════════");
  console.log("✅ TEST COMPLETED!");
}

// Run the tests
runTests();
