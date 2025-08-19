import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "./StatusIndicator";
import { SafetyCondition } from "./SafetyCondition";
import { Power, Shield, AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SafetySignal {
  id: string;
  label: string;
  currentState: boolean;
  category: string;
  errorMessage?: string;
}

const SafetyDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnectedToPLC, setIsConnectedToPLC] = useState(true);
  const [isTimeout, setIsTimeout] = useState(false);
  
  // Mock safety signals based on your code
  const [inputSignals, setInputSignals] = useState<SafetySignal[]>([
    { id: "e-stop-0", label: "Emergency Stop 0", currentState: true, category: "Emergency Stops" },
    { id: "e-stop-1", label: "Emergency Stop 1", currentState: true, category: "Emergency Stops" },
    { id: "leak-sensor", label: "Leak Sensor", currentState: true, category: "Sensors" },
    { id: "over-voltage", label: "Over-voltage Protection", currentState: true, category: "Power Protection" },
    { id: "pod-module-0-epanel", label: "Pod Module 0 Epanel", currentState: true, category: "Interlocks" },
    { id: "pod-module-0-side-1", label: "Pod Module 0 Side 1", currentState: true, category: "Interlocks" },
    { id: "pod-module-1-side-1", label: "Pod Module 1 Side 1", currentState: true, category: "Interlocks" },
    { id: "pod-module-2-side-1", label: "Pod Module 2 Side 1", currentState: true, category: "Interlocks" },
    { id: "pod-module-2-door", label: "Pod Module 2 Door", currentState: true, category: "Interlocks" },
    { id: "pod-module-2-side-0", label: "Pod Module 2 Side 0", currentState: true, category: "Interlocks" },
    { id: "pod-module-1-side-0", label: "Pod Module 1 Side 0", currentState: true, category: "Interlocks" },
    { id: "pod-module-0-side-0", label: "Pod Module 0 Side 0", currentState: true, category: "Interlocks" },
    { id: "interlock-enabled", label: "Interlock Enabled", currentState: true, category: "System" },
  ]);

  const [outputSignals, setOutputSignals] = useState<SafetySignal[]>([
    { id: "charging-area-power", label: "Charging Area Power", currentState: true, category: "Power Systems" },
    { id: "motion-area-power", label: "Motion Area Power", currentState: true, category: "Power Systems" },
  ]);

  // Calculate overall system status
  const systemConditions = [
    { label: "System Online", status: isOnline, errorMessage: "System Offline" },
    { label: "PLC Connected", status: isConnectedToPLC, errorMessage: "Disconnected from PLC" },
    { label: "Communication", status: !isTimeout, errorMessage: "Communication Timeout" },
    ...outputSignals.map(signal => ({
      label: signal.label,
      status: signal.currentState,
      errorMessage: `${signal.label} Off`
    })),
    ...inputSignals.map(signal => ({
      label: signal.label,
      status: signal.currentState,
      errorMessage: signal.label.includes("Emergency Stop") ? `${signal.label} Pressed` : 
                   signal.label.includes("Sensor") ? `${signal.label} Tripped` :
                   signal.label.includes("Protection") ? `${signal.label} Triggered` :
                   `${signal.label} Not Closed`
    }))
  ];

  const failedConditions = systemConditions.filter(condition => !condition.status);
  const isSystemSafe = failedConditions.length === 0;

  // Group signals by category
  const groupedInputs = inputSignals.reduce((acc, signal) => {
    if (!acc[signal.category]) acc[signal.category] = [];
    acc[signal.category].push(signal);
    return acc;
  }, {} as Record<string, SafetySignal[]>);

  const handleVirtualReset = () => {
    toast({
      title: "Virtual Reset Initiated",
      description: "Resetting Motion and Charging Systems...",
    });
    
    // Simulate reset process
    setTimeout(() => {
      toast({
        title: "Reset Complete",
        description: "All systems have been reset successfully.",
      });
    }, 2000);
  };

  // Simulate some random state changes for demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to change state
        const signalType = Math.random() < 0.5 ? 'input' : 'output';
        
        if (signalType === 'input') {
          setInputSignals(prev => prev.map(signal => 
            Math.random() < 0.05 ? { ...signal, currentState: !signal.currentState } : signal
          ));
        } else {
          setOutputSignals(prev => prev.map(signal => 
            Math.random() < 0.05 ? { ...signal, currentState: !signal.currentState } : signal
          ));
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-industrial-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-industrial-accent" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Safety Service Dashboard</h1>
              <p className="text-muted-foreground">v2.2 - Platform Area Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <StatusIndicator 
              status={isSystemSafe ? "good" : "danger"} 
              label={isSystemSafe ? "System Safe" : "System Fault"}
            />
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* System Overview */}
        <Card className="border-industrial-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${isSystemSafe ? 'text-safety-good' : 'text-safety-danger'}`} />
                <CardTitle>System Status Overview</CardTitle>
              </div>
              <Button 
                onClick={handleVirtualReset}
                className="bg-industrial-accent hover:bg-industrial-accent/90 text-white"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Virtual Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4 text-industrial-accent" />
                  <span className="font-medium">Core Systems</span>
                </div>
                <div className="space-y-1">
                  <SafetyCondition label="System Online" status={isOnline} />
                  <SafetyCondition label="PLC Connected" status={isConnectedToPLC} />
                  <SafetyCondition label="Communication Active" status={!isTimeout} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4 text-industrial-accent" />
                  <span className="font-medium">Power Systems</span>
                </div>
                <div className="space-y-1">
                  {outputSignals.map(signal => (
                    <SafetyCondition 
                      key={signal.id}
                      label={signal.label} 
                      status={signal.currentState} 
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-safety-warning" />
                  <span className="font-medium">Active Faults</span>
                </div>
                <div className="space-y-1">
                  {failedConditions.length === 0 ? (
                    <div className="text-safety-good text-sm">No active faults</div>
                  ) : (
                    failedConditions.slice(0, 3).map((condition, index) => (
                      <div key={index} className="text-safety-danger text-sm">
                        {condition.errorMessage}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(groupedInputs).map(([category, signals]) => (
            <Card key={category} className="border-industrial-border">
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {signals.map(signal => (
                    <SafetyCondition
                      key={signal.id}
                      label={signal.label}
                      status={signal.currentState}
                      showDetails
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SafetyDashboard;