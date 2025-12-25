import React, { useState, useEffect } from 'react';
import adminAPI from '../../services/adminAPI';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Card, CardContent } from '../../components/ui/card';
import { Eye, Bell } from 'lucide-react';
import { toast } from 'sonner';

const AdminDemand = () => {
  const [demandData, setDemandData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requests, setRequests] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemandData();
  }, []);

  const fetchDemandData = async () => {
    try {
      const data = await adminAPI.getNotifyRequests();
      setDemandData(data);
    } catch (error) {
      toast.error('Failed to fetch demand data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequests = async (product) => {
    try {
      const data = await adminAPI.getProductNotifyRequests(product._id);
      setSelectedProduct(product);
      setRequests(data);
      setDialogOpen(true);
    } catch (error) {
      toast.error('Failed to fetch requests');
    }
  };

  if (loading) {
    return <div className="text-white">Loading product demand data...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Product Demand Tracking</h1>
        <p className="text-gray-400">View customer requests for out-of-stock products</p>
      </div>

      {demandData.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notification requests yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demandData.map((item) => (
            <Card key={item._id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {item.product_name_en}
                  </h3>
                  <p className="text-sm text-gray-400">{item.product_name_ar}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Total Requests</p>
                    <p className="text-3xl font-bold text-amber-500">{item.count}</p>
                  </div>
                  <Bell className="h-8 w-8 text-amber-500" />
                </div>

                <Button
                  onClick={() => handleViewRequests(item)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Requests
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Notification Requests</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="bg-zinc-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {selectedProduct.product_name_en}
                </h3>
                <p className="text-gray-400">{selectedProduct.product_name_ar}</p>
                <p className="text-amber-500 font-bold mt-2">
                  {selectedProduct.count} notification request(s)
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Customer Requests</h3>
                <div className="space-y-3">
                  {requests.map((request, index) => (
                    <div key={request.id || index} className="bg-zinc-800 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Phone Number</p>
                          <p className="text-white font-medium">{request.phone}</p>
                        </div>
                        {request.name && (
                          <div>
                            <p className="text-sm text-gray-400">Name</p>
                            <p className="text-white">{request.name}</p>
                          </div>
                        )}
                        <div className="col-span-2">
                          <p className="text-sm text-gray-400">Request Date</p>
                          <p className="text-white">{new Date(request.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-4">
                <p className="text-sm text-blue-400">
                  <strong>Note:</strong> Contact these customers when the product is back in stock.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDemand;
