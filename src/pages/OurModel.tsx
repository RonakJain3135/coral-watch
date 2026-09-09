import { ArrowLeft, Brain, Image, Box, GitBranch, Zap, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

const OurModel = () => {
  const navigate = useNavigate();

  const coralDetectionInfo = {
    title: "Coral Detection & Classification Model",
    description: "A dual-approach pipeline combining YOLO v11 for detection and ResNet for classification",
    icon: Brain,
    color: "from-emerald-500 to-teal-600",
    pipeline: [
      {
        step: "Detection",
        model: "YOLO v11",
        description: "Identifies and localizes coral structures with bounding boxes",
        reason: "YOLO v11 excels at real-time object detection"
      },
      {
        step: "Preprocessing",
        model: "Image Processing",
        description: "Crops detected corals and resizes to 128×128 pixels",
        reason: "Standardizes input for classification model"
      },
      {
        step: "Classification",
        model: "ResNet",
        description: "Classifies each coral as healthy or bleached",
        reason: "ResNet excels at fine-grained image classification"
      }
    ]
  };

  const pipelineSteps = [
    {
      step: "1",
      title: "Data Collection",
      description: "Gathered thousands of underwater images featuring coral reefs and marine debris from various ocean environments",
      icon: Image
    },
    {
      step: "2",
      title: "Data Annotation",
      description: "Pre-labelled coral structures and debris with precise bounding boxes to create high-quality training datasets",
      icon: Box
    },
    {
      step: "3",
      title: "Model Training",
      description: "Trained specialized YOLO v11 models optimized for underwater object detection",
      icon: Brain
    },
    {
      step: "4",
      title: "Optimization",
      description: "Fine-tuned hyperparameters",
      icon: Zap
    },
    {
      step: "5",
      title: "Deployment",
      description: "Deployed models to Hugging Face for scalable, real-time inference accessible worldwide",
      icon: GitBranch
    },
    {
      step: "6",
      title: "Continuous Learning",
      description: "Ongoing model improvement with new data and user feedback to enhance detection capabilities",
      icon: CheckCircle2
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">How We Built Our AI Models</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover the technology and methodology behind our coral reef conservation AI. 
              We leverage state-of-the-art deep learning to protect marine ecosystems.
            </p>
          </div>

          {/* Technology Stack */}
          <Card className="mb-12 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Technology Stack</CardTitle>
              <CardDescription className="text-center">
                Built with cutting-edge computer vision and deep learning frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                  <div className="text-4xl font-bold text-primary mb-2">YOLO v11</div>
                  <p className="text-sm text-muted-foreground">Object Detection Framework</p>
                  <p className="text-xs text-muted-foreground mt-2">Real-time detection with high accuracy</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl border border-accent/20">
                  <div className="text-2xl font-bold text-accent mb-2">CNN+LSTM+ResNet50</div>
                  <p className="text-sm text-muted-foreground">Neural Network Architecture</p>
                  <p className="text-xs text-muted-foreground mt-2">Advanced classification models</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                  <div className="text-4xl font-bold text-primary mb-2">Hugging Face</div>
                  <p className="text-sm text-muted-foreground">Model Deployment Platform</p>
                  <p className="text-xs text-muted-foreground mt-2">Scalable cloud inference</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coral Detection Model Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Our Coral Detection & Classification Pipeline</h2>
            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${coralDetectionInfo.color} flex items-center justify-center mb-4`}>
                  <coralDetectionInfo.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{coralDetectionInfo.title}</CardTitle>
                <CardDescription>{coralDetectionInfo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {coralDetectionInfo.pipeline.map((stage, index) => (
                    <div key={index} className="relative pl-8 pb-6 border-l-2 border-primary/30 last:border-0 last:pb-0">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{stage.step}</h4>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{stage.model}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 italic">Why? {stage.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline Flowchart */}
          <Card className="mb-12 border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Development Pipeline</CardTitle>
              <CardDescription className="text-center">
                From data collection to production deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Vertical line connecting steps */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary hidden md:block"></div>
                
                <div className="space-y-6">
                  {pipelineSteps.map((step, index) => (
                    <div key={step.step} className="relative flex items-start gap-6">
                      {/* Step number circle */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl border-4 border-background relative z-10">
                        {step.step}
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1 pb-6">
                        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <step.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debris Detection Pipeline */}
          <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Marine Debris Detection Pipeline</CardTitle>
              <CardDescription className="text-center">
                Identifying and locating debris threats to coral ecosystems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-background/50 p-5 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm">1</span>
                    Image Upload
                  </h4>
                  <p className="text-sm text-muted-foreground ml-10">
                    User uploads an underwater reef image through the web interface
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gradient-to-b from-orange-500 to-red-500"></div>
                </div>

                <div className="bg-background/50 p-5 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm">2</span>
                    YOLO v11 Debris Detection
                  </h4>
                  <p className="text-sm text-muted-foreground ml-10">
                    The image is fed to our specialized YOLO v11 debris detection model which identifies plastic waste, trash, and other marine debris
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gradient-to-b from-red-500 to-orange-600"></div>
                </div>

                <div className="bg-background/50 p-5 rounded-lg border-l-4 border-orange-600">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">3</span>
                    Bounding Box Creation
                  </h4>
                  <p className="text-sm text-muted-foreground ml-10">
                    The model creates precise bounding boxes around each piece of detected debris, capturing location and size information
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gradient-to-b from-orange-600 to-destructive"></div>
                </div>

                <div className="bg-background/50 p-5 rounded-lg border-l-4 border-destructive">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center text-sm">4</span>
                    Results & Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground ml-10">
                    The processed image is displayed with red bounding boxes highlighting debris locations, along with coordinates, debris count, and threat assessment
                  </p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-background/80 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3">Why YOLO v11 for Marine Conservation?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We chose YOLO v11 (You Only Look Once) because it's specifically designed for real-time object detection. 
                  Unlike traditional methods that scan images multiple times, YOLO v11 processes the entire image in a single pass, 
                  making it incredibly fast while maintaining high accuracy. This is crucial for coral reef monitoring where 
                  timely detection can mean the difference between saving or losing precious marine ecosystems.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OurModel;
