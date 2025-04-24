
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Send, User, Clock, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<any[]>([]);
  const [activeChatDetails, setActiveChatDetails] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set active chat from location state if available
  useEffect(() => {
    if (location.state?.chatId) {
      setActiveChatId(location.state.chatId);
    }
  }, [location]);

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      
      try {
        // Get all chats where user is either buyer or seller
        const { data, error } = await supabase
          .from('chats')
          .select(`
            *,
            food_listings(*),
            buyer:buyer_id(username, full_name, avatar_url),
            seller:seller_id(username, full_name, avatar_url)
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setChats(data || []);
        
        // If no active chat is set and we have chats, set the first one as active
        if (!activeChatId && data && data.length > 0) {
          setActiveChatId(data[0].id);
        }
        
      } catch (error) {
        console.error('Error fetching chats:', error);
        toast({
          title: "Error",
          description: "Failed to load chats",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [user, toast, activeChatId]);

  // Fetch active chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId) return;
      
      try {
        // Get chat details
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select(`
            *,
            food_listings(*),
            buyer:buyer_id(username, full_name, avatar_url),
            seller:seller_id(username, full_name, avatar_url)
          `)
          .eq('id', activeChatId)
          .single();
          
        if (chatError) throw chatError;
        setActiveChatDetails(chatData);
        
        // Determine the other user
        const isUserBuyer = user?.id === chatData.buyer_id;
        setOtherUser(isUserBuyer ? chatData.seller : chatData.buyer);
        
        // Get messages
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', activeChatId)
          .order('created_at', { ascending: true });
          
        if (messagesError) throw messagesError;
        setActiveChatMessages(messages || []);
        
        // Mark messages as read
        const unreadMessages = messages?.filter(
          msg => msg.sender_id !== user?.id && !msg.read_at
        ) || [];
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadMessages.map(msg => msg.id));
        }
        
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${activeChatId}` },
        (payload) => {
          const newMessage = payload.new as any;
          setActiveChatMessages(prev => [...prev, newMessage]);
          
          // Mark message as read if we're not the sender
          if (newMessage.sender_id !== user?.id) {
            supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', newMessage.id)
              .then();
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChatId, user, toast]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);

  const sendMessage = async () => {
    if (!message.trim() || !activeChatId || !user) return;
    
    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: activeChatId,
          sender_id: user.id,
          content: message.trim(),
        });
        
      if (error) throw error;
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(80vh-100px)]">
          {/* Chat List */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-700">Your Conversations</h2>
            </div>
            
            <div className="overflow-y-auto h-[calc(80vh-180px)]">
              {chats.length > 0 ? (
                chats.map(chat => {
                  // Determine the other user (buyer or seller)
                  const isUserBuyer = user?.id === chat.buyer_id;
                  const otherParty = isUserBuyer ? chat.seller : chat.buyer;
                  
                  return (
                    <div 
                      key={chat.id} 
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        activeChatId === chat.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                      }`}
                      onClick={() => setActiveChatId(chat.id)}
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={otherParty?.avatar_url} />
                          <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {otherParty?.full_name || otherParty?.username || 'User'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {chat.food_listings?.title || 'Food Listing'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>No conversations yet.</p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/')}
                  >
                    Browse Listings
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="md:col-span-2 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
            {activeChatId && activeChatDetails ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={otherUser?.avatar_url} />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{otherUser?.full_name || otherUser?.username}</p>
                    </div>
                  </div>
                  {activeChatDetails.food_listings && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/listing/${activeChatDetails.food_listings.id}`)}
                    >
                      View Listing
                    </Button>
                  )}
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto h-[calc(80vh-280px)] bg-gray-50">
                  {activeChatMessages.length > 0 ? (
                    <div className="space-y-4">
                      {activeChatMessages.map((msg) => {
                        const isCurrentUser = msg.sender_id === user?.id;
                        return (
                          <div 
                            key={msg.id} 
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                                isCurrentUser 
                                  ? 'bg-blue-600 text-white rounded-br-none' 
                                  : 'bg-white shadow-sm rounded-bl-none'
                              }`}
                            >
                              <p className="break-words">{msg.content}</p>
                              <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-400'}`}>
                                {format(new Date(msg.created_at), 'p')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center">
                      <div>
                        <p>No messages yet.</p>
                        <p className="text-sm mt-1">Send a message to start the conversation.</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <form 
                    className="flex items-center space-x-2" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                  >
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={sending}
                    />
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!message.trim() || sending}
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Clock className="h-12 w-12 mb-4 text-gray-300" />
                <p>Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
