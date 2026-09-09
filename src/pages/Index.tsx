import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CoralInfo from "@/components/CoralInfo";
import AnalysisCards from "@/components/AnalysisCards";
import HeatMapSection from "@/components/HeatMapSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <CoralInfo />
        <AnalysisCards />
        <HeatMapSection />
      </main>
    </div>
  );
};

export default Index;
