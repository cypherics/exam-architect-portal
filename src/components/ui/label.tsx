import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        filled: "bg-blue-500 text-white", // Example of a filled variant
        soft: "bg-transparent text-blue-500", // Example of a soft variant
        // Add more variants here as needed
      },
      color: {
        success: "text-green-500",
        warning: "text-yellow-500",
        error: "text-red-500",
        default: "text-gray-500",
      },
    },
    defaultVariants: {
      variant: "soft", // Default variant
      color: "default", // Default color
    },
  }
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
