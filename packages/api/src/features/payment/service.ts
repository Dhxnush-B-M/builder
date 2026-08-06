import crypto from "node:crypto";
import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { db } from "@reactive-resume/db/client";
import { user } from "@reactive-resume/db/schema";
import { env } from "@reactive-resume/env/server";

export const PAYMENT_AMOUNT_PAISE = 1100; // ₹11 in paise
export const SUBSCRIPTION_DURATION_DAYS = 60; // 2 months

export type RazorpayOrderResponse = {
	orderId: string;
	amount: number;
	currency: string;
	keyId: string;
};

export const paymentService = {
	async getSubscriptionStatus(userId: string) {
		const [dbUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1);

		if (!dbUser) {
			throw new ORPCError("NOT_FOUND", { message: "User not found." });
		}

		const expiresAt = dbUser.subscriptionExpiresAt;
		const now = new Date();
		const hasActiveSubscription = Boolean(expiresAt && new Date(expiresAt) > now);

		return {
			hasPaid: hasActiveSubscription,
			expiresAt,
			isExpired: Boolean(expiresAt && new Date(expiresAt) <= now),
			razorpayKeyId: env.RAZORPAY_KEY_ID || "rzp_test_mock_key",
		};
	},

	async createOrder(userId: string): Promise<RazorpayOrderResponse> {
		const keyId = env.RAZORPAY_KEY_ID;
		const keySecret = env.RAZORPAY_KEY_SECRET;

		// If Razorpay keys are not provided, return a demo order ID for testing
		if (!keyId || !keySecret) {
			const mockOrderId = `order_mock_${Date.now()}_${userId.slice(0, 6)}`;
			return {
				orderId: mockOrderId,
				amount: PAYMENT_AMOUNT_PAISE,
				currency: "INR",
				keyId: "rzp_test_demo_key",
			};
		}

		const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

		const response = await fetch("https://api.razorpay.com/v1/orders", {
			method: "POST",
			headers: {
				Authorization: `Basic ${authString}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				amount: PAYMENT_AMOUNT_PAISE,
				currency: "INR",
				receipt: `receipt_${userId.slice(0, 8)}_${Date.now()}`,
				notes: {
					userId,
					plan: "2_months_access",
				},
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("[Razorpay] Order creation failed:", errorText);
			throw new ORPCError("BAD_REQUEST", { message: "Failed to create Razorpay payment order." });
		}

		const data = (await response.json()) as { id: string; amount: number; currency: string };

		return {
			orderId: data.id,
			amount: data.amount,
			currency: data.currency,
			keyId,
		};
	},

	async verifyPayment(input: {
		userId: string;
		razorpayOrderId: string;
		razorpayPaymentId: string;
		razorpaySignature: string;
	}) {
		const keySecret = env.RAZORPAY_KEY_SECRET;

		// In demo mode without secret keys, skip HMAC verification and grant 2 months access
		if (keySecret) {
			const generatedSignature = crypto
				.createHmac("sha256", keySecret)
				.update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
				.digest("hex");

			if (generatedSignature !== input.razorpaySignature) {
				throw new ORPCError("BAD_REQUEST", { message: "Invalid payment signature verification failed." });
			}
		}

		// Calculate 2 months (60 days) expiration date
		const subscriptionExpiresAt = new Date();
		subscriptionExpiresAt.setDate(subscriptionExpiresAt.getDate() + SUBSCRIPTION_DURATION_DAYS);

		await db
			.update(user)
			.set({
				subscriptionExpiresAt,
				paymentId: input.razorpayPaymentId,
				orderId: input.razorpayOrderId,
				updatedAt: new Date(),
			})
			.where(eq(user.id, input.userId));

		return {
			success: true,
			subscriptionExpiresAt,
			message: "Payment verified successfully. You have 2 months full access to rbuilder!",
		};
	},
};
