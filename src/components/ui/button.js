import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600", className)} {...props} />
));
Button.displayName = "Button";

export { Button };
