import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Edit, Trash, RefreshCw, MessageSquare } from 'lucide-react';
import axios from 'axios';

const Chatbot = ({roadmapId}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'actions'
  const messagesEndRef = useRef(null);
  const [actionData, setActionData] = useState({
    title: '',
    day: '',
    newTitle: '',
    message: '',
    customization: ''
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleAction = async (action, data = {}) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/api/roadmap/chatbot/${roadmapId}`,
        { action, data },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setMessages(prev => [
        ...prev,
        { text: response.data.message, isUser: false }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { text: 'Error processing action', isUser: false }
      ]);
      console.error('Error processing action:', error);
    } finally {
      setIsLoading(false);
      setActionData({
        title: '',
        day: '',
        newTitle: '',
        message: '',
        customization: ''
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    const userMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      await handleAction('explain', { message });
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200 flex items-center justify-center"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">ProTrack Assistant</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`p-1.5 rounded-md transition-colors ${activeTab === 'chat' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setActiveTab('actions')}
                className={`p-1.5 rounded-md transition-colors ${activeTab === 'actions' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                <Plus className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-white/10 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons and Inputs */}
          {activeTab === 'actions' && (
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <Plus className="h-4 w-4 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-800">Add Task</h4>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={actionData.title}
                    onChange={(e) => setActionData(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Day Number"
                    value={actionData.day}
                    onChange={(e) => setActionData(prev => ({...prev, day: e.target.value}))}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    onClick={() => handleAction('add', { title: actionData.title, day: actionData.day })}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center"
                    disabled={!actionData.title || !actionData.day}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <Edit className="h-4 w-4 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-800">Edit Task</h4>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Current Title"
                    value={actionData.title}
                    onChange={(e) => setActionData(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="New Title"
                    value={actionData.newTitle}
                    onChange={(e) => setActionData(prev => ({...prev, newTitle: e.target.value}))}
                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleAction('edit', { title: actionData.title, newTitle: actionData.newTitle })}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center"
                    disabled={!actionData.title || !actionData.newTitle}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit Task
                  </button>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center mb-2">
                  <Trash className="h-4 w-4 text-red-600 mr-2" />
                  <h4 className="font-medium text-red-800">Delete Task</h4>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={actionData.title}
                    onChange={(e) => setActionData(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-3 py-2 border border-red-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    onClick={() => handleAction('delete', { title: actionData.title })}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center"
                    disabled={!actionData.title}
                  >
                    <Trash className="h-4 w-4 mr-2" /> Delete Task
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <RefreshCw className="h-4 w-4 text-purple-600 mr-2" />
                  <h4 className="font-medium text-purple-800">Regenerate Roadmap</h4>
                </div>
                <div className="space-y-2">
                  <textarea
                    placeholder="Customization instructions..."
                    value={actionData.customization}
                    onChange={(e) => setActionData(prev => ({...prev, customization: e.target.value}))}
                    className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[80px]"
                  />
                  <button
                    onClick={() => handleAction('regenerate', { customization: actionData.customization })}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center justify-center"
                    disabled={!actionData.customization}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Ask me anything about your roadmap!</p>
                    </div>
                  </div>
                )}
                
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="animate-pulse flex space-x-2">
                        <div className="rounded-full bg-gray-300 h-2 w-2"></div>
                        <div className="rounded-full bg-gray-300 h-2 w-2"></div>
                        <div className="rounded-full bg-gray-300 h-2 w-2"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-3 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                    className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;