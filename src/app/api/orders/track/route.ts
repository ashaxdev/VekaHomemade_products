import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

// GET /api/orders/track?mobile=9876543210
// Public endpoint — customers look up their own orders by mobile number.
// Only returns non-sensitive fields (no address/email/notes) to limit
// exposure if someone tries random numbers.
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get("mobile")?.trim();

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { success: false, error: "Enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    const orders = await Order.find({ "customer.mobile": mobile })
      .sort({ createdAt: -1 })
      .select(
        "orderNumber status paymentStatus total items createdAt customer.name"
      )
      .lean();

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, error: "No orders found for this mobile number" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("ORDER_TRACK_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}