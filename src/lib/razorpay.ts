import Razorpay from "razorpay";

// Requires env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
// Get these from https://dashboard.razorpay.com/app/keys
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "Razorpay keys are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env.local"
  );
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});