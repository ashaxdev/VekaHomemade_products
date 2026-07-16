import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { razorpay } from "@/lib/razorpay";

// POST /api/razorpay/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount }
// `amount` is the amount (in RUPEES) the client believes it's paying — used as a
// sanity check against what Razorpay actually captured.
export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing verification fields" },
        { status: 400 }
      );
    }

    // 1. Verify the HMAC signature — confirms this response actually came from Razorpay.
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // 2. Fetch the payment directly from Razorpay's servers (never trust the
    //    client-supplied response object for status/amount — only the signature
    //    check above is truly tamper-proof from the client's side).
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.order_id !== razorpay_order_id) {
      return NextResponse.json(
        { success: false, error: "Payment does not match order" },
        { status: 400 }
      );
    }

    if (payment.status !== "captured") {
      return NextResponse.json(
        { success: false, error: `Payment not captured (status: ${payment.status})` },
        { status: 400 }
      );
    }

    // 3. Cross-check the amount actually captured against what the client expects
    //    to pay. This catches cases where the displayed/expected total was
    //    manipulated client-side before hitting this endpoint.
    if (typeof amount === "number") {
      const expectedPaise = Math.round(amount * 100);
      if (payment.amount !== expectedPaise) {
        return NextResponse.json(
          { success: false, error: "Amount mismatch" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      verifiedAmount: payment.amount,
    });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json(
      { success: false, error: "Verification error" },
      { status: 500 }
    );
  }
}