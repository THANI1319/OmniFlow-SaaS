"use client";

import { useState } from 'react';
import { Bot, Mail, Menu, X, Zap, Link as LinkIcon, Activity, Settings, Database, BrainCircuit, Search, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function OmniFlowDashboard() {
  const [activeTab, setActiveTab] = useState('Command Center');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Command Center States
  const [userPrompt, setUserPrompt] = useState('');
  const [workflowData, setWorkflowData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Connections States
  const [email, setEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectStatus, setConnectStatus] = useState(null);

  // Unga AWS API Gateway URL
  const API_URL = "https://cugogf03w2.execute-api.ap-south-1.amazonaws.com/dev/generate-workflow";
  
  // Default user ID for DB tracking
  const USER_ID = "111923IT01056"; 

  // ================= ACTIONS =================
  const runWorkflow = async () => {
    if (!userPrompt) return;
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const response = await axios.post(API_URL, { 
        action: "generate", 
        userPrompt, 
        userId: USER_ID 
      });
      if (response.data.error) {
        setErrorMsg(response.data.message || "Execution Failed");
        setWorkflowData([{ step: 1, app: "error", action: response.data.message }]);
      } else {
        setWorkflowData(response.data.plan.workflows);
      }
    } catch (err) {
      setErrorMsg("Network Error: Could not connect to AWS backend.");
    }
    setIsGenerating(false);
  };

  const connectGmail = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    setConnectStatus(null);
    try {
      const response = await axios.post(API_URL, {
        action: "connect_app",
        userId: USER_ID,
        email: email,
        appPassword: appPassword
      });
      setConnectStatus({ type: 'success', text: 'Gmail successfully connected to DynamoDB!' });
      setEmail('');
      setAppPassword('');
    } catch (err) {
      setConnectStatus({ type: 'error', text: 'Failed to connect. Check your network.' });
    }
    setIsConnecting(false);
  };

  // ================= UI COMPONENTS =================
  const menuItems = [
    { name: 'Command Center', icon: <Bot className="w-5 h-5 mr-3" /> },
    { name: 'Connections', icon: <LinkIcon className="w-5 h-5 mr-3" /> },
    { name: 'AI Training', icon: <BrainCircuit className="w-5 h-5 mr-3" /> },
    { name: 'Analytics', icon: <Activity className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="flex h-screen bg-[#030305] text-white overflow-hidden font-sans">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#08080C] z-50 w-full fixed top-0">
        <div className="flex items-center text-orange-500 font-bold text-xl tracking-wider">
          <Zap className="w-6 h-6 mr-2 fill-orange-500" />
          OMNIFLOW
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 focus:outline-none">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* SIDEBAR (Responsive) */}
      <aside className={`fixed md:relative top-0 left-0 w-64 h-full bg-[#08080C] border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 ease-in-out pt-16 md:pt-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 hidden md:flex items-center text-orange-500 font-bold text-2xl tracking-wider mb-8">
          <Zap className="w-8 h-8 mr-2 fill-orange-500" />
          OMNIFLOW
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${activeTab === item.name ? 'bg-orange-500/10 text-orange-400 shadow-[inset_4px_0_0_0_#f97316]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative pt-16 md:pt-0 h-full overflow-y-auto">
        <header className="p-6 md:p-8 flex items-center justify-between z-10 sticky top-0 bg-[#030305]/90 backdrop-blur-md">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide">{activeTab}</h1>
            <p className="text-gray-400 text-sm mt-1">{activeTab === 'Command Center' ? 'Describe your workflow and let AI orchestrate it.' : 'Manage your real-time integrations.'}</p>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 max-w-5xl mx-auto w-full pb-24 md:pb-8">
          
          {/* TAB 1: COMMAND CENTER */}
          {activeTab === 'Command Center' && (
            <div className="space-y-8 animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl p-2 flex items-center">
                  <div className="p-3 bg-white/5 rounded-xl ml-1"><Search className="w-5 h-5 text-gray-400" /></div>
                  <input 
                    type="text" 
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runWorkflow()}
                    placeholder="E.g., Send an urgent email to HOD..." 
                    className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:outline-none focus:ring-0 placeholder-gray-500 text-lg md:text-base"
                  />
                  <button 
                    onClick={runWorkflow}
                    disabled={isGenerating}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center"
                  >
                    {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Generate'}
                  </button>
                </div>
              </div>

              {/* Execution Cards */}
              {workflowData && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-4">Execution Blueprint</h3>
                  {workflowData.map((step, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center ${step.app === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-[#0a0a0f] border-white/5'}`}>
                      <div className="flex items-center mb-4 md:mb-0 md:w-1/4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${step.app === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {step.app === 'error' ? <X className="w-6 h-6"/> : <Mail className="w-6 h-6"/>}
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Step {step.step || 1}</div>
                          <div className="text-white font-medium capitalize">{step.app}</div>
                        </div>
                      </div>
                      <div className="flex-1 px-4 text-gray-300 text-sm md:text-base">
                        <p><span className="text-gray-500">Action:</span> {step.action}</p>
                        {step.details?.to && <p><span className="text-gray-500">Target:</span> {step.details.to}</p>}
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center text-green-400 text-sm font-medium bg-green-400/10 px-3 py-1 rounded-full w-max">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        {step.app === 'error' ? 'Failed' : 'Executed'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONNECTIONS */}
          {activeTab === 'Connections' && (
            <div className="animate-fade-in max-w-2xl">
              <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-white">Gmail Integration</h2>
                    <p className="text-gray-400 text-sm">Required for sending automated emails.</p>
                  </div>
                </div>
                
                <form onSubmit={connectGmail} className="space-y-5">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Gmail Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition-colors"
                      placeholder="e.g., 2323059@saec.ac.in"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">16-Digit App Password</label>
                    <input 
                      type="password" 
                      required
                      value={appPassword}
                      onChange={(e) => setAppPassword(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition-colors"
                      placeholder="••••••••••••••••"
                    />
                  </div>
                  
                  {connectStatus && (
                    <div className={`p-3 rounded-lg text-sm ${connectStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {connectStatus.text}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isConnecting}
                    className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center mt-4"
                  >
                    {isConnecting ? 'Syncing to DynamoDB...' : 'Save Connection'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* OTHER TABS (Placeholders) */}
          {(activeTab === 'AI Training' || activeTab === 'Analytics') && (
            <div className="flex flex-col items-center justify-center h-64 text-center opacity-50 animate-fade-in">
              <Database className="w-12 h-12 text-gray-500 mb-4" />
              <h2 className="text-xl text-white font-medium mb-2">{activeTab} Module</h2>
              <p className="text-gray-400 max-w-md">This module is currently locked in the Beta version. Upgrade your deployment to access advanced insights.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}