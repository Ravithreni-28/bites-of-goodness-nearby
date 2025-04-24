
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MapLocation = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data, error } = await supabase
          .from('food_listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast({
          title: "Error",
          description: "Failed to load location data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={`/listing/${id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listing
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Location</h1>
            {loading ? (
              <div className="animate-pulse h-64 bg-gray-200"></div>
            ) : listing ? (
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <div className="text-center text-gray-500">
                    <MapPin className="mx-auto h-12 w-12 mb-2" />
                    <p>Map visualization would appear here</p>
                    <p className="text-sm mt-2">For privacy reasons, exact location is approximated</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Pickup Location</h3>
                  <p className="text-gray-700">{listing.location}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>For safety reasons, the exact address will only be shared after the seller confirms your request.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Location information not available</p>
                <Link to="/">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Browse Other Listings
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;
