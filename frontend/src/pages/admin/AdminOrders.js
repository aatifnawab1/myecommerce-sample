import React, { useState, useEffect } from 'react';
import adminAPI from '../../services/adminAPI';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Card, CardContent } from '../../components/ui/card';
import { Eye, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationFilter, setConfirmationFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [confirmationFilter]);

  const fetchOrders = async () => {
    try {
      const filterValue = confirmationFilter === 'all' ? null : confirmationFilter;
      const data = await adminAPI.getOrders(filterValue);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const order = await adminAPI.getOrder(orderId);
      setSelectedOrder(order);
      setDialogOpen(true);
    } catch (error) {
      toast.error('Failed to fetch order details');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'text-yellow-500',
      'Confirmed': 'text-blue-500',
      'Shipped': 'text-purple-500',
      'Delivered': 'text-green-500',
      'Cancelled': 'text-red-500'
    };
    return colors[status] || 'text-gray-500';
  };

  if (loading) {
    return <div className="text-white">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Orders Management</h1>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-gray-400">Order ID:</span>
                    <span className="text-white font-mono">{order.id.substring(0, 8)}</span>
                    <span className={`font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Customer:</span>
                      <p className="text-white font-medium">{order.customer_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <p className="text-white">{order.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Total:</span>
                      <p className="text-amber-500 font-bold">{order.total} SAR</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <p className="text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleViewOrder(order.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-black"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="text-white font-mono">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Order Date</p>
                  <p className="text-white">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-white">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">City</p>
                    <p className="text-white">{selectedOrder.city}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400">Delivery Address</p>
                    <p className="text-white">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-zinc-800 p-3 rounded-md">
                      <img src={item.image} alt={item.name_en} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name_en}</p>
                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-amber-500 font-bold">{item.price * item.quantity} SAR</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span>{selectedOrder.subtotal} SAR</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount:</span>
                      <span>-{selectedOrder.discount} SAR</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total:</span>
                    <span className="text-amber-500">{selectedOrder.total} SAR</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <Label className="text-white mb-2 block">Update Order Status</Label>
                <Select value={selectedOrder.status} onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
