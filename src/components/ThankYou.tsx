"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import Phone from "@/components/PhonePreview";
import { formatPrice } from "@/lib/utils";
import { getPaymentStatus } from "@/app/thank-you/actions";
import PhonePreview from "@/components/PhonePreview";

export default function ThankYou() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { data: paymentStatus } = useQuery({
    queryKey: ["get-payment-status"],
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 500,
  });

  if (paymentStatus === undefined) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2Icon className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">Loading your order...</h3>
          <p>This won&apos;t take long.</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === false) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2Icon className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            We&apos;ve received your order and are now processing it.
          </p>

          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              You made a great choice!
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              We at CaseCobra believe that a phone case doesn&apos;t only need to
              look good, but also last you for the years to come. We offer a
              5-year print guarantee: If you case isn&apos;t of the highest quality,
              we&apos;ll replace it for free.
            </p>
          </div>
        </div>

        <div className="mt-4 flex space-x-6 overflow-hidden rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview
            croppedImageUrl={paymentStatus.CaseConfiguration.croppedImageUrl!}
            color={paymentStatus.CaseConfiguration.CaseColor!}
          />
        </div>

        <div>
          <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
            <div>
              <p className="font-medium text-gray-900">Shipping address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">
                    {paymentStatus.ShippingAddress?.name}
                  </span>
                  <span className="block">
                    {paymentStatus.ShippingAddress?.street}
                  </span>
                  <span className="block">
                    {paymentStatus.ShippingAddress?.postalCode}{" "}
                    {paymentStatus.ShippingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Billing address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">
                    {paymentStatus.BillingAddress?.name}
                  </span>
                  <span className="block">
                    {paymentStatus.BillingAddress?.street}
                  </span>
                  <span className="block">
                    {paymentStatus.BillingAddress?.postalCode}{" "}
                    {paymentStatus.BillingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">Paid</p>
            </div>

            <div>
              <p className="font-medium text-zinc-900">Shipping Method</p>
              <p className="mt-2 text-zinc-700">
                DHL, takes up to 3 working days
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{formatPrice(paymentStatus.amount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping</p>
            <p className="text-zinc-700">{formatPrice(0)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Total</p>
            <p className="text-zinc-700">{formatPrice(paymentStatus.amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
