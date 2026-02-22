const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const pino = require("pino");

const app = express();
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const globalErrorHandler = require("./shared/middleware/globalErrorHandler");
const AppError = require("./shared/utils/AppError");

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger middleware
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

// Routes
const authRouter = require("./modules/auth/auth.routes");
const userRouter = require("./modules/user/user.routes");
const productRouter = require("./modules/product/product.routes");
const cartRouter = require("./modules/cart/cart.routes");
const orderRouter = require("./modules/order/order.routes");
const paymentRouter = require("./modules/payment/payment.routes");
const adminRouter = require("./modules/admin/admin.routes");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/admin", adminRouter);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Handle 404
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
