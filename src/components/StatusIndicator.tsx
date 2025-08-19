import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

interface StatusIndicatorProps {
  status: "good" | "danger" | "warning" | "neutral";
  label?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const StatusIndicator = ({ 
  status, 
  label, 
  size = "md", 
  showIcon = true 
}: StatusIndicatorProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "good":
        return {
          icon: CheckCircle,
          bgColor: "bg-safety-good",
          textColor: "text-safety-good-foreground",
          iconColor: "text-safety-good",
          borderColor: "border-safety-good/20"
        };
      case "danger":
        return {
          icon: XCircle,
          bgColor: "bg-safety-danger",
          textColor: "text-safety-danger-foreground",
          iconColor: "text-safety-danger",
          borderColor: "border-safety-danger/20"
        };
      case "warning":
        return {
          icon: AlertCircle,
          bgColor: "bg-safety-warning",
          textColor: "text-safety-warning-foreground",
          iconColor: "text-safety-warning",
          borderColor: "border-safety-warning/20"
        };
      default:
        return {
          icon: Clock,
          bgColor: "bg-safety-neutral",
          textColor: "text-safety-neutral-foreground",
          iconColor: "text-safety-neutral",
          borderColor: "border-safety-neutral/20"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  if (!label) {
    return (
      <div className={cn(
        "inline-flex items-center justify-center rounded-full",
        config.bgColor,
        sizeClasses[size]
      )}>
        {showIcon && <Icon className={cn(iconSizes[size], config.textColor)} />}
      </div>
    );
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-full border",
      config.bgColor,
      config.borderColor,
      sizeClasses[size]
    )}>
      {showIcon && <Icon className={cn(iconSizes[size], config.textColor)} />}
      <span className={cn("font-medium", config.textColor)}>
        {label}
      </span>
    </div>
  );
};