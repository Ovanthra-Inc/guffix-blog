"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Check, Sparkles, Zap, Shield, Crown } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";


const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for casual readers starting their tech journey.",
    features: [
      "Access to all public articles",
      "Weekly AI-curated newsletter",
      "Community discussions",
      "Standard reading experience",
    ],
    buttonText: "Current Plan",
    icon: Zap,
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For professionals who want deep-dives and early access.",
    features: [
      "Everything in Free",
      "Unlock Premium 'Pro' deep-dives",
      "Ad-free reading experience",
      "Early access to trending topics",
      "Exclusive community badge",
      "Priority newsletter support",
    ],
    buttonText: "Upgrade to Pro",
    icon: Crown,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and organizations looking for content licensing.",
    features: [
      "Everything in Pro",
      "Team-wide access (up to 10)",
      "Custom AI topic reports",
      "Content syndication rights",
      "Dedicated account manager",
      "API access to trending data",
    ],
    buttonText: "Contact Sales",
    icon: Shield,
    popular: false,
  },
];

export default function PricingPage() {
  const { user, userTier } = useAuth();
  const router = useRouter();


  const [upgrading, setUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (planName: string) => {
    if (!user) {
      toast.error("Please login to upgrade", {
        action: { label: "Login", onClick: () => router.push("/login") }
      });
      return;
    }

    if (planName === "Enterprise") {
      router.push("/advertise");
      return;
    }

    setUpgrading(planName);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, userEmail: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Checkout failed");
      }
    } catch (error) {
      toast.error("Payment setup failed. Please try again.");
      console.error(error);
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-hero py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Simple, <span className="text-gradient">Transparent Pricing</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that's right for you and unlock the full power of AI-curated tech knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = userTier === plan.name.toLowerCase();
              const isLoading = upgrading === plan.name;
              
              return (
                <div
                  key={plan.name}
                  className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                    plan.popular
                      ? "bg-card/80 border-primary/50 shadow-2xl shadow-primary/10 -translate-y-2"
                      : "bg-card/40 border-border/50 hover:border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      MOST POPULAR
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isCurrent ? (
                    <button disabled className="w-full py-3.5 rounded-xl bg-muted text-muted-foreground font-bold cursor-default">
                      Your Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={isLoading}
                      className={`block w-full text-center py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing…
                        </>
                      ) : plan.buttonText}
                    </button>
                  )}
                </div>
              );
            })}
          </div>


          <div className="mt-20 text-center">
            <p className="text-muted-foreground">
              Have questions about our plans? <Link href="/advertise" className="text-primary hover:underline">Contact our support team</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
