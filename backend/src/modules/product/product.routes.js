const express = require("express");
const productController = require("./product.controller");
const { protect, restrictTo } = require("../../shared/middleware/auth");
const validate = require("../../shared/middleware/validate");
const { productSchema, categorySchema } = require("./product.validation");
const upload = require("../../shared/middleware/upload");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    protect,
    restrictTo("ADMIN"),
    upload.single("image"),
    validate(productSchema),
    productController.createProduct,
  );

router
  .route("/categories")
  .get(productController.getCategories)
  .post(
    protect,
    restrictTo("ADMIN"),
    validate(categorySchema),
    productController.createCategory,
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    protect,
    restrictTo("ADMIN"),
    upload.single("image"),
    productController.updateProduct,
  )
  .delete(protect, restrictTo("ADMIN"), productController.deleteProduct);

module.exports = router;
