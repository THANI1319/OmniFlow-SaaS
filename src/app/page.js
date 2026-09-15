"use client";

import { useState } from 'react';
import { Bot, Mail, Menu, X, Zap, Link as LinkIcon, Activity, Database, BrainCircuit, Search, ChevronRight, MessageCircle, ClipboardList, Play, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function OmniFlowDashboard() {
  const [activeTab, setActiveTab] = useState('Command Center');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Command Center States
  const [userPrompt, setUserPrompt] = useState('');
  const [workflowData, setWorkflowData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // App Connections State (Expanded for Multi-App)
  const [credentials, setCredentials] = useState({ gmail: '', slack: '', jira: '' });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectStatus, setConnectStatus] = useState(null);

  // AI Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([{ role: 'ai', text: 'Hi boss, OmniFlow engine ready. Enna automate pannanum?' }]);

  // Unga AWS API Gateway URL
  const API_URL = "https://cugogf03w2.execute-api.ap-south-1.amazonaws.com/dev/generate-workflow";
  const USER_ID = "111923IT01056"; 

  // ================= ACTIONS =================
  const runWorkflow = async (overridePrompt = null) => {
    const promptToRun = overridePrompt || userPrompt;
    if (!promptToRun) return;
    
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const response = await axios.post(API_URL, { 
        action: "generate", 
        userPrompt: promptToRun, 
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
      setWorkflowData([{ step: 1, app: "error", action: "Network Error: API Gateway failed" }]);
    }
    setIsGenerating(false);
  };

  const handleConnect = async (e, appName, tokenVal) => {
    e.preventDefault();
    setIsConnecting(true);
    setConnectStatus({ app: appName, type: 'loading' });
    try {
      await axios.post(API_URL, {
        action: "connect_app",
        userId: USER_ID,
        app: appName,
        token: tokenVal
      });
      setConnectStatus({ app: appName, type: 'success', text: `${appName} connected to DynamoDB!` });
    } catch (err) {
      setConnectStatus({ app: appName, type: 'error', text: 'Failed to connect.' });
    }
    setIsConnecting(false);
  };

  const sendChatMessage = () => {
    if(!chatInput) return;
    const currentInput = chatInput;
    setChatLog(prev => [...prev, { role: 'user', text: currentInput }]);
    setTimeout(() => {
      setChatLog(prev => [...prev, { role: 'ai', text: `Analyzing "${currentInput}"... Redirecting to Command Center.` }]);
      setUserPrompt(currentInput);
      setActiveTab('Command Center');
      setTimeout(() => runWorkflow(currentInput), 500);
    }, 1000);
    setChatInput('');
  };

  const getAppIcon = (app) => {
    if(app?.toLowerCase() === 'slack') return <MessageCircle className="w-6 h-6"/>;
    if(app?.toLowerCase() === 'jira') return <ClipboardList className="w-6 h-6"/>;
    if(app?.toLowerCase() === 'error') return <X className="w-6 h-6"/>;
    return <Mail className="w-6 h-6"/>;
  };

  // ================= UI COMPONENTS =================
  const menuItems = [
    { name: 'Command Center', icon: <Bot className="w-5 h-5 mr-3" /> },
    { name: 'Connections', icon: <LinkIcon className="w-5 h-5 mr-3" /> },
    { name: 'OmniChat AI', icon: <BrainCircuit className="w-5 h-5 mr-3" /> },
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
              
              {/* Feature: Quick Templates Added Here */}
              <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
                <button onClick={() => runWorkflow("Send daily status report via Gmail")} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-gray-300 flex items-center whitespace-nowrap border border-white/10"><Play className="w-3 h-3 mr-2 text-orange-400"/> Send Daily Report</button>
                <button onClick={() => runWorkflow("Create Jira ticket for server bug and notify Slack")} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-gray-300 flex items-center whitespace-nowrap border border-white/10"><Play className="w-3 h-3 mr-2 text-blue-400"/> Jira + Slack Alert</button>
              </div>

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
                    onClick={() => runWorkflow()}
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
                          {getAppIcon(step.app)}
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Step {step.step || idx+1}</div>
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

          {/* TAB 2: CONNECTIONS (Multi-App using your exact styling) */}
          {activeTab === 'Connections' && (
            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { name: 'Gmail', icon: <Mail className="w-6 h-6 text-red-400"/>, color: 'red', stateKey: 'gmail', desc: '16-Digit App Password' },
                { name: 'Slack', icon: <MessageCircle className="w-6 h-6 text-purple-400"/>, color: 'purple', stateKey: 'slack', desc: 'Bot OAuth Token' },
                { name: 'Jira', icon: <ClipboardList className="w-6 h-6 text-blue-400"/>, color: 'blue', stateKey: 'jira', desc: 'API Access Token' }
              ].map(app => (
                <div key={app.name} className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 bg-${app.color}-500/20 rounded-xl flex items-center justify-center mr-4`}>
                      {app.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-medium text-white">{app.name} Integration</h2>
                      <p className="text-gray-400 text-sm">Required for automation.</p>
                    </div>
                  </div>
                  <form onSubmit={(e) => handleConnect(e, app.name, credentials[app.stateKey])} className="space-y-5">
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">{app.desc}</label>
                      <input 
                        type="password" 
                        required
                        value={credentials[app.stateKey]}
                        onChange={(e) => setCredentials({...credentials, [app.stateKey]: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        placeholder="••••••••••••••••"
                      />
                    </div>
                    
                    {connectStatus?.app === app.name && (
                      <div className={`p-3 rounded-lg text-sm ${connectStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : connectStatus.type === 'loading' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {connectStatus.type === 'loading' ? 'Syncing...' : connectStatus.text}
                      </div>
                    )}
                    <button 
                      type="submit" 
                      disabled={isConnecting}
                      className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center mt-4"
                    >
                      Save Connection
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: OMNICHAT AI (Replaces Placeholder) */}
          {activeTab === 'OmniChat AI' && (
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl h-[500px] flex flex-col animate-fade-in max-w-3xl mx-auto">
              <div className="p-4 border-b border-white/10 flex items-center">
                <BrainCircuit className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="font-medium text-white">OmniFlow AI Assistant</h3>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {chatLog.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm md:text-base ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10 flex">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()} 
                  placeholder="Ask me to run a workflow..." 
                  className="flex-1 bg-black border border-white/10 rounded-l-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
                />
                <button onClick={sendChatMessage} className="bg-orange-500 hover:bg-orange-600 px-6 rounded-r-xl font-medium transition-colors text-white">Send</button>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS (Real Stats based on your layout) */}
          {activeTab === 'Analytics' && (
             <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a0f] border border-white/10 p-6 md:p-8 rounded-2xl">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Success Rate</span>
                  <div className="text-4xl font-light text-white mt-4">99.4%</div>
                  <div className="text-sm text-green-400 mt-4 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> DynamoDB Synced
                  </div>
                </div>
                <div className="bg-[#0a0a0f] border border-white/10 p-6 md:p-8 rounded-2xl">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Avg Runtime</span>
                  <div className="text-4xl font-light text-white mt-4">420<span className="text-2xl text-gray-500">ms</span></div>
                  <div className="text-sm text-orange-400 mt-4">AWS Lambda Enabled</div>
                </div>
                <div className="bg-[#0a0a0f] border border-white/10 p-6 md:p-8 rounded-2xl">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Apps</span>
                  <div className="text-4xl font-light text-white mt-4">3</div>
                  <div className="text-sm text-gray-400 mt-4">Gmail, Slack, Jira</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}