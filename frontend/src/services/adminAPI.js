import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

class AdminAPI {
  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
  }

  // Auth
  async login(username, password) {
    const response = await axios.post(`${API}/admin/login`, { username, password });
    this.setToken(response.data.token);
    return response.data;
  }

  logout() {
    this.clearToken();
  }

  // Dashboard Stats
  async getDashboardStats() {
    const response = await axios.get(`${API}/admin/dashboard/stats`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Products
  async getProducts() {
    const response = await axios.get(`${API}/admin/products`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API}/admin/upload-image`, formData, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async deleteImage(imageUrl) {
    const response = await axios.delete(`${API}/admin/delete-image`, {
      params: { image_url: imageUrl },
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createProduct(productData) {
    const response = await axios.post(`${API}/admin/products`, productData, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateProduct(productId, productData) {
    const response = await axios.put(`${API}/admin/products/${productId}`, productData, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteProduct(productId) {
    const response = await axios.delete(`${API}/admin/products/${productId}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Orders
  async getOrders(confirmationStatus = null) {
    const params = {};
    if (confirmationStatus) {
      params.confirmation_status = confirmationStatus;
    }
    const response = await axios.get(`${API}/admin/orders`, {
      headers: this.getHeaders(),
      params
    });
    return response.data;
  }

  async getOrder(orderId) {
    const response = await axios.get(`${API}/admin/orders/${orderId}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateOrderStatus(orderId, status) {
    const response = await axios.put(
      `${API}/admin/orders/${orderId}/status`,
      { status },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async deleteOrder(orderId) {
    const response = await axios.delete(
      `${API}/admin/orders/${orderId}`,
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  // Customers
  async getCustomers() {
    const response = await axios.get(`${API}/admin/customers`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getCustomerOrders(phone) {
    const response = await axios.get(`${API}/admin/customers/${phone}/orders`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async blockCustomer(phone) {
    const response = await axios.post(
      `${API}/admin/customers/${phone}/block`,
      {},
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async unblockCustomer(phone) {
    const response = await axios.delete(`${API}/admin/customers/${phone}/block`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Notify Requests
  async getNotifyRequests() {
    const response = await axios.get(`${API}/admin/notify-requests`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getProductNotifyRequests(productId) {
    const response = await axios.get(`${API}/admin/notify-requests/${productId}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Coupons
  async getCoupons() {
    const response = await axios.get(`${API}/admin/coupons`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createCoupon(couponData) {
    const response = await axios.post(`${API}/admin/coupons`, couponData, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateCoupon(couponId, couponData) {
    const response = await axios.put(`${API}/admin/coupons/${couponId}`, couponData, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteCoupon(couponId) {
    const response = await axios.delete(`${API}/admin/coupons/${couponId}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Promotional Slides
  async getSlides() {
    const response = await axios.get(`${API}/admin/slides`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createSlide(slideData) {
    const response = await axios.post(`${API}/admin/slides`, slideData, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async uploadSlideImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API}/admin/slides/upload`, formData, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async updateSlide(slideId, slideData) {
    const response = await axios.put(`${API}/admin/slides/${slideId}`, slideData, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteSlide(slideId) {
    const response = await axios.delete(`${API}/admin/slides/${slideId}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async reorderSlides(slideOrders) {
    const response = await axios.put(`${API}/admin/slides/reorder`, slideOrders, {
      headers: this.getHeaders()
    });
    return response.data;
  }
}

export default new AdminAPI();
