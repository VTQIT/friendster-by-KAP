import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  Heart,
  Smartphone,
  Lock,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  TreePine,
  MessageCircleQuestion,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#D4E5D7]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#2D9C4C] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-[#2D9C4C]">friendster</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-[#2D9C4C] text-[#2D9C4C] hover:bg-[#E8F5E9]"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
            <Button
              className="bg-[#2D9C4C] hover:bg-[#1A7A38] text-white"
              onClick={() => navigate("/login")}
            >
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#E8F5E9] to-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-[#2D9C4C] rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-3xl font-bold text-[#2D9C4C]">friendster</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-2">
              Friendster is back.
            </h1>
            <p className="text-xl text-[#2D9C4C] font-semibold mb-6">
              A new app. A new era.
            </p>
            <p className="text-[#5A6B5E] text-lg mb-8 leading-relaxed">
              Friendster returns in 2026 as a brand-new social app built for
              real-life connections, not likes or followers.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button
                size="lg"
                className="bg-[#2D9C4C] hover:bg-[#1A7A38] text-white px-8"
                onClick={() => navigate("/login")}
              >
                Sign up
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#2D9C4C] text-[#2D9C4C] hover:bg-[#E8F5E9] px-8"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-[#2D9C4C] rounded-3xl p-8 w-72 h-[500px] flex flex-col items-center justify-between shadow-2xl">
              <div className="text-white/80 text-sm">9:41</div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" fill="white" />
                </div>
                <span className="text-3xl font-bold text-white">friendster</span>
              </div>
              <div className="w-full space-y-3">
                <Button className="w-full bg-white text-[#2D9C4C] hover:bg-white/90 font-semibold">
                  Sign up
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/20 bg-transparent"
                >
                  Log in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#F5F9F6] rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#2D9C4C]/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#2D9C4C]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                Real-life first
              </h3>
              <p className="text-[#5A6B5E]">
                Add friends only by meeting in person.
              </p>
            </div>
            <div className="bg-[#F5F9F6] rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#2D9C4C]/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#2D9C4C]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                Private & intentional
              </h3>
              <p className="text-[#5A6B5E]">
                No ads. No algorithms. No follower counts.
              </p>
            </div>
            <div className="bg-[#F5F9F6] rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#2D9C4C]/10 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[#2D9C4C]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                Connections that matter
              </h3>
              <p className="text-[#5A6B5E]">
                Stay close to the people who are really in your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-[#F5F9F6]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#2D9C4C] mb-10 text-center">
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#2D9C4C] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">Meet in person</h3>
                <p className="text-[#5A6B5E] text-sm">
                  You can only add friends by meeting together IRL.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#2D9C4C] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">Build your circle</h3>
                <p className="text-[#5A6B5E] text-sm">
                  Only real friends you&apos;ve met make the cut.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#2D9C4C] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">Stay connected</h3>
                <p className="text-[#5A6B5E] text-sm">
                  The more you see each other, the stronger the bond.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-white rounded-xl p-4 flex items-center gap-3 max-w-md mx-auto">
            <TreePine className="w-5 h-5 text-[#2D9C4C]" />
            <p className="text-sm text-[#5A6B5E]">
              If life pulls you apart, connections can fade over time.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#1A1A1A] mb-8">
            NEW FRIENDSTER{" "}
            <span className="text-[#5A6B5E] font-normal">vs.</span> OLD FRIENDSTER
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#2D9C4C] rounded-2xl p-6 text-white">
              <div className="bg-white/20 rounded-lg px-4 py-2 inline-block mb-4 text-sm font-semibold">
                NEW (2026)
              </div>
              <ul className="space-y-3">
                {[
                  "No ads",
                  "No algorithms",
                  "No follower counts",
                  "Only real-life friends",
                  "Connections can fade over time",
                  "Private & intentional",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#5A6B5E] rounded-2xl p-6 text-white/80">
              <div className="bg-white/10 rounded-lg px-4 py-2 inline-block mb-4 text-sm font-semibold">
                OLD (2000s)
              </div>
              <ul className="space-y-3">
                {[
                  "Ads & corporate",
                  "Algorithm-driven",
                  "Followers & popularity",
                  "Anyone can add you",
                  "No fade concept",
                  "Web-first social network",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-12 px-4 bg-[#F5F9F6]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-[#2D9C4C] font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              IMPORTANT TO KNOW
            </h3>
            <p className="text-[#1A1A1A] font-semibold mb-2">
              This is NOT the original Friendster from the 2000s.
            </p>
            <p className="text-[#5A6B5E] text-sm">
              Your old account, photos, testimonials, and connections are gone.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-red-600 font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              BEWARE OF FAKES
            </h3>
            <p className="text-[#5A6B5E] text-sm">
              There have been fake &quot;Friendster comeback&quot; sites before.
              Download the official app only.
            </p>
          </div>
        </div>
      </section>

      {/* At a Glance */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#2D9C4C] mb-8 text-center">
            FRIENDSTER 2026 AT A GLANCE
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                {
                  icon: <Smartphone className="w-5 h-5" />,
                  title: "iPhone-only (for now)",
                  desc: "Available on the App Store. No Android or web yet.",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: "Private by design",
                  desc: "Your circle is small, personal, and ad-free.",
                },
                {
                  icon: <Lock className="w-5 h-5" />,
                  title: "Real-life powered",
                  desc: "Connect in person. Stay connected in life.",
                },
                {
                  icon: <Heart className="w-5 h-5" />,
                  title: "Quality over quantity",
                  desc: "It's about the people who matter.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-[#2D9C4C]/10 rounded-lg flex items-center justify-center text-[#2D9C4C] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A]">{item.title}</h4>
                    <p className="text-sm text-[#5A6B5E]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#F5F9F6] rounded-2xl p-6">
              <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5 text-[#2D9C4C]" />
                IS IT WORTH TRYING?
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-2xl">
                    <MessageCircleQuestion className="w-6 h-6 text-yellow-500" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm">Want nostalgia?</p>
                    <p className="text-sm text-[#5A6B5E]">
                      You won&apos;t get the old experience.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">
                    <Heart className="w-6 h-6 text-[#2D9C4C]" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm">
                      Want a quiet app with real friends?
                    </p>
                    <p className="text-sm text-[#5A6B5E]">
                      This might be perfect for you.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">
                    <XCircle className="w-6 h-6 text-red-500" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm">
                      Want something like Facebook/IG?
                    </p>
                    <p className="text-sm text-[#5A6B5E]">
                      This is a totally different vibe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D9C4C] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6" fill="white" />
            <p className="text-sm">
              Friendster isn&apos;t about how many friends you have. It&apos;s about
              the people who are really in your life.
            </p>
          </div>
          <Button
            className="bg-black text-white hover:bg-gray-900"
            onClick={() => {}}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Download on the App Store
          </Button>
        </div>
      </footer>
    </div>
  );
}
