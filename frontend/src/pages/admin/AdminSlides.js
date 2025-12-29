import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical, Eye, EyeOff, Upload, X, Image } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';
import adminAPI from '../../services/adminAPI';
import { toast } from 'sonner';

const AdminSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    alt_text_en: '',
    alt_text_ar: '',
    link_url: '',
    is_active: true
  });
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const data = await adminAPI.getSlides();
      setSlides(data);
    } catch (error) {
      toast.error('Failed to fetch slides');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB');
      return;
    }

    setUploading(true);
    try {
      const result = await adminAPI.uploadSlideImage(file);
      setFormData(prev => ({ ...prev, image_url: result.url }));
      setPreviewImage(URL.createObjectURL(file));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast.error('Please upload an image');
      return;
    }

    try {
      await adminAPI.createSlide({
        ...formData,
        order: slides.length
      });
      toast.success('Slide created successfully');
      setIsDialogOpen(false);
      resetForm();
      fetchSlides();
    } catch (error) {
      toast.error('Failed to create slide');
    }
  };

  const resetForm = () => {
    setFormData({
      image_url: '',
      alt_text_en: '',
      alt_text_ar: '',
      link_url: '',
      is_active: true
    });
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      await adminAPI.deleteSlide(slideId);
      toast.success('Slide deleted successfully');
      fetchSlides();
    } catch (error) {
      toast.error('Failed to delete slide');
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      await adminAPI.updateSlide(slide.id, { is_active: !slide.is_active });
      toast.success(`Slide ${slide.is_active ? 'hidden' : 'shown'}`);
      fetchSlides();
    } catch (error) {
      toast.error('Failed to update slide');
    }
  };

  const moveSlide = async (index, direction) => {
    const newSlides = [...slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= slides.length) return;
    
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    
    // Update order values
    const slideOrders = newSlides.map((slide, i) => ({
      id: slide.id,
      order: i
    }));
    
    try {
      await adminAPI.reorderSlides(slideOrders);
      setSlides(newSlides);
      toast.success('Slides reordered');
    } catch (error) {
      toast.error('Failed to reorder slides');
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${process.env.REACT_APP_BACKEND_URL}${url}`;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Promotional Slides</h1>
          <p className="text-gray-400 text-sm mt-1">Manage the slider images on your landing page</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Slide</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label className="text-white mb-2 block">Slide Image *</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    previewImage ? 'border-amber-500' : 'border-zinc-600 hover:border-zinc-500'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewImage ? (
                    <div className="relative">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage('');
                          setFormData(prev => ({ ...prev, image_url: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      {uploading ? (
                        <div className="animate-pulse">Uploading...</div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 mx-auto mb-2 text-zinc-500" />
                          <p>Click to upload image</p>
                          <p className="text-xs mt-1">JPEG, PNG, WebP, GIF (max 5MB)</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Alt Text English */}
              <div>
                <Label htmlFor="alt_text_en" className="text-white">Alt Text (English)</Label>
                <Input
                  id="alt_text_en"
                  value={formData.alt_text_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text_en: e.target.value }))}
                  placeholder="Description for the image"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              {/* Alt Text Arabic */}
              <div>
                <Label htmlFor="alt_text_ar" className="text-white">Alt Text (Arabic)</Label>
                <Input
                  id="alt_text_ar"
                  value={formData.alt_text_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text_ar: e.target.value }))}
                  placeholder="وصف الصورة"
                  className="bg-zinc-800 border-zinc-700 text-white"
                  dir="rtl"
                />
              </div>

              {/* Link URL (optional) */}
              <div>
                <Label htmlFor="link_url" className="text-white">Link URL (Optional)</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="https://..."
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active" className="text-white">Show on website</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                disabled={uploading || !formData.image_url}
              >
                Add Slide
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slides List */}
      {slides.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-12 text-center">
            <Image className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No slides yet</h3>
            <p className="text-gray-400 mb-4">Add promotional slides to display on your landing page</p>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-black"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Slide
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <Card key={slide.id} className={`bg-zinc-900 border-zinc-800 ${!slide.is_active && 'opacity-60'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSlide(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                    >
                      <GripVertical className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Image Preview */}
                  <div className="w-32 h-20 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(slide.image_url)}
                      alt={slide.alt_text_en || 'Slide'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {slide.alt_text_en || 'Promotional Slide'}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {slide.alt_text_ar || 'No Arabic description'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Order: {index + 1}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`p-2 rounded-lg transition-colors ${
                        slide.is_active 
                          ? 'text-green-500 hover:bg-green-500/10' 
                          : 'text-gray-500 hover:bg-gray-500/10'
                      }`}
                      title={slide.is_active ? 'Hide slide' : 'Show slide'}
                    >
                      {slide.is_active ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete slide"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <h3 className="text-amber-500 font-medium mb-2">Tips for best results:</h3>
        <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
          <li>Recommended image size: 1200x600 pixels (2:1 aspect ratio)</li>
          <li>Use high-quality images with clear text and branding</li>
          <li>Keep important content in the center for mobile compatibility</li>
          <li>Drag slides to reorder them on the landing page</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSlides;
