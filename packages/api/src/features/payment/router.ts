import { z } from "zod";
import { protectedProcedure } from "../../context";
import { paymentService } from "./service";

export const paymentRouter = {
	getStatus: protectedProcedure.handler(async ({ context }) => {
		return paymentService.getSubscriptionStatus(context.user.id);
	}),

	createOrder: protectedProcedure.handler(async ({ context }) => {
		return paymentService.createOrder(context.user.id);
	}),

	verifyPayment: protectedProcedure
		.input(
			z.object({
				razorpayOrderId: z.string().min(1),
				razorpayPaymentId: z.string().min(1),
				razorpaySignature: z.string().min(1),
			}),
		)
		.handler(async ({ context, input }) => {
			return paymentService.verifyPayment({
				userId: context.user.id,
				razorpayOrderId: input.razorpayOrderId,
				razorpayPaymentId: input.razorpayPaymentId,
				razorpaySignature: input.razorpaySignature,
			});
		}),
};
