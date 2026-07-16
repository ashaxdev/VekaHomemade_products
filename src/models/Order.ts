import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: "ONLINE";
  paymentStatus: "Pending" | "Paid";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["ONLINE"], required: true, default: "ONLINE" },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;