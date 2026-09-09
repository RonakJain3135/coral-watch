import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Thermometer } from "lucide-react";
import heatMapImage from "@/assets/coral-heat-stress-map.jpg";

const HeatMapSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 mb-4">
              <Thermometer className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              Coral Bleaching Heat Stress Map
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real-time monitoring of ocean temperatures and coral reef stress levels worldwide
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Heat Map Image */}
            <Card className="overflow-hidden border-2 border-orange-500/20">
              <CardContent className="p-0">
                <img 
                  src={heatMapImage}
                  alt="Coral reef bleaching heat stress map showing ocean temperature data"
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>

            {/* Explanation */}
            <div className="space-y-6">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-orange-600" />
                    Understanding the Heat Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    This map shows coral bleaching heat stress measured in degree heating weeks (°C-Weeks). It tracks cumulative thermal stress on coral reefs worldwide. 
                    The color scale from light blue to dark red indicates increasing stress levels that can trigger coral bleaching events.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-cyan-400 flex-shrink-0 mt-1"></div>
                      <div>
                        <p className="font-semibold text-sm">Light Blue (0-2 °C-Weeks)</p>
                        <p className="text-xs text-muted-foreground">No significant stress - corals are healthy</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0 mt-1"></div>
                      <div>
                        <p className="font-semibold text-sm">Purple-Blue (2-4 °C-Weeks)</p>
                        <p className="text-xs text-muted-foreground">Low stress - monitor zones</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 flex-shrink-0 mt-1"></div>
                      <div>
                        <p className="font-semibold text-sm">Yellow-Orange (4-10 °C-Weeks)</p>
                        <p className="text-xs text-muted-foreground">Elevated stress - watch zones for bleaching</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-red-600 flex-shrink-0 mt-1"></div>
                      <div>
                        <p className="font-semibold text-sm">Red-Dark Red (10-20+ °C-Weeks)</p>
                        <p className="text-xs text-muted-foreground">Severe stress - bleaching occurring</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="text-destructive flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-semibold text-destructive mb-2">Rising Global Temperatures</h4>
                      <p className="text-sm text-foreground leading-relaxed">
                        Degree Heating Weeks (DHW) measure accumulated thermal stress. When DHW exceeds 4 °C-Weeks, 
                        significant coral bleaching begins. At 8 °C-Weeks or higher, widespread bleaching and mortality occur. 
                        This map reveals that many Pacific and Caribbean reefs are experiencing dangerous stress levels, 
                        highlighting the urgent need for climate action and coral conservation efforts.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeatMapSection;