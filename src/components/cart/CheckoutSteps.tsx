
import React from 'react';
import { ShoppingCart, CreditCard, Package, Check } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: number;
}

export const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
  const steps = [
    { icon: <ShoppingCart className="h-5 w-5" />, label: "Review Cart" },
    { icon: <CreditCard className="h-5 w-5" />, label: "Payment" },
    { icon: <Package className="h-5 w-5" />, label: "Order Placed" }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`flex flex-col items-center ${index <= currentStep ? "text-green-600" : "text-gray-400"}`}>
            <div className={`rounded-full p-2 ${index <= currentStep ? "bg-green-100" : "bg-gray-100"}`}>
              {index < currentStep ? <Check className="h-5 w-5" /> : step.icon}
            </div>
            <span className="text-xs mt-1">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-2 ${index < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
