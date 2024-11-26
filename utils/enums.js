// Enum for user roles
const UserRoles = Object.freeze({
    ADMIN: "admin",
    USER: "user",
  });
  
  // Enum for product statuses
  const ProductStatus = Object.freeze({
    AVAILABLE: "available",
    OUT_OF_STOCK: "out_of_stock",
    DISCONTINUED: "discontinued",
  });
  
  // Enum for order statuses
  const OrderStatus = Object.freeze({
    PENDING: "pending",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  });
  
  module.exports = {
    UserRoles,
    ProductStatus,
    OrderStatus,
  };