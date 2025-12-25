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
import { Eye, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await adminAPI.getCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = async (customer) => {
    try {
      const orders = await adminAPI.getCustomerOrders(customer._id);
      setSelectedCustomer(customer);
      setCustomerOrders(orders);
      setDialogOpen(true);
    } catch (error) {
      toast.error('Failed to fetch customer orders');
    }
  };

  const handleBlockToggle = async (phone, isBlocked) => {
    try {
      if (isBlocked) {
        await adminAPI.unblockCustomer(phone);
        toast.success('Customer unblocked successfully');
      } else {
        if (!window.confirm('Are you sure you want to block this customer?')) return;
        await adminAPI.blockCustomer(phone);
        toast.success('Customer blocked successfully');
      }
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to update customer status');
    }
  };

  if (loading) {
    return <div className="text-white">Loading customers...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Customers Management</h1>

      <div className="grid grid-cols-1 gap-4">
        {customers.map((customer) => (
          <Card key={customer._id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                    {customer.is_blocked && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full">
                        Blocked
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <p className="text-white">{customer._id}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">City:</span>
                      <p className="text-white">{customer.city}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Orders:</span>
                      <p className="text-white font-bold">{customer.total_orders}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Cancelled:</span>
                      <p className="text-red-400">{customer.cancelled_orders}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Spent:</span>
                      <p className="text-amber-500 font-bold">{customer.total_spent.toFixed(2)} SAR</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleViewCustomer(customer)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBlockToggle(customer._id, customer.is_blocked)}
                    className={customer.is_blocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                  >
                    {customer.is_blocked ? (
                      <><CheckCircle className="h-4 w-4 mr-2" />Unblock</>
                    ) : (
                      <><Ban className="h-4 w-4 mr-2" />Block</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Customer Order History</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="bg-zinc-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-white mb-3">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="text-white">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <p className="text-white">{selectedCustomer._id}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">City:</span>
                    <p className="text-white">{selectedCustomer.city}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Orders:</span>
                    <p className="text-white font-bold">{selectedCustomer.total_orders}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order History</h3>
                <div className="space-y-3">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="bg-zinc-800 p-4 rounded-md">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-white font-medium">Order #{order.id.substring(0, 8)}</p>
                          <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-amber-500 font-bold">{order.total} SAR</p>
                          <p className={`text-sm ${
                            order.status === 'Delivered' ? 'text-green-500' :
                            order.status === 'Cancelled' ? 'text-red-500' :
                            'text-yellow-500'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {order.items.length} item(s)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
