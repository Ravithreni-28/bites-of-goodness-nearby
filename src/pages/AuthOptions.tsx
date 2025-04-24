
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AuthOptions = () => {
  const { user } = useAuth();

  // Redirect to home if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Welcome to Zero Waste Bites</CardTitle>
          <CardDescription className="text-lg">
            Join our community to reduce food waste and connect with neighbors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Link to="/login" className="w-full">
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center p-6 text-lg border border-gray-300 hover:border-gray-400"
            >
              <div className="flex items-center">
                <LogIn className="mr-3 h-5 w-5" />
                <span>Sign in with your account</span>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/register" className="w-full">
            <Button 
              className="w-full flex justify-between items-center p-6 text-lg bg-blue-600 hover:bg-blue-700"
            >
              <div className="flex items-center">
                <UserPlus className="mr-3 h-5 w-5" />
                <span>Create a new account</span>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="text-center text-sm text-gray-500">
            By continuing, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthOptions;
