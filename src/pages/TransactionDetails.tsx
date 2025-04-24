
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const TransactionDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/transactions" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Transaction Details</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction #{id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6">This is a placeholder for detailed transaction information.</p>
              <p className="text-gray-500 mb-6">In a complete implementation, this page would show:</p>
              <ul className="list-disc list-inside text-gray-600 text-left max-w-md mx-auto space-y-2">
                <li>Transaction status</li>
                <li>Payment details</li>
                <li>Pickup/delivery information</li>
                <li>Order timeline</li>
                <li>Buyer and seller information</li>
                <li>Actions (e.g. cancel, complete, etc.)</li>
              </ul>
              <Button className="mt-8 bg-blue-600 hover:bg-blue-700">
                <Link to="/transactions">Return to Transactions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetails;
