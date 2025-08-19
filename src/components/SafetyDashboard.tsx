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
  
  // Core system status
  const [isPlatformSafe, setIsPlatformSafe] = useState(true);
  const [isWheelbaseSet, setIsWheelbaseSet] = useState(true);
  const [isChargerSafe, setIsChargerSafe] = useState(true);
  const [isStageSafe, setIsStageSafe] = useState(true);
  const [isPodSafe, setIsPodSafe] = useState(true);
  
  // Safety signals for 2.3 PLC
  const [inputSignals, setInputSignals] = useState<SafetySignal[]>([
    { id: "e-stop-0", label: "E-Stop 0", currentState: true, category: "Emergency Systems" },
    { id: "e-stop-1", label: "E-Stop 1", currentState: true, category: "Emergency Systems" },
    { id: "door-interlock-0", label: "Door Interlock 0", currentState: true, category: "Interlocks" },
    { id: "door-interlock-1", label: "Door Interlock 1", currentState: true, category: "Interlocks" },
    { id: "e-panel-interlock", label: "E-Panel Interlock", currentState: true, category: "Interlocks" },
    { id: "flood-warning-sensor", label: "Flood Warning Sensor", currentState: true, category: "Environmental Sensors" },
    { id: "water-tank-sensor-0", label: "Water Tank Sensor 0", currentState: true, category: "Environmental Sensors" },
    { id: "water-tank-sensor-1", label: "Water Tank Sensor 1", currentState: true, category: "Environmental Sensors" },
    { id: "fire-alarm-sensor", label: "Fire Alarm Sensor", currentState: true, category: "Environmental Sensors" },
    { id: "hold-to-run", label: "Hold To Run", currentState: false, category: "Control Systems" },
    { id: "over-voltage-protection-0", label: "Over Voltage Protection 0", currentState: true, category: "Power Protection" },
    { id: "over-voltage-protection-1", label: "Over Voltage Protection 1", currentState: true, category: "Power Protection" },
    { id: "isolation-detection-charger-0", label: "Isolation Detection Charger 0", currentState: true, category: "Isolation Detection" },
    { id: "isolation-detection-charger-1", label: "Isolation Detection Charger 1", currentState: true, category: "Isolation Detection" },
    { id: "isolation-detection-charger-2", label: "Isolation Detection Charger 2", currentState: true, category: "Isolation Detection" },
    { id: "isolation-detection-charger-3", label: "Isolation Detection Charger 3", currentState: true, category: "Isolation Detection" },
  ]);

  const [outputSignals, setOutputSignals] = useState<SafetySignal[]>([
    { id: "stage-contactor", label: "Stage Contactor", currentState: true, category: "Contactors" },
    { id: "pod-contactor", label: "Pod Contactor", currentState: true, category: "Contactors" },
    { id: "motion-contactor", label: "Motion Contactor", currentState: true, category: "Contactors" },
    { id: "charger-contactor", label: "Charger Contactor", currentState: true, category: "Contactors" },
    { id: "isolation-fault-buzzer", label: "Isolation Fault Buzzer", currentState: false, category: "Alarms" },
  ]);

  // Calculate overall system status
  const systemConditions = [
    { label: "System Online", status: isOnline, errorMessage: "System Offline" },
    { label: "PLC Connected", status: isConnectedToPLC, errorMessage: "Disconnected from PLC" },
    ...outputSignals.map(signal => ({
      label: signal.label,
      status: signal.currentState,
      errorMessage: `${signal.label} Off`
    })),
    ...inputSignals.map(signal => ({
      label: signal.label,
      status: signal.id === "hold-to-run" ? !signal.currentState : signal.currentState,
      errorMessage: signal.label.includes("E-Stop") ? `${signal.label} pressed` : 
                   signal.label.includes("Interlock") ? `${signal.label} tripped` :
                   signal.label.includes("Sensor") ? `${signal.label} triggered` :
                   signal.label.includes("Protection") ? `${signal.label} tripped` :
                   signal.label.includes("Detection") ? `${signal.label} trigerred` :
                   signal.id === "hold-to-run" ? "Hold To Run active" :
                   `${signal.label} fault`
    })),
    ...outputSignals.filter(signal => signal.id !== "isolation-fault-buzzer").map(signal => ({
      label: signal.label,
      status: signal.currentState,
      errorMessage: `${signal.label} Disabled`
    })),
    {
      label: "Isolation Fault Buzzer",
      status: !outputSignals.find(s => s.id === "isolation-fault-buzzer")?.currentState,
      errorMessage: "Isolation Fault Buzzer triggered"
    }
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
              <p className="text-muted-foreground">v2.3 - Platform Area Monitoring</p>
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
                  <SafetyCondition label="Platform Safe" status={isPlatformSafe} />
                  <SafetyCondition label="Wheelbase Set" status={isWheelbaseSet} />
                  <SafetyCondition label="Charger Safe" status={isChargerSafe} />
                  <SafetyCondition label="Stage Safe" status={isStageSafe} />
                  <SafetyCondition label="Pod Safe" status={isPodSafe} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4 text-industrial-accent" />
                  <span className="font-medium">Contactors</span>
                </div>
                <div className="space-y-1">
                  {outputSignals.filter(signal => signal.category === "Contactors").map(signal => (
                    <SafetyCondition 
                      key={signal.id}
                      label={signal.label} 
                      status={signal.currentState} 
                    />
                  ))}
                  <SafetyCondition 
                    label="Isolation Fault Buzzer" 
                    status={!outputSignals.find(s => s.id === "isolation-fault-buzzer")?.currentState} 
                  />
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