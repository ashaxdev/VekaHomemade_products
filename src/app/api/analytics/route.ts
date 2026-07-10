import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

const cleanStatus = (status?: string) =>
  String(status || "").trim().toLowerCase();

const isDelivered = (status?: string) => cleanStatus(status) === "delivered";

const isPending = (status?: string) => {
  const value = cleanStatus(status);
  return (
    value === "pending" ||
    value === "order placed" ||
    value === "placed" ||
    value === "processing"
  );
};

export async function GET() {
  try {
    await connectDB();

    const allOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    const deliveredOnly = allOrders.filter((order: any) =>
      isDelivered(order.status)
    );

    const totalOrders = allOrders.length;

    const totalRevenue = deliveredOnly.reduce(
      (sum: number, order: any) => sum + Number(order.total || 0),
      0
    );

    const pendingOrders = allOrders.filter((order: any) =>
      isPending(order.status)
    ).length;

    const deliveredOrders = deliveredOnly.length;

    const productSales: Record<
      string,
      { name: string; quantity: number; revenue: number }
    > = {};

    deliveredOnly.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const id = item.productId || item.name;

        if (!productSales[id]) {
          productSales[id] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }

        productSales[id].quantity += Number(item.quantity || 0);
        productSales[id].revenue +=
          Number(item.price || 0) * Number(item.quantity || 0);
      });
    });

    const bestSellers = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const monthlySales: Record<string, { revenue: number; orders: number }> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      monthlySales[key] = { revenue: 0, orders: 0 };
    }

    deliveredOnly.forEach((order: any) => {
      const d = new Date(order.createdAt);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      if (monthlySales[key]) {
        monthlySales[key].revenue += Number(order.total || 0);
        monthlySales[key].orders += 1;
      }
    });

    const monthlyData = Object.entries(monthlySales).map(([month, data]) => ({
      month,
      ...data,
    }));

    const recentOrders = allOrders.slice(0, 5);

    return NextResponse.json(
      {
        success: true,
        analytics: {
          totalOrders,
          totalRevenue,
          pendingOrders,
          deliveredOrders,
          bestSellers,
          monthlyData,
          recentOrders,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("ANALYTICS_ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}