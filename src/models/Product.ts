import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: "Pickles" | "Karuvadu" | "Combo Packs";
  price: number;
  discountPrice: number;
  weight: string;
  description: string;
  ingredients: string;
  shelfLife: string;
  stock: number;
  image: string;
  imagePublicId: string;
  isBestSeller: boolean;
  isFeatured: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Pickles", "Karuvadu", "Combo Packs"],
    },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    weight: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: String, required: true },
    shelfLife: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
