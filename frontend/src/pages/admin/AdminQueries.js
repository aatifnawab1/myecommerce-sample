import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, EyeOff, Clock, User, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import adminAPI from '../../services/adminAPI';
import { toast } from 'sonner';

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const data = await adminAPI.getContactQueries();
      setQueries(data);
    } catch (error) {
      toast.error('Failed to fetch contact queries');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuery = async (query) => {
    setSelectedQuery(query);
    setIsDialogOpen(true);
    
    // Mark as read if unread
    if (!query.is_read) {
      try {
        await adminAPI.markQueryAsRead(query.id);
        setQueries(queries.map(q => 
          q.id === query.id ? { ...q, is_read: true } : q
        ));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleDelete = async (queryId, e) => {
    e?.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this query?')) return;
    
    try {
      await adminAPI.deleteContactQuery(queryId);
      toast.success('Query deleted successfully');
      setQueries(queries.filter(q => q.id !== queryId));
      if (selectedQuery?.id === queryId) {
        setIsDialogOpen(false);
        setSelectedQuery(null);
      }
    } catch (error) {
      toast.error('Failed to delete query');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = queries.filter(q => !q.is_read).length;

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
          <h1 className="text-2xl font-bold text-white">Contact Queries</h1>
          <p className="text-gray-400 text-sm mt-1">
            View and manage customer inquiries
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-amber-500 text-black">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Queries List */}
      {queries.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No queries yet</h3>
            <p className="text-gray-400">Customer inquiries will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <Card 
              key={query.id} 
              className={`bg-zinc-900 border-zinc-800 cursor-pointer hover:border-amber-500/50 transition-all ${
                !query.is_read ? 'border-l-4 border-l-amber-500' : ''
              }`}
              onClick={() => handleViewQuery(query)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {!query.is_read && (
                        <Badge className="bg-amber-500 text-black text-xs">New</Badge>
                      )}
                      <h3 className="font-semibold text-white truncate">{query.subject}</h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {query.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {query.email}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm line-clamp-2">{query.message}</p>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <Clock className="h-3 w-3" />
                      {formatDate(query.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewQuery(query);
                      }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      title="View"
                    >
                      {query.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={(e) => handleDelete(query.id, e)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Query Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedQuery?.subject}</DialogTitle>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">From</p>
                  <p className="text-white font-medium">{selectedQuery.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <a 
                    href={`mailto:${selectedQuery.email}`} 
                    className="text-amber-500 hover:text-amber-400"
                  >
                    {selectedQuery.email}
                  </a>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Received</p>
                  <p className="text-white">{formatDate(selectedQuery.created_at)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 mb-2">Message</p>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-white whitespace-pre-wrap">{selectedQuery.message}</p>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t border-zinc-700">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={() => handleDelete(selectedQuery.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <a href={`mailto:${selectedQuery.email}?subject=Re: ${selectedQuery.subject}`}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQueries;
