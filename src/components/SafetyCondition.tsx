import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface SafetyConditionProps {
  label: string;
  status: boolean;
  showDetails?: boolean;
  errorMessage?: string;
}

export const SafetyCondition = ({ 
  label, 
  status, 
  showDetails = false, 
  errorMessage 
}: SafetyConditionProps) => {
  const Icon = status ? CheckCircle : XCircle;
  
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
      status 
        ? "bg-safety-good/5 border-safety-good/20 hover:bg-safety-good/10" 
        : "bg-safety-danger/5 border-safety-danger/20 hover:bg-safety-danger/10",
      showDetails && "hover:shadow-sm"
    )}>
      <div className="flex items-center gap-3">
        <Icon 
          className={cn(
            "w-5 h-5 flex-shrink-0",
            status ? "text-safety-good" : "text-safety-danger"
          )} 
        />
        <div className="flex-1">
          <div className="font-medium text-foreground text-sm">
            {label}
          </div>
          {!status && errorMessage && showDetails && (
            <div className="text-xs text-safety-danger mt-1">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className={cn(
          "px-2 py-1 rounded text-xs font-medium",
          status 
            ? "bg-safety-good text-safety-good-foreground" 
            : "bg-safety-danger text-safety-danger-foreground"
        )}>
          {status ? "OK" : "FAULT"}
        </div>
      )}
    </div>
  );
};