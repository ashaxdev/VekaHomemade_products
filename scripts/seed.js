/**
 * Seed script — populates the database with sample products.
 * Run with: node scripts/seed.js
 * Make sure MONGODB_URI is set in .env.local before running.
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
    discountPrice: Number,
    weight: String,
    description: String,
    ingredients: String,
    shelfLife: String,
    stock: Number,
    image: String,
    imagePublicId: String,
    isBestSeller: Boolean,
    isFeatured: Boolean,
    inStock: Boolean,
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const sampleProducts = [
  {
    name: "Spicy Mango Pickle",
    category: "Pickles",
    price: 299,
    discountPrice: 249,
    weight: "250g",
    description:
      "Tangy raw mangoes hand-cut and slow-pickled in cold-pressed gingelly oil with a fiery blend of red chilli and mustard. A timeless classic that pairs perfectly with curd rice.",
    ingredients: "Raw mango, gingelly oil, red chilli powder, mustard seeds, fenugreek, asafoetida, salt",
    shelfLife: "12 months",
    stock: 45,
    image: "https://images.unsplash.com/photo-1599909533730-f0e91d6091c0?w=800&q=80",
    imagePublicId: "sample/mango-pickle",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
  },
  {
    name: "Garlic Thokku",
    category: "Thokku",
    price: 279,
    discountPrice: 229,
    weight: "200g",
    description:
      "A robust, deeply aromatic thokku made with whole garlic cloves simmered slowly in spiced tamarind gravy. Bold, earthy, and addictive with hot rice and ghee.",
    ingredients: "Garlic, tamarind, red chilli powder, gingelly oil, mustard seeds, curry leaves, salt",
    shelfLife: "6 months",
    stock: 38,
    image: "https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=800&q=80",
    imagePublicId: "sample/garlic-thokku",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
  },
  {
    name: "Idli Podi (Gunpowder)",
    category: "Podis",
    price: 199,
    discountPrice: 179,
    weight: "200g",
    description:
      "A roasted lentil and red chilli powder blend, hand-ground the traditional way. Mix with sesame oil for the perfect companion to idli, dosa, or even plain rice.",
    ingredients: "Urad dal, chana dal, red chilli, sesame seeds, asafoetida, salt",
    shelfLife: "4 months",
    stock: 60,
    image: "https://images.unsplash.com/photo-1626200926749-c9a08c7b8c4f?w=800&q=80",
    imagePublicId: "sample/idli-podi",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
  },
  {
    name: "Murukku (Traditional)",
    category: "Snacks",
    price: 249,
    discountPrice: 219,
    weight: "300g",
    description:
      "Crispy, golden spirals made from rice flour and urad dal, hand-pressed and deep-fried in small batches for that authentic crunch in every bite.",
    ingredients: "Rice flour, urad dal flour, butter, cumin seeds, sesame seeds, salt, oil",
    shelfLife: "3 months",
    stock: 50,
    image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&q=80",
    imagePublicId: "sample/murukku",
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
  },
  {
    name: "Lemon Pickle",
    category: "Pickles",
    price: 269,
    discountPrice: 239,
    weight: "250g",
    description:
      "Sun-ripened lemons pickled with a tangy-spicy masala that develops deeper flavour over time. A zesty addition to any meal.",
    ingredients: "Lemon, red chilli powder, mustard powder, fenugreek, gingelly oil, salt",
    shelfLife: "12 months",
    stock: 8,
    image: "https://images.unsplash.com/photo-1611070555697-4b91ba62de64?w=800&q=80",
    imagePublicId: "sample/lemon-pickle",
    isBestSeller: false,
    isFeatured: false,
    inStock: true,
  },
  {
    name: "Tomato Thokku",
    category: "Thokku",
    price: 229,
    discountPrice: 199,
    weight: "200g",
    description:
      "Ripe tomatoes cooked down with onions and spices into a thick, versatile thokku — equally great as a side dish or sandwich spread.",
    ingredients: "Tomato, onion, red chilli powder, mustard seeds, curry leaves, gingelly oil, salt",
    shelfLife: "3 months",
    stock: 30,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&q=80",
    imagePublicId: "sample/tomato-thokku",
    isBestSeller: false,
    isFeatured: false,
    inStock: true,
  },
  {
    name: "Curry Leaf Podi",
    category: "Podis",
    price: 189,
    discountPrice: 169,
    weight: "150g",
    description:
      "A fragrant, nutrient-rich podi made from fresh curry leaves, lentils, and spices — a wonderful way to add curry leaf goodness to every meal.",
    ingredients: "Curry leaves, urad dal, chana dal, red chilli, tamarind, salt",
    shelfLife: "4 months",
    stock: 5,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80",
    imagePublicId: "sample/curry-leaf-podi",
    isBestSeller: false,
    isFeatured: false,
    inStock: true,
  },
  {
    name: "Thattai",
    category: "Snacks",
    price: 219,
    discountPrice: 189,
    weight: "250g",
    description:
      "Crisp, savoury rice crackers studded with peanuts and curry leaves — a beloved festive snack made fresh every week.",
    ingredients: "Rice flour, urad dal flour, peanuts, curry leaves, sesame seeds, salt, oil",
    shelfLife: "2 months",
    stock: 25,
    image: "https://images.unsplash.com/photo-1606471191356-69e1ae62fa3c?w=800&q=80",
    imagePublicId: "sample/thattai",
    isBestSeller: false,
    isFeatured: false,
    inStock: true,
  },
  {
    name: "Festive Combo Pack",
    category: "Combo Packs",
    price: 899,
    discountPrice: 699,
    weight: "5 items",
    description:
      "Our most popular gifting combo — includes mango pickle, garlic thokku, idli podi, murukku, and thattai. Beautifully packed and perfect for festivals or sending love to family abroad.",
    ingredients: "See individual product ingredients for full details",
    shelfLife: "3 months (combined)",
    stock: 20,
    image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&q=80",
    imagePublicId: "sample/festive-combo",
    isBestSeller: true,
    isFeatured: true,
    inStock: true,
  },
  {
    name: "Ginger Pickle",
    category: "Pickles",
    price: 259,
    discountPrice: 219,
    weight: "200g",
    description:
      "A warming, digestive-friendly pickle made with fresh ginger root, perfect in small quantities alongside any South Indian meal.",
    ingredients: "Ginger, red chilli powder, mustard seeds, gingelly oil, jaggery, salt",
    shelfLife: "8 months",
    stock: 0,
    image: "https://images.unsplash.com/photo-1599321659517-9e7635c0b08f?w=800&q=80",
    imagePublicId: "sample/ginger-pickle",
    isBestSeller: false,
    isFeatured: false,
    inStock: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} products successfully`);

    await mongoose.disconnect();
    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
