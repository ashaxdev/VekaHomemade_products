import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LKP-${timestamp}-${random}`;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    const query: Record<string, unknown> = {};
    if (status && status !== "All") query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.mobile": { $regex: search, $options: "i" } },
      ];
    }

    let dbQuery = Order.find(query).sort({ createdAt: -1 });
    if (limit) dbQuery = dbQuery.limit(parseInt(limit));

    const orders = await dbQuery.exec();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const orderNumber = generateOrderNumber();
    const order = await Order.create({ ...body, orderNumber });
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
