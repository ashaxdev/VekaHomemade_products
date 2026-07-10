import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const limit = searchParams.get("limit");

    const query: Record<string, unknown> = {};

    if (category && category !== "All") query.category = category;
    if (featured === "true") query.isFeatured = true;
    if (bestSeller === "true") query.isBestSeller = true;

    let dbQuery = Product.find(query).sort({ createdAt: -1 });

    if (limit) {
      dbQuery = dbQuery.limit(Number(limit));
    }

    const products = await dbQuery.exec();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error("Products GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create({
      name: body.name,
      category: body.category,
      price: Number(body.price),
      discountPrice: Number(body.discountPrice),
      weight: body.weight,
      description: body.description,
      ingredients: body.ingredients,
      shelfLife: body.shelfLife,
      stock: Number(body.stock),
      image: body.image,
      imagePublicId: body.imagePublicId,
      isBestSeller: Boolean(body.isBestSeller),
      isFeatured: Boolean(body.isFeatured),
      inStock: Number(body.stock) > 0,
    });

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Product POST error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to create product",
      },
      { status: 500 }
    );
  }
}