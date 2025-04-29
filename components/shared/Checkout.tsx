"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useCallback } from "react";

import { useToast } from "@/components/ui/use-toast";
import { checkoutCredits } from "@/lib/actions/transaction.action";

import { Button } from "../ui/button";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();

  useEffect(() => {
    const initializeStripe = async () => {
      await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    };
    initializeStripe();
  }, []);

  const handleRedirect = useCallback(() => {
    const query = new URLSearchParams(window.location.search);
    
    if (query.get("success")) {
      toast({
        title: "Order placed!",
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
      });
    }

    if (query.get("canceled")) {
      toast({
        title: "Order canceled!",
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
        className: "error-toast",
      });
    }
  }, [toast]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  const onCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    try {
      await checkoutCredits(transaction);
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "There was an issue processing your order. Please try again.",
        duration: 5000,
        className: "error-toast",
      });
      console.error("Checkout error:", error);
    }
  };

  return (
    <form onSubmit={onCheckout}>
      <section>
        <Button
          type="submit"
          role="link"
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
};

export default Checkout;
