import React, { useState, useEffect } from 'react';
import adminAPI from '../../services/adminAPI';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      title: 'Pending Orders',
      value: stats?.pending_orders || 0,
      icon: TrendingUp,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      title: 'Total Customers',
      value: stats?.total_customers || 0,
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-amber-500">
            {stats?.total_revenue?.toFixed(2) || '0.00'} SAR
          </div>
          <p className="text-sm text-gray-400 mt-2">Total revenue from all orders</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
