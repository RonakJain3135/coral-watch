import { useState } from "react";
import {
  ArrowLeft,
  Upload,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import healthyCoralImage from "@/assets/healthy-coral-vibrant.jpg";
import { analyzeCoralHealth } from "@/services/coralService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { analyzeCoralHealth } from "@/services/coralService";

const CoralHealth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [showYoloMetrics, setShowYoloMetrics] = useState(false);
  const [showResNetMetrics, setShowResNetMetrics] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResults(null);
      setAnnotatedImage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResults(null);
      setAnnotatedImage(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress(0);
    setResults(null);
    setAnnotatedImage(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 12;
        return next > 85 ? 85 : next;
      });
    }, 350);

    try {
      const response = await analyzeCoralHealth(selectedFile);
      clearInterval(progressInterval);
      setProgress(100);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.image) {
        setAnnotatedImage(response.image);
      } else if (selectedImage) {
        setAnnotatedImage(selectedImage);
      }

      setResults(response.results || []);

      toast({
        title: "Analysis Complete!",
        description: `Detected ${response.results?.length || 0} coral condition(s)`,
      });

      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      clearInterval(progressInterval);
    } finally {
      setTimeout(() => setProgress(0), 1500);
      setIsAnalyzing(false);
    }
  };

  const healthIndicators = [
    {
      title: "Vibrant Colors",
      description:
        "Healthy corals display bright, vivid colors from symbiotic algae (zooxanthellae)",
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      title: "No Bleaching",
      description:
        "Absence of white or pale patches indicates the coral hasn't expelled its zooxanthellae",
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      title: "Intact Structure",
      description:
        "Firm, solid skeleton with no visible breaks, cracks, or erosion",
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      title: "Active Polyps",
      description:
        "Polyps should be extended and feeding, especially during nighttime",
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
  ];

  const unhealthyIndicators = [
    {
      title: "Bleaching",
      description:
        "White or very pale appearance means coral has lost its zooxanthellae",
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Disease Signs",
      description:
        "Black band, white band, or unusual lesions indicate bacterial or fungal infections",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      title: "Tissue Loss",
      description:
        "Exposed skeleton or missing tissue patches suggest stress or predation",
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Algae Overgrowth",
      description:
        "Excessive algae covering coral surface competes for space and light",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ];

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
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Coral Health Check</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Identify signs of healthy and unhealthy corals using AI-powered
                analysis. Understanding coral health is crucial for reef
                conservation and early disease detection.
              </p>
            </div>

            {/* What to Check Section */}
            <div className="mb-12">
              <Card className="border-2 border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    How to Identify Healthy Coral
                  </CardTitle>
                  <CardDescription className="text-center text-base">
                    Learn the key indicators that distinguish healthy corals
                    from stressed or diseased ones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Healthy Coral Image */}
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden border-4 border-emerald-500/30">
                        <img
                          src={healthyCoralImage}
                          alt="Healthy vibrant coral reef with brilliant colors"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg text-emerald-600 mb-2">
                          ✓ Healthy Coral Example
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Vibrant colors and active polyps indicate thriving
                          coral
                        </p>
                      </div>
                    </div>

                    {/* Unhealthy Coral Image */}
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden border-4 border-red-500/30">
                        <img
                          src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&auto=format&fit=crop"
                          alt="Bleached coral showing signs of stress"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg text-red-600 mb-2">
                          ✗ Unhealthy Coral Example
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Bleaching and pale colors signal coral stress
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Healthy Indicators */}
                    <div>
                      <h4 className="font-semibold text-emerald-600 mb-4 text-lg flex items-center gap-2">
                        <CheckCircle2 size={24} />
                        Signs of Healthy Coral
                      </h4>
                      <div className="space-y-3">
                        {healthIndicators.map((indicator) => (
                          <div
                            key={indicator.title}
                            className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg"
                          >
                            <indicator.icon
                              className={`${indicator.color} flex-shrink-0 mt-0.5`}
                              size={20}
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {indicator.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {indicator.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Unhealthy Indicators */}
                    <div>
                      <h4 className="font-semibold text-red-600 mb-4 text-lg flex items-center gap-2">
                        <XCircle size={24} />
                        Warning Signs to Watch For
                      </h4>
                      <div className="space-y-3">
                        {unhealthyIndicators.map((indicator) => (
                          <div
                            key={indicator.title}
                            className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
                          >
                            <indicator.icon
                              className={`${indicator.color} flex-shrink-0 mt-0.5`}
                              size={20}
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {indicator.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {indicator.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upload Section */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Upload Coral Image for Analysis</CardTitle>
                <CardDescription>
                  Our AI will detect coral in your image and assess its health
                  status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                >
                  {selectedImage ? (
                    <div className="space-y-6">
                      <img
                        src={selectedImage}
                        alt="Uploaded coral"
                        className="max-h-96 mx-auto rounded-lg shadow-lg"
                      />
                      {isAnalyzing && (
                        <div className="space-y-2">
                          <Progress value={progress} className="w-full" />
                          <p className="text-sm text-center text-muted-foreground">
                            Analyzing coral health...
                          </p>
                        </div>
                      )}
                      <div className="flex gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedImage(null);
                            setSelectedFile(null);
                            setResults(null);
                            setAnnotatedImage(null);
                          }}
                          disabled={isAnalyzing}
                        >
                          Remove Image
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            "Analyze Health"
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
                        or click to browse from your device (JPG, PNG, WEBP -
                        Max 10MB)
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

            {/* Results Section */}
            {(annotatedImage || results) && (
              <Card className="border-2 mt-8" id="results-section">
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    AI-powered coral health detection results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Annotated Image with Bounding Boxes */}
                  {annotatedImage && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Detected Corals</h3>
                      <img
                        src={annotatedImage}
                        alt="Analyzed coral with bounding boxes"
                        className="max-h-[600px] mx-auto rounded-lg shadow-lg border-2"
                      />
                      <p className="text-sm text-muted-foreground text-center">
                        Green boxes indicate healthy coral, red boxes indicate
                        bleached coral
                      </p>
                    </div>
                  )}

                  {/* Overall Health Status */}
                  {results && results.length > 0 && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-2">
                                Overall Status
                              </p>
                              <p
                                className={`text-2xl font-bold ${
                                  results.filter((r: any) =>
                                    r.health?.toLowerCase().includes("healthy"),
                                  ).length /
                                    results.length >
                                  0.6
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {results.filter((r: any) =>
                                  r.health?.toLowerCase().includes("healthy"),
                                ).length /
                                  results.length >
                                0.6
                                  ? "Healthy Reef"
                                  : "At Risk"}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-2">
                                Health Rate
                              </p>
                              <p
                                className={`text-2xl font-bold ${
                                  Math.round(
                                    (results.filter((r: any) =>
                                      r.health
                                        ?.toLowerCase()
                                        .includes("healthy"),
                                    ).length /
                                      results.length) *
                                      100,
                                  ) > 60
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {Math.round(
                                  (results.filter((r: any) =>
                                    r.health?.toLowerCase().includes("healthy"),
                                  ).length /
                                    results.length) *
                                    100,
                                )}
                                %
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Detection List */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Detections</h3>
                        {results.map((result: any, index: number) => {
                          const isHealthy = result.health
                            ?.toLowerCase()
                            .includes("healthy");
                          const confidence = Math.round(
                            (result.confidence || 0) * 100,
                          );

                          return (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border-l-4 ${
                                isHealthy
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500"
                                  : "bg-red-50 dark:bg-red-950/20 border-red-500"
                              } flex justify-between items-center animate-fade-in`}
                              style={{
                                animationDelay: `${index * 80}ms`,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {isHealthy ? (
                                  <CheckCircle2
                                    className="text-emerald-600"
                                    size={20}
                                  />
                                ) : (
                                  <XCircle className="text-red-600" size={20} />
                                )}
                                <span className="font-medium">
                                  {result.health}
                                </span>
                              </div>
                              <span
                                className={`font-bold ${
                                  isHealthy
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {confidence}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {results && results.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No corals detected in the image
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ================================================= */}
            {/* ALWAYS VISIBLE: Model Performance Dashboard */}
            {/* ================================================= */}
            <div className="mt-16 max-w-5xl mx-auto">
              <Card className="border-2 border-emerald-500/30 shadow-xl bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                    <Activity className="w-7 h-7 text-emerald-600" />
                    AI Model Performance Dashboard
                  </CardTitle>
                  <CardDescription className="text-base">
                    Dual-model system: <strong>ResNet (Classification)</strong>{" "}
                    + <strong>YOLOv11 (Detection)</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* === YOLOv11 Detection Model === */}
                  <div className="border-2 border-blue-500/30 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowYoloMetrics(!showYoloMetrics)}
                      className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 p-5 flex items-center justify-between hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/50 dark:hover:to-cyan-900/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                          YOLOv11m Coral Detection Model
                        </h3>
                      </div>
                      {showYoloMetrics ? (
                        <ChevronUp className="text-blue-600" />
                      ) : (
                        <ChevronDown className="text-blue-600" />
                      )}
                    </button>

                    {showYoloMetrics && (
                      <div className="p-6 bg-white dark:bg-gray-800/50 space-y-6 animate-fade-in">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                            <p className="text-xs text-muted-foreground mb-1">
                              mAP50
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              85.4%
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                            <p className="text-xs text-muted-foreground mb-1">
                              Precision
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                              86.4%
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 rounded-xl border border-green-200 dark:border-green-700">
                            <p className="text-xs text-muted-foreground mb-1">
                              Recall
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              75.0%
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-4 rounded-xl border border-orange-200 dark:border-orange-700">
                            <p className="text-xs text-muted-foreground mb-1">
                              mAP50-95
                            </p>
                            <p className="text-2xl font-bold text-orange-600">
                              68.4%
                            </p>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Precision vs Recall */}
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border">
                            <p className="text-sm font-semibold text-muted-foreground mb-4">
                              Detection Performance
                            </p>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={[
                                    { name: "Precision", value: 86.4 },
                                    { name: "Recall", value: 75.0 },
                                    { name: "mAP50", value: 85.4 },
                                  ]}
                                  margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 20,
                                  }}
                                >
                                  <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12, fontWeight: 600 }}
                                  />
                                  <YAxis
                                    domain={[65, 90]}
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(val) => `${val}%`}
                                  />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "rgba(255,255,255,0.98)",
                                      border: "2px solid #3b82f6",
                                      borderRadius: "12px",
                                      padding: "8px 12px",
                                    }}
                                    formatter={(value) => [`${value}%`]}
                                  />
                                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                    {[
                                      { color: "#a855f7" },
                                      { color: "#10b981" },
                                      { color: "#3b82f6" },
                                    ].map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                      />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Inference Performance */}
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border space-y-3">
                            <p className="text-sm font-semibold text-muted-foreground mb-3">
                              Inference Performance
                            </p>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <span className="text-sm font-medium">
                                  Speed
                                </span>
                                <span className="text-lg font-bold text-blue-600">
                                  25.8 ms
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <span className="text-sm font-medium">
                                  Throughput
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                  ~38 FPS
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <span className="text-sm font-medium">
                                  Device
                                </span>
                                <span className="text-sm font-bold text-purple-600">
                                  Tesla T4 GPU
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Model Info */}
                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                            <span className="font-medium">Architecture</span>
                            <span className="font-bold text-blue-600">
                              YOLO11m
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200 dark:border-cyan-800">
                            <span className="font-medium">Input Size</span>
                            <span className="font-bold text-cyan-600">
                              640×640
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-800">
                            <span className="font-medium">Epochs</span>
                            <span className="font-bold text-teal-600">100</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* === ResNet Classification Model === */}
                  <div className="border-2 border-emerald-500/30 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowResNetMetrics(!showResNetMetrics)}
                      className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 p-5 flex items-center justify-between hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                          ResNet-50 Health Classification Model
                        </h3>
                      </div>
                      {showResNetMetrics ? (
                        <ChevronUp className="text-emerald-600" />
                      ) : (
                        <ChevronDown className="text-emerald-600" />
                      )}
                    </button>

                    {showResNetMetrics && (
                      <div className="p-6 bg-white dark:bg-gray-800/50 space-y-6 animate-fade-in">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
                            <p className="text-xs text-muted-foreground mb-1">
                              Test Accuracy
                            </p>
                            <p className="text-3xl font-bold text-emerald-600">
                              85.25%
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 p-4 rounded-xl border border-teal-200 dark:border-teal-700">
                            <p className="text-xs text-muted-foreground mb-1">
                              Macro F1-Score
                            </p>
                            <p className="text-3xl font-bold text-teal-600">
                              0.852
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-4 rounded-xl border border-orange-200 dark:border-orange-700">
                            <p className="text-xs text-muted-foreground mb-1">
                              Test Loss
                            </p>
                            <p className="text-3xl font-bold text-orange-600">
                              0.312
                            </p>
                          </div>
                        </div>

                        {/* Performance Graphs */}
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Accuracy Comparison */}
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border">
                            <p className="text-sm font-semibold text-muted-foreground mb-4">
                              Accuracy Across Phases
                            </p>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={[
                                    { name: "Train", value: 88.3 },
                                    { name: "Val", value: 84.96 },
                                    { name: "Test", value: 85.25 },
                                  ]}
                                  margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 20,
                                  }}
                                >
                                  <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 13, fontWeight: 600 }}
                                  />
                                  <YAxis
                                    domain={[75, 92]}
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(val) => `${val}%`}
                                  />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "rgba(255,255,255,0.98)",
                                      border: "2px solid #10b981",
                                      borderRadius: "12px",
                                      padding: "8px 12px",
                                    }}
                                    formatter={(value) => [
                                      `${value}%`,
                                      "Accuracy",
                                    ]}
                                  />
                                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                    {[
                                      { color: "#10b981" },
                                      { color: "#14b8a6" },
                                      { color: "#06b6d4" },
                                    ].map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                      />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* F1-Score by Class */}
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border">
                            <p className="text-sm font-semibold text-muted-foreground mb-4">
                              F1-Score by Class
                            </p>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={[
                                    { name: "Bleached", f1: 0.859 },
                                    { name: "Healthy", f1: 0.845 },
                                  ]}
                                  margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 20,
                                  }}
                                  layout="vertical"
                                >
                                  <XAxis
                                    type="number"
                                    domain={[0.8, 0.9]}
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(val) => val.toFixed(2)}
                                  />
                                  <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fontSize: 13, fontWeight: 600 }}
                                    width={80}
                                  />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "rgba(255,255,255,0.98)",
                                      border: "2px solid #f59e0b",
                                      borderRadius: "12px",
                                      padding: "8px 12px",
                                    }}
                                    formatter={(value) => [
                                      value.toFixed(3),
                                      "F1-Score",
                                    ]}
                                  />
                                  <Bar
                                    dataKey="f1"
                                    radius={[0, 10, 10, 0]}
                                    fill="#f59e0b"
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>

                        {/* Class Performance Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                            <span className="font-medium text-orange-700 dark:text-orange-400">
                              Bleached Coral F1
                            </span>
                            <span className="font-bold text-orange-600">
                              0.859
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <span className="font-medium text-emerald-700 dark:text-emerald-400">
                              Healthy Coral F1
                            </span>
                            <span className="font-bold text-emerald-600">
                              0.845
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
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

export default CoralHealth;
