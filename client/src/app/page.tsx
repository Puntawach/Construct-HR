import { Hero } from "@/components/ui/v0/hero";
import { Navbar } from "@/components/ui/v0/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
    </main>
  );
}
