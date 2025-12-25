import React, { useState, useEffect } from 'react';
import adminAPI from '../../services/adminAPI';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Card, CardContent } from '../../components/ui/card';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    category: 'perfume',
    price: '',
    original_price: '',
    quantity: '',
    images: [],
    is_visible: true,
    specs: null
  });
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await adminAPI.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
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

  const handleImageChange = (e) => {
    const urls = e.target.value.split('\n').filter(url => url.trim());
    setFormData(prev => ({ ...prev, images: urls }));
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      category: 'perfume',
      price: '',
      original_price: '',
      quantity: '',
      images: [],
      is_visible: true,
      specs: null
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name_en: product.name_en,
      name_ar: product.name_ar,
      description_en: product.description_en,
      description_ar: product.description_ar,
      category: product.category,
      price: product.price,
      original_price: product.original_price || '',
      quantity: product.quantity,
      images: product.images || [],
      is_visible: product.is_visible,
      specs: product.specs
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      quantity: parseInt(formData.quantity)
    };

    try {
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await adminAPI.createProduct(productData);
        toast.success('Product created successfully');
      }
      
      fetchProducts();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await adminAPI.deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const toggleVisibility = async (product) => {
    try {
      await adminAPI.updateProduct(product.id, { is_visible: !product.is_visible });
      toast.success('Product visibility updated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  if (loading) {
    return <div className="text-white">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Products Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_en" className="text-white">Product Name (English)</Label>
                  <Input
                    id="name_en"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_ar" className="text-white">Product Name (Arabic)</Label>
                  <Input
                    id="name_ar"
                    name="name_ar"
                    value={formData.name_ar}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description_en" className="text-white">Description (English)</Label>
                <Textarea
                  id="description_en"
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description_ar" className="text-white">Description (Arabic)</Label>
                <Textarea
                  id="description_ar"
                  name="description_ar"
                  value={formData.description_ar}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="perfume">Perfume</SelectItem>
                      <SelectItem value="drone">Drone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price" className="text-white">Price (SAR)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="original_price" className="text-white">Original Price (Optional)</Label>
                  <Input
                    id="original_price"
                    name="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quantity" className="text-white">Stock Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="images" className="text-white">Image URLs (one per line)</Label>
                <Textarea
                  id="images"
                  value={formData.images.join('\n')}
                  onChange={handleImageChange}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  rows={4}
                  placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_visible"
                  name="is_visible"
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="is_visible" className="text-white">Product Visible to Customers</Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  {editingProduct ? 'Update Product' : 'Create Product'}
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

      <div className="grid grid-cols-1 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name_en}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{product.name_en}</h3>
                      <p className="text-gray-400">{product.name_ar}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleVisibility(product)}
                        className="text-gray-400 hover:text-white"
                      >
                        {product.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description_en}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white ml-2 capitalize">{product.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Price:</span>
                      <span className="text-amber-500 ml-2 font-bold">{product.price} SAR</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Stock:</span>
                      <span className={`ml-2 font-semibold ${product.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {product.quantity} units
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 ${product.is_visible ? 'text-green-500' : 'text-gray-500'}`}>
                        {product.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
