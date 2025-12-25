import React, { useState, useEffect } from 'react';
import adminAPI from '../../services/adminAPI';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Card, CardContent } from '../../components/ui/card';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    expiry_date: '',
    min_order_value: '',
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await adminAPI.getCoupons();
      setCoupons(data);
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_percentage: '',
      expiry_date: '',
      min_order_value: '',
      is_active: true
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_percentage: coupon.discount_percentage,
      expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : '',
      min_order_value: coupon.min_order_value || '',
      is_active: coupon.is_active
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const couponData = {
      code: formData.code.toUpperCase(),
      discount_percentage: parseFloat(formData.discount_percentage),
      expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null,
      min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : null,
      is_active: formData.is_active
    };

    try {
      if (editingCoupon) {
        await adminAPI.updateCoupon(editingCoupon.id, couponData);
        toast.success('Coupon updated successfully');
      } else {
        await adminAPI.createCoupon(couponData);
        toast.success('Coupon created successfully');
      }
      
      fetchCoupons();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save coupon');
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await adminAPI.deleteCoupon(couponId);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  if (loading) {
    return <div className="text-white">Loading coupons...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Coupons Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code" className="text-white">Coupon Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="WELCOME10"
                  className="bg-zinc-800 border-zinc-700 text-white uppercase"
                  required
                />
              </div>

              <div>
                <Label htmlFor="discount_percentage" className="text-white">Discount Percentage (%)</Label>
                <Input
                  id="discount_percentage"
                  name="discount_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="min_order_value" className="text-white">Minimum Order Value (SAR) - Optional</Label>
                <Input
                  id="min_order_value"
                  name="min_order_value"
                  type="number"
                  step="0.01"
                  value={formData.min_order_value}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="expiry_date" className="text-white">Expiry Date - Optional</Label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="is_active" className="text-white">Coupon Active</Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-12 text-center">
            <Tag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No coupons created yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-5 w-5 text-amber-500" />
                      <h3 className="text-xl font-bold text-white">{coupon.code}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      coupon.is_active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Discount:</span>
                    <span className="text-amber-500 font-bold ml-2">{coupon.discount_percentage}%</span>
                  </div>
                  
                  {coupon.min_order_value && (
                    <div>
                      <span className="text-gray-400">Min Order:</span>
                      <span className="text-white ml-2">{coupon.min_order_value} SAR</span>
                    </div>
                  )}
                  
                  {coupon.expiry_date && (
                    <div>
                      <span className="text-gray-400">Expires:</span>
                      <span className="text-white ml-2">
                        {new Date(coupon.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-gray-400">Used:</span>
                    <span className="text-white ml-2">{coupon.usage_count} times</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
