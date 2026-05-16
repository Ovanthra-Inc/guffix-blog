/**
 * Stripe Utility (Raw Fetch Edition)
 * Used to interact with Stripe API without relying on the native SDK in restricted environments.
 */

const STRIPE_API_URL = "https://api.stripe.com/v1";

async function stripeFetch(path: string, options: RequestInit = {}) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured");

  const response = await fetch(`${STRIPE_API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Stripe API error: ${error.error?.message || response.statusText}`);
  }

  return response.json();
}

export async function createCheckoutSession(userId: string, userEmail: string) {
  const params = new URLSearchParams({
    "success_url": `${process.env.NEXT_PUBLIC_SITE_URL}/admin?session_id={CHECKOUT_SESSION_ID}`,
    "cancel_url": `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    "mode": "subscription",
    "customer_email": userEmail,
    "client_reference_id": userId,
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": "GuffixAI Pro Subscription",
    "line_items[0][price_data][product_data][description]": "Unlock premium AI deep-dives and early access.",
    "line_items[0][price_data][unit_amount]": "1900", // $19.00
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][quantity]": "1",
  });

  return stripeFetch("/checkout/sessions", {
    method: "POST",
    body: params.toString(),
  });
}
