"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  Waves,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header"; // Same as CoralHealth

const API_URL = "https://degree-checker-01-debris-detection.hf.space/predict-with-image";

interface Box {
  label: string;
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface ApiResponse {
  success: boolean;
  detections: number;
  annotated_image?: string;
  boxes: Box[];
}

const DetectDebris = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ------------------------------------------------------------------ */
  /*  Upload handling                                                   */
  /* ------------------------------------------------------------------ */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
    setApiResult(null);
    setAnnotatedImage(null);
  };

  /* ------------------------------------------------------------------ */
  /*  API call                                                          */
  /* ------------------------------------------------------------------ */
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress(0);
    setApiResult(null);
    setAnnotatedImage(null);

    const progressInterval = setInterval(() => {
      setProgress((p) => (p > 85 ? 85 : p + Math.random() * 12));
    }, 350);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);

      const data: ApiResponse = await response.json();

      clearInterval(progressInterval);
      setProgress(100);
      setApiResult(data);

      if (data.annotated_image) {
        const imageData = data.annotated_image.startsWith("data:image")
          ? data.annotated_image
          : `data:image/jpeg;base64,${data.annotated_image}`;
        setAnnotatedImage(imageData);
      }

      toast({
        title: "Detection Complete!",
        description: `Found ${data.detections} debris object(s)`,
      });

      setTimeout(() => {
        document
          .getElementById("results-section")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (err) {
      console.error(err);
      toast({
        title: "Detection Failed",
        description:
          err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setProgress(0), 1500);
      setIsAnalyzing(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Canvas fallback for bounding boxes                                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!annotatedImage && apiResult?.boxes?.length && selectedImage) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 3;
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#f97316";

        apiResult.boxes.forEach((b) => {
          const x = b.x1;
          const y = b.y1;
          const w = b.x2 - b.x1;
          const h = b.y2 - b.y1;

          ctx.strokeRect(x, y, w, h);
          const label = `${b.label} ${(b.confidence * 100).toFixed(0)}%`;
          const textWidth = ctx.measureText(label).width;
          ctx.fillRect(x, y - 24, textWidth + 8, 24);
          ctx.fillStyle = "#fff";
          ctx.fillText(label, x + 4, y - 6);
          ctx.fillStyle = "#f97316";
        });
      };
      img.src = selectedImage;
    }
  }, [annotatedImage, apiResult, selectedImage]);

  /* ------------------------------------------------------------------ */
  /*  Static data                                                       */
  /* ------------------------------------------------------------------ */
  const debrisImpacts = [
    {
      title: "Physical Damage",
      description:
        "Debris entangles, breaks, and smothers coral structures, preventing growth and causing tissue damage",
      icon: AlertTriangle,
    },
    {
      title: "Chemical Pollution",
      description:
        "Plastics leach toxic chemicals and microplastics that corals ingest, disrupting their biological processes",
      icon: Waves,
    },
    {
      title: "Disease Spread",
      description:
        "Debris acts as a vector for pathogens, increasing coral disease likelihood by up to 20 times",
      icon: AlertTriangle,
    },
    {
      title: "Light Blockage",
      description:
        "Floating debris blocks sunlight essential for photosynthesis by symbiotic zooxanthellae",
      icon: Waves,
    },
  ];

  const performanceMetrics = [
    { label: "mAP@50", value: 85.4, description: "Overall detection accuracy", color: "orange", icon: Target },
    { label: "Precision", value: 86.4, description: "Correct detections ratio", color: "red", icon: CheckCircle2 },
    { label: "Recall", value: 75.0, description: "Detection coverage", color: "amber", icon: TrendingUp },
    { label: "Speed", value: 35, unit: "FPS", description: "Real-time processing", color: "green", icon: Zap },
  ];

  const speedMetrics = [
    { label: "Pre-process", value: "1.2 ms", color: "from-blue-500 to-cyan-500" },
    { label: "Inference", value: "25.8 ms", color: "from-orange-500 to-red-500" },
    { label: "Post-process", value: "1.0 ms", color: "from-purple-500 to-pink-500" },
    { label: "Total", value: "~28 ms", color: "from-green-500 to-emerald-500" },
  ];

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blue Aesthetic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.3) 0%, transparent 50%)",
        }}
      ></div>

      <div className="relative">
        {/* SAME HEADER AS CORAL HEALTH PAGE */}
        <Header />

        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>

          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 mb-4">
                <Waves className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Detect Marine Debris</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Identify and track debris threatening coral reef ecosystems. Early detection helps prevent damage and enables timely cleanup efforts.
              </p>
            </div>

            {/* Impact Section */}
            <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-50/50 to-red-50/50 mb-12">
              <CardHeader>
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="text-orange-600" size={28} />
                  The Devastating Impact of Marine Debris
                </CardTitle>
                <CardDescription className="text-center">
                  Understanding how pollution threatens our coral reefs and ocean ecosystems
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Image */}
                <div className="mb-8">
                  <div className="rounded-xl overflow-hidden border-4 border-orange-500/30 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=1200&auto=format&fit=crop"
                      alt="Coral reef damaged by marine debris"
                      className="w-full h-80 object-cover"
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground italic">
                    Marine debris poses a severe threat to coral health and marine biodiversity
                  </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8 text-center">
                  <div className="p-4 bg-background/50 rounded-lg border border-orange-500/20">
                    <div className="text-3xl font-bold text-orange-600 mb-2">11 Million</div>
                    <p className="text-sm text-muted-foreground">Metric tons of plastic enter oceans annually</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border border-red-500/20">
                    <div className="text-3xl font-bold text-red-600 mb-2">89%</div>
                    <p className="text-sm text-muted-foreground">Of coral reefs affected by plastic pollution</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border border-orange-500/20">
                    <div className="text-3xl font-bold text-orange-600 mb-2">20x</div>
                    <p className="text-sm text-muted-foreground">Increased disease risk from debris contact</p>
                  </div>
                </div>

                {/* Impact details */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {debrisImpacts.map((impact) => (
                    <div
                      key={impact.title}
                      className="flex items-start gap-3 p-4 bg-background/80 rounded-lg border border-border"
                    >
                      <impact.icon className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{impact.title}</h4>
                        <p className="text-sm text-muted-foreground">{impact.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-destructive/10 border-l-4 border-destructive p-6 rounded-r-lg">
                  <h4 className="font-semibold text-destructive mb-3 text-lg">The Cascading Effect</h4>
                  <p className="text-foreground leading-relaxed">
                    When debris damages coral reefs, it triggers a devastating chain reaction. Healthy reefs support over 25% of all marine species, protect coastlines from storms, and provide food and income for 500+ million people. Every piece of debris we remove is a step toward preserving these irreplaceable ecosystems.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card className="border-2 mb-8">
              <CardHeader>
                <CardTitle>Upload Image for Debris Detection</CardTitle>
                <CardDescription>
                  Our AI will identify and locate debris in reef environments using advanced object detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                    isDragging
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                >
                  {selectedImage ? (
                    <div className="space-y-6">
                      <img
                        src={selectedImage}
                        alt="Uploaded reef"
                        className="max-h-96 mx-auto rounded-lg shadow-lg"
                      />
                      {isAnalyzing && (
                        <div className="space-y-2">
                          <Progress value={progress} className="w-full" />
                          <p className="text-sm text-center text-muted-foreground">
                            Detecting marine debris...
                          </p>
                        </div>
                      )}
                      <div className="flex gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedImage(null);
                            setSelectedFile(null);
                            setApiResult(null);
                            setAnnotatedImage(null);
                          }}
                          disabled={isAnalyzing}
                        >
                          Remove Image
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Detecting...
                            </>
                          ) : (
                            "Detect Debris"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">
                        Drag & Drop Your Image
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        or click to browse from your device (JPG, PNG, WEBP - Max 10MB)
                      </p>
                      <label htmlFor="image-upload">
                        <Button asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {apiResult && (
              <Card className="border-2 mb-8" id="results-section">
                <CardHeader>
                  <CardTitle>Detection Results</CardTitle>
                  <CardDescription>AI-powered marine debris detection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Detected Debris ({apiResult.detections})
                    </h3>

                    {annotatedImage ? (
                      <img
                        src={annotatedImage}
                        alt="Annotated debris"
                        className="max-h-[600px] mx-auto rounded-lg shadow-lg border-2"
                      />
                    ) : (
                      <div className="relative inline-block">
                        <canvas
                          ref={canvasRef}
                          className="max-h-[600px] mx-auto rounded-lg shadow-lg border-2"
                        />
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground text-center">
                      Orange boxes indicate detected marine debris
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {apiResult.boxes.map((b, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <span className="font-medium text-orange-700">Debris #{i + 1}</span>
                        <span className="font-bold text-orange-600">
                          {(b.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* YOLOv11 Dashboard – always visible */}
            <div className="mt-16 max-w-5xl mx-auto">
              <Card className="border-2 border-orange-500/30 shadow-2xl bg-gradient-to-br from-orange-50/80 via-red-50/80 to-amber-50/80 rounded-2xl overflow-hidden">
                <CardHeader className="text-center p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Waves className="w-8 h-8 text-orange-600" />
                    <h2 className="text-3xl font-bold">YOLOv11 Debris Detection Model</h2>
                  </div>
                  <p className="text-gray-700 text-lg">
                    Real-time marine debris detection • <strong className="text-orange-600">35+ FPS</strong> on GPU
                  </p>
                </CardHeader>

                <CardContent className="p-8 space-y-8">
                  {/* Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {performanceMetrics.map((metric, idx) => {
                      const Icon = metric.icon;
                      const colorMap: Record<string, any> = {
                        orange: { gradient: "from-orange-500 to-orange-600", border: "border-orange-300", text: "text-orange-600" },
                        red: { gradient: "from-red-500 to-red-600", border: "border-red-300", text: "text-red-600" },
                        amber: { gradient: "from-amber-500 to-amber-600", border: "border-amber-300", text: "text-amber-600" },
                        green: { gradient: "from-green-500 to-green-600", border: "border-green-300", text: "text-green-600" },
                      };
                      const colors = colorMap[metric.color];
                      return (
                        <div
                          key={idx}
                          className={`bg-white p-5 rounded-xl shadow-md border-2 ${colors.border} transform hover:scale-105 transition-transform`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{metric.label}</p>
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <p className={`text-4xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                            {metric.value}{metric.unit || "%"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bar chart section */}
                  <div className="bg-white p-6 rounded-xl shadow-inner border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      Detection Quality Metrics
                    </p>
                    <div className="space-y-4">
                      {[
                        { name: "mAP@50", value: 85.4, color: "from-orange-500 to-red-500" },
                        { name: "mAP@50-95", value: 68.4, color: "from-red-500 to-pink-500" },
                        { name: "Precision", value: 86.4, color: "from-amber-500 to-orange-500" },
                        { name: "Recall", value: 75.0, color: "from-green-500 to-emerald-500" },
                      ].map((m) => (
                        <div key={m.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{m.name}</span>
                            <span className="text-sm font-bold text-orange-600">{m.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className={`bg-gradient-to-r ${m.color} h-4 rounded-full`}
                              style={{ width: `${m.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-4">
                      Excellent detection accuracy • Strong localization performance
                    </p>
                  </div>

                  {/* Speed */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {speedMetrics.map((s, idx) => (
                      <div
                        key={idx}
                        className={`p-5 bg-gradient-to-br ${s.color} rounded-xl shadow-md text-white text-center transform hover:scale-105 transition-transform`}
                      >
                        <p className="text-xs font-medium opacity-90 mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Real-time & strengths */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Zap className="w-6 h-6 text-green-600" />
                          <h3 className="text-lg font-semibold text-green-800">Real-Time Performance</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-green-600">38 FPS</p>
                          <p className="text-xs text-green-700">Actual throughput</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        {["35", "38", "42"].map((fps, i) => (
                          <div key={i} className="bg-white/70 p-3 rounded-lg">
                            <p className="text-xs text-gray-600">{["Min", "Avg", "Max"][i]} FPS</p>
                            <p className="text-xl font-bold text-green-700">{fps}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-semibold text-green-800">Model Strengths</p>
                      </div>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">Check</span>
                          <span>High precision (86.4%) — minimal false alarms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">Check</span>
                          <span>Real-time capable at 35+ FPS on GPU</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">Check</span>
                          <span>Optimal speed-accuracy balance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">Check</span>
                          <span>Production-ready on Hugging Face</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetectDebris;