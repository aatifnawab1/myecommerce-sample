import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

class PublicAPI {
  // Products
  async getProducts() {
    const response = await axios.get(`${API}/products`);
    return response.data;
  }

  async getProduct(productId) {
    const response = await axios.get(`${API}/products/${productId}`);
    return response.data;
  }

  // Notify Me
  async createNotifyRequest(productId, phone, name = null) {
    const response = await axios.post(`${API}/notify-me`, {
      product_id: productId,
      phone,
      name
    });
    return response.data;
  }

  // Orders
  async createOrder(orderData) {
    const response = await axios.post(`${API}/orders`, orderData);
    return response.data;
  }

  // Coupons
  async validateCoupon(code, orderTotal) {
    const response = await axios.post(`${API}/coupons/validate`, {
      code,
      order_total: orderTotal
    });
    return response.data;
  }

  // Order Tracking
  async trackOrder(orderId, phone) {
    const response = await axios.post(`${API}/orders/track`, {
      order_id: orderId,
      phone
    });
    return response.data;
  }
}

export default new PublicAPI();
