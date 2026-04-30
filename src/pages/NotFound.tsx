import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Heart, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F9F6] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#2D9C4C] rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-white" fill="white" />
        </div>
        <h1 className="text-6xl font-bold text-[#1A1A1A] mb-2">404</h1>
        <p className="text-xl text-[#5A6B5E] mb-2">Page not found</p>
        <p className="text-sm text-[#5A6B5E] mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Button
          className="bg-[#2D9C4C] hover:bg-[#1A7A38] text-white"
          onClick={() => navigate("/")}
        >
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
