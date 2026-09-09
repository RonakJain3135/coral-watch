import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Fish, Thermometer, Droplets, Trash2 } from "lucide-react";

const CoralInfo = () => {
  const coralTypes = [
    {
      title: "Hard Corals",
      description: "Build calcium carbonate structures that form reef foundations",
      icon: Shield,
      color: "from-accent to-primary"
    },
    {
      title: "Soft Corals",
      description: "Flexible corals that sway with currents, adding beauty and habitat",
      icon: Heart,
      color: "from-secondary to-accent"
    },
    {
      title: "Table Corals",
      description: "Flat, table-like structures providing shelter for marine life",
      icon: Fish,
      color: "from-primary to-secondary"
    }
  ];

  const threats = [
    {
      title: "Ocean Warming",
      description: "Rising temperatures cause coral bleaching and death",
      icon: Thermometer,
      impact: "High"
    },
    {
      title: "Ocean Acidification",
      description: "Acidic waters dissolve coral skeletons",
      icon: Droplets,
      impact: "High"
    },
    {
      title: "Pollution",
      description: "Chemical runoff and plastic waste damage reefs",
      icon: Trash2,
      impact: "Medium"
    }
  ];

  return (
    <section id="corals" className="py-20 gradient-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* What Are Corals Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
            What Are Coral Reefs?
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Coral reefs are among Earth's most diverse ecosystems, often called the "rainforests of the sea." 
            These living structures support 25% of all marine species while covering less than 1% of the ocean floor.
          </p>
        </div>

        {/* Coral Types */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-primary mb-12">Types of Corals</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {coralTypes.map((coral, index) => (
              <Card key={coral.title} className="glass-ocean p-6 hover:shadow-coral transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${coral.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <coral.icon size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">{coral.title}</h4>
                <p className="text-muted-foreground">{coral.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Importance Section */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-6">
                Why Coral Reefs Matter
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground">
                    <strong>Biodiversity Hotspots:</strong> Support over 4,000 fish species and countless other marine organisms
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground">
                    <strong>Coastal Protection:</strong> Act as natural barriers, protecting shorelines from storms and erosion
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground">
                    <strong>Economic Value:</strong> Generate billions in tourism revenue and support fishing communities
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground">
                    <strong>Climate Regulation:</strong> Help regulate ocean chemistry and carbon cycles
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-coral p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">25%</div>
                <p className="text-xl text-foreground mb-4">of marine species depend on coral reefs</p>
                <div className="text-4xl font-bold text-accent mb-2">500M+</div>
                <p className="text-lg text-foreground">people rely on reefs for food and income</p>
              </div>
            </div>
          </div>
        </div>

        {/* Threats Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center text-primary mb-6">
            Why We Must Save Coral Reefs
          </h3>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Coral reefs face unprecedented threats from climate change and human activities. 
            Without immediate action, we could lose these irreplaceable ecosystems forever.
          </p>
          
          <div className="bg-card/50 p-8 rounded-2xl mb-12 max-w-4xl mx-auto border-2 border-accent/20">
            <h4 className="text-2xl font-bold text-primary mb-6 text-center">The Urgent Need for Action</h4>
            <div className="space-y-4 text-foreground">
              <p className="leading-relaxed">
                <strong className="text-accent">Medical Breakthroughs:</strong> Coral reef organisms have provided treatments for cancer, HIV, cardiovascular diseases, and ulcers. Scientists believe many more life-saving medicines await discovery in these underwater pharmacies.
              </p>
              <p className="leading-relaxed">
                <strong className="text-accent">Food Security:</strong> Over 1 billion people worldwide depend on coral reefs as their primary source of protein. The collapse of reef ecosystems would create a global food crisis affecting the world's most vulnerable populations.
              </p>
              <p className="leading-relaxed">
                <strong className="text-accent">Economic Impact:</strong> Coral reefs contribute over $375 billion annually to the global economy through tourism, fisheries, and coastal protection. Their loss would devastate economies across 100+ countries.
              </p>
              <p className="leading-relaxed">
                <strong className="text-accent">Carbon Storage:</strong> Healthy coral reefs act as carbon sinks, helping to mitigate climate change. They absorb and store significant amounts of CO₂, making them crucial allies in the fight against global warming.
              </p>
              <p className="leading-relaxed">
                <strong className="text-accent">Future Generations:</strong> Studies show that 70-90% of coral reefs could disappear by 2050 if current trends continue. We have less than a decade to reverse this trajectory and preserve these ancient ecosystems that have existed for over 240 million years.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {threats.map((threat) => (
              <Card key={threat.title} className="p-6 border-l-4 border-l-destructive hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <threat.icon size={24} className="text-destructive mr-3" />
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    threat.impact === 'High' ? 'bg-destructive/10 text-destructive' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {threat.impact} Impact
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-primary mb-2">{threat.title}</h4>
                <p className="text-muted-foreground">{threat.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button variant="ocean" size="lg" className="px-8 py-4 h-auto text-lg">
            Learn How AI Can Help
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoralInfo;