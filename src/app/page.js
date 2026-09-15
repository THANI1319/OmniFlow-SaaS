"use client";

import { useState, useEffect } from 'react';
import { 
  Bot, Mail, X, Zap, Link as LinkIcon, Activity, BrainCircuit, 
  Search, MessageSquare, Cpu, Play, MessageCircle, ClipboardList, 
  CheckCircle2, ChevronRight, Menu, RefreshCw, Layers
} from 'lucide-react';
import axios from 'axios';

export default function OmniFlowOriginal() {
  const [activeTab, setActiveTab] = useState('Command Center');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Real-time States
  const [userPrompt, setUserPrompt] = useState('');
  const [workflowData, setWorkflowData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveFeed, setLiveFeed] = useState([]);
  const [activeStepDetails, setActiveStepDetails] = useState(null);
  
  // App Connections State
  const [credentials, setCredentials] = useState({ gmail: '', slack: '', jira: '' });
  const [connectStatus, setConnectStatus] = useState(null);

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'ai', text: 'Hi boss! OmniFlow engine ready. Enna workflow execute pannanum?' }
  ]);

  const API_URL = "https://cugogf03w2.execute-api.ap-south-1.amazonaws.com/dev/generate-workflow";
  const USER_ID = "111923IT01056"; 

  // Load Feed History from Storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omniflow_feed');
      if (saved) setLiveFeed(JSON.parse(saved));
    } catch {
      // Ignore fallback
    }
  }, []);

  const addToFeed = (app, message) => {
    setLiveFeed(prev => {
      const updated = [{ app, message, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 15);
      try {
        localStorage.setItem('omniflow_feed', JSON.stringify(updated));
      } catch {
        // Fallback safely
      }
      return updated;
    });
  };

  // ================= 1. CORE EXECUTION =================
  const runWorkflow = async (overridePrompt = null) => {
    const finalPrompt = overridePrompt || userPrompt;
    if (!finalPrompt || isGenerating) return;
    
    setIsGenerating(true);
    addToFeed('System', `Triggered: "${finalPrompt.substring(0, 24)}..."`);
    
    try {
      const response = await axios.post(API_URL, { 
        action: "generate", 
        userPrompt: finalPrompt, 
        userId: USER_ID 
      });

      if (response.data.error) {
        setWorkflowData([{ step: 1, app: "error", action: response.data.message || "Execution Failed" }]);
        addToFeed('Error', response.data.message || 'Execution failed');
      } else {
        const plan = response.data.plan?.workflows || [];
        setWorkflowData(plan);
        plan.forEach(step => addToFeed(step.app, `${step.action}`));
      }
    } catch {
      setWorkflowData([{ step: 1, app: "error", action: "AWS Gateway execution timeout / network error" }]);
      addToFeed('Error', 'AWS Gateway Connection Failed');
    }
    setIsGenerating(false);
  };

  // ================= 2. DB CONNECTION SAVER =================
  const handleConnect = async (appName, inputVal) => {
    if (!inputVal) return;
    setConnectStatus({ app: appName, status: 'loading' });
    try {
      await axios.post(API_URL, { 
        action: "connect_app", 
        userId: USER_ID, 
        app: appName, 
        token: inputVal 
      });
      setConnectStatus({ app: appName, status: 'success' });
      addToFeed(appName, `Token synced securely to DynamoDB`);
    } catch {
      setConnectStatus({ app: appName, status: 'error' });
    }
  };

  // ================= 3. AI CHAT ASSISTANT =================
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const currentText = chatInput;
    setChatLog(prev => [...prev, { role: 'user', text: currentText }]);
    setChatInput('');

    // Instant local reasoning assist
    setTimeout(() => {
      let reply = `Automating: "${currentText}". Click below to load it into Command Center.`;
      setChatLog(prev => [...prev, { role: 'ai', text: reply, quickPrompt: currentText }]);
    }, 600);
  };

  const getAppIcon = (app) => {
    const a = app?.toLowerCase() || '';
    if (a.includes('slack')) return <MessageCircle className="w-6 h-6"/>;
    if (a.includes('jira')) return <ClipboardList className="w-6 h-6"/>;
    if (a.includes('error')) return <X className="w-6 h-6"/>;
    return <Mail className="w-6 h-6"/>;
  };

  return (
    <div className="flex h-screen bg-[#030305] text-white font-sans overflow-hidden">
      
      {/* MOBILE HEADER BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#08080C] border-b border-white/10 flex items-center justify-between px-4 z-50">
        <div className="flex items-center text-orange-500 font-bold tracking-wider text-lg">
          <Zap className="w-6 h-6 mr-2 fill-orange-500" /> OMNIFLOW
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-gray-400 hover:text-white"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ================= LEFT SIDEBAR ================= */}
      <aside className={`fixed md:relative top-0 left-0 h-full w-64 bg-[#08080C] border-r border-white/5 flex flex-col z-40 transition-transform duration-300 md:translate-x-0 pt-16 md:pt-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 hidden md:flex items-center text-orange-500 font-bold text-2xl tracking-wider mb-8">
          <Zap className="w-8 h-8 mr-2 fill-orange-500" /> OMNIFLOW
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'Command Center', icon: <Bot className="w-5 h-5 mr-3" /> },
            { id: 'Integration Hub', icon: <LinkIcon className="w-5 h-5 mr-3" /> },
            { id: 'OmniChat AI', icon: <MessageSquare className="w-5 h-5 mr-3" /> },
            { id: 'Cloud Analytics', icon: <Activity className="w-5 h-5 mr-3" /> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-orange-500/10 text-orange-400 shadow-[inset_4px_0_0_0_#f97316]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              {tab.icon}
              <span className="font-medium text-sm">{tab.id}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ================= CENTER MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col relative h-full overflow-y-auto custom-scrollbar pt-14 md:pt-0">
        <header className="p-6 md:p-8 flex items-center justify-between sticky top-0 bg-[#030305]/90 backdrop-blur-md z-10 border-b border-white/5">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide">{activeTab}</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-1">Serverless AWS Lambda & DynamoDB Orchestrator</p>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 max-w-5xl mx-auto w-full pb-24">
          
          {/* VIEW 1: COMMAND CENTER */}
          {activeTab === 'Command Center' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Quick Template Chips */}
              <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
                <button 
                  onClick={() => runWorkflow("Send daily status report via Gmail to team")} 
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-gray-300 flex items-center whitespace-nowrap border border-white/5 transition-colors"
                >
                  <Play className="w-3 h-3 mr-2 text-orange-400"/> Send Daily Report
                </button>
                <button 
                  onClick={() => runWorkflow("Create Jira ticket for high priority bug and notify Slack channel")} 
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-gray-300 flex items-center whitespace-nowrap border border-white/5 transition-colors"
                >
                  <Play className="w-3 h-3 mr-2 text-blue-400"/> Jira + Slack Alert
                </button>
                <button 
                  onClick={() => runWorkflow("Email HOD project deployment report on Vercel")} 
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-gray-300 flex items-center whitespace-nowrap border border-white/5 transition-colors"
                >
                  <Play className="w-3 h-3 mr-2 text-green-400"/> Deploy Email Alert
                </button>
              </div>

              {/* Glowing Search Box */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                <div className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl p-2 flex items-center">
                  <div className="p-3 bg-white/5 rounded-xl ml-1">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={userPrompt} 
                    onChange={(e) => setUserPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runWorkflow()}
                    placeholder="E.g., Send an email to HOD with serverless architecture diagram..." 
                    className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:outline-none text-sm md:text-base placeholder-gray-500"
                  />
                  <button 
                    onClick={() => runWorkflow()} 
                    disabled={isGenerating} 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center shrink-0"
                  >
                    {isGenerating ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
              </div>

              {/* Blueprint Cards */}
              {workflowData && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4 flex items-center">
                    <Layers className="w-4 h-4 mr-2" /> Live Execution Blueprint
                  </h3>
                  {workflowData.map((step, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setActiveStepDetails(step)}
                      className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-all hover:border-white/20 ${step.app === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-[#0a0a0f] border-white/5'}`}
                    >
                      <div className="flex items-center mb-3 md:mb-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 ${step.app === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {getAppIcon(step.app)}
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                            Step {step.step || idx + 1} • {step.app}
                          </div>
                          <div className="text-white text-base font-medium">{step.action}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 self-end md:self-auto">
                        <div className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center ${step.app === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-400/10 text-green-400'}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${step.app === 'error' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                          {step.app === 'error' ? 'Failed' : 'Ready / Executed'}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step Payload Inspector Modal */}
              {activeStepDetails && (
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Step Payload Details</span>
                    <button onClick={() => setActiveStepDetails(null)} className="text-gray-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-xs text-gray-300 font-mono bg-black/60 p-4 rounded-xl overflow-x-auto">
                    {JSON.stringify(activeStepDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: MULTI-APP INTEGRATION HUB */}
          {activeTab === 'Integration Hub' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {[
                { name: 'Gmail', icon: <Mail className="w-8 h-8 text-red-400"/>, desc: '16-Digit App Password for SMTP execution', stateKey: 'gmail' },
                { name: 'Slack', icon: <MessageCircle className="w-8 h-8 text-purple-400"/>, desc: 'Bot User OAuth Token (xoxb-...)', stateKey: 'slack' },
                { name: 'Jira', icon: <ClipboardList className="w-8 h-8 text-blue-400"/>, desc: 'Atlassian API User Token', stateKey: 'jira' }
              ].map(app => (
                <div key={app.name} className="bg-[#0a0a0f] border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center mr-4">
                        {app.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-white">{app.name}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{app.desc}</p>
                      </div>
                    </div>
                    <input 
                      type="password" 
                      placeholder={`Enter ${app.name} Credential`} 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-orange-500 outline-none mb-3" 
                      onChange={(e) => setCredentials({ ...credentials, [app.stateKey]: e.target.value })} 
                    />
                  </div>
                  <button 
                    onClick={() => handleConnect(app.name, credentials[app.stateKey])} 
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-white py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center"
                  >
                    {connectStatus?.app === app.name && connectStatus?.status === 'loading' ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {connectStatus?.app === app.name && connectStatus?.status === 'success' ? 'Connected to DynamoDB ✓' : 'Secure Connection'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 3: OMNICHAT AI */}
          {activeTab === 'OmniChat AI' && (
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl h-[520px] flex flex-col animate-fade-in">
              <div className="p-4 border-b border-white/5 flex items-center">
                <BrainCircuit className="w-5 h-5 text-orange-400 mr-3" />
                <h3 className="font-medium text-sm">OmniFlow AI Assistant</h3>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {chatLog.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                    {msg.quickPrompt && (
                      <button 
                        onClick={() => {
                          setUserPrompt(msg.quickPrompt);
                          setActiveTab('Command Center');
                        }}
                        className="mt-2 text-xs text-orange-400 hover:underline flex items-center"
                      >
                        Run this in Command Center →
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/5 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()} 
                  placeholder="Ask anything about workflows..." 
                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500" 
                />
                <button onClick={sendChatMessage} className="bg-orange-500 hover:bg-orange-600 px-6 rounded-xl font-medium text-sm transition-colors">
                  Send
                </button>
              </div>
            </div>
          )}

          {/* VIEW 4: CLOUD ANALYTICS */}
          {activeTab === 'Cloud Analytics' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a0f] border border-white/10 p-6 rounded-2xl">
                  <span className="text-gray-500 text-xs font-bold uppercase">Success Execution Rate</span>
                  <div className="text-3xl font-light text-white mt-2">99.4%</div>
                  <div className="text-xs text-green-400 mt-2 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> DynamoDB Zero Drop
                  </div>
                </div>
                <div className="bg-[#0a0a0f] border border-white/10 p-6 rounded-2xl">
                  <span className="text-gray-500 text-xs font-bold uppercase">Avg Lambda Runtime</span>
                  <div className="text-3xl font-light text-white mt-2">420ms</div>
                  <div className="text-xs text-gray-400 mt-2">API Gateway Region: ap-south-1</div>
                </div>
                <div className="bg-[#0a0a0f] border border-white/10 p-6 rounded-2xl">
                  <span className="text-gray-500 text-xs font-bold uppercase">Active Endpoints</span>
                  <div className="text-3xl font-light text-white mt-2">3 Services</div>
                  <div className="text-xs text-orange-400 mt-2">Gmail, Slack, Jira</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= RIGHT SIDEBAR ================= */}
      <aside className="w-[320px] h-full bg-[#08080C] border-l border-white/5 flex flex-col z-20 hidden xl:flex">
        
        {/* Live Activity Feed */}
        <div className="p-6 flex-1 flex flex-col border-b border-white/5 overflow-hidden">
          <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-orange-400"/> Live Activity
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {liveFeed.length > 0 ? liveFeed.map((item, i) => (
              <div key={i} className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-xs">
                <div className="flex items-center mb-1">
                  <span className="text-orange-400 font-bold uppercase tracking-wider">{item.app}</span>
                  <span className="ml-auto text-gray-500 text-[10px]">{item.time}</span>
                </div>
                <p className="text-gray-300 leading-relaxed truncate">{item.message}</p>
              </div>
            )) : (
              <p className="text-gray-600 text-xs text-center mt-10">System idle. Waiting for tasks...</p>
            )}
          </div>
        </div>

        {/* System Metrics */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase">System Metrics</h3>
            <span className="text-green-400 text-xs font-medium flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>Healthy
            </span>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Lambda Execution</span>
              <span className="text-white font-mono">~420ms</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full">
              <div className="bg-orange-500 h-1 rounded-full w-1/3"></div>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Gemini 2.5 Flash Tokens</span>
              <span className="text-white font-mono">1,420 / 5K</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full">
              <div className="bg-purple-500 h-1 rounded-full w-1/4"></div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full h-20 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/5 flex items-center px-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-900/20 blur-xl"></div>
              <Cpu className="w-7 h-7 text-orange-400 relative z-10 mr-3 shrink-0" />
              <div className="relative z-10">
                <div className="text-sm font-bold text-white">V1.0 Orchestrator Core</div>
                <div className="text-[11px] text-gray-400">Serverless SaaS Active</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}