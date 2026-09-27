import { z } from "zod";

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Enter your full name"),
    phone: z.string().min(10, "Enter a valid phone number"),
    email: z.string().email().optional().or(z.literal("")),
  }),
  shipping: z.object({
    line1: z.string().min(5, "Enter your address"),
    city: z.string().min(2, "Enter your city"),
    province: z.string().min(2, "Select your province"),
    postalCode: z.string().optional(),
  }),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        color: z.string().optional(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
