"use client";

import { useState } from 'react';
import { Bot, Mail, X, Zap, Link as LinkIcon, Activity, BrainCircuit, Search, MessageSquare, Slack, Trello, Cpu, Play } from 'lucide-react';
import axios from 'axios';

export default function OmniFlowOriginal() {
  const [activeTab, setActiveTab] = useState('Command Center');
  
  // Real-time States
  const [userPrompt, setUserPrompt] = useState('');
  const [workflowData, setWorkflowData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveFeed, setLiveFeed] = useState([]);
  
  // App Connections State
  const [credentials, setCredentials] = useState({ gmail: '', slack: '', jira: '' });
  const [connectStatus, setConnectStatus] = useState(null);

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([{ role: 'ai', text: 'Hi boss, OmniFlow engine ready. Enna automate pannanum?' }]);

  const API_URL = "https://cugogf03w2.execute-api.ap-south-1.amazonaws.com/dev/generate-workflow";
  const USER_ID = "111923IT01056"; 

  // ================= 1. CORE EXECUTION =================
  const runWorkflow = async (overridePrompt = null) => {
    const finalPrompt = overridePrompt || userPrompt;
    if (!finalPrompt) return;
    
    setIsGenerating(true);
    addToFeed('System', 'AI Orchestration Started...');
    
    try {
      const response = await axios.post(API_URL, { action: "generate", userPrompt: finalPrompt, userId: USER_ID });
      if (response.data.error) {
        setWorkflowData([{ step: 1, app: "error", action: response.data.message }]);
        addToFeed('Error', 'Execution Failed');
      } else {
        const plan = response.data.plan.workflows;
        setWorkflowData(plan);
        plan.forEach(step => addToFeed(step.app, `Executed: ${step.action}`));
      }
    } catch (err) {
      setWorkflowData([{ step: 1, app: "error", action: "Network Error with AWS Gateway" }]);
    }
    setIsGenerating(false);
  };

  // ================= 2. LIVE FEED SYSTEM =================
  const addToFeed = (app, message) => {
    setLiveFeed(prev => [{ app, message, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  // ================= 3. DB CONNECTION SAVER =================
  const handleConnect = async (appName, inputVal) => {
    setConnectStatus({ app: appName, status: 'loading' });
    try {
      await axios.post(API_URL, { action: "connect_app", userId: USER_ID, app: appName, token: inputVal });
      setConnectStatus({ app: appName, status: 'success' });
      addToFeed(appName, `Secured connection to DynamoDB`);
    } catch {
      setConnectStatus({ app: appName, status: 'error' });
    }
  };

  // ================= 4. AI CHATBOX =================
  const sendChatMessage = () => {
    if(!chatInput) return;
    setChatLog(prev => [...prev, { role: 'user', text: chatInput }]);
    setTimeout(() => {
      setChatLog(prev => [...prev, { role: 'ai', text: `Analyzing "${chatInput}" using Gemini... Check Command Center for execution.` }]);
    }, 1000);
    setChatInput('');
  };

  const getAppIcon = (app) => {
    if(app?.toLowerCase() === 'slack') return <Slack className="w-6 h-6"/>;
    if(app?.toLowerCase() === 'jira') return <Trello className="w-6 h-6"/>;
    if(app?.toLowerCase() === 'error') return <X className="w-6 h-6"/>;
    return <Mail className="w-6 h-6"/>;
  };

  return (
    <div className="flex h-screen bg-[#030305] text-white font-sans overflow-hidden">
      
      {/* ================= LEFT SIDEBAR (PAZHAIYA DESIGN) ================= */}
      <aside className="w-64 h-full bg-[#08080C] border-r border-white/5 flex flex-col z-40 hidden md:flex">
        <div className="p-6 flex items-center text-orange-500 font-bold text-2xl tracking-wider mb-8">
          <Zap className="w-8 h-8 mr-2 fill-orange-500" /> OMNIFLOW
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {['Command Center', 'Integration Hub', 'OmniChat AI', 'Cloud Analytics'].map((tab) => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${activeTab === tab ? 'bg-orange-500/10 text-orange-400 shadow-[inset_4px_0_0_0_#f97316]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              {tab === 'Command Center' && <Bot className="w-5 h-5 mr-3" />}
              {tab === 'Integration Hub' && <LinkIcon className="w-5 h-5 mr-3" />}
              {tab === 'OmniChat AI' && <MessageSquare className="w-5 h-5 mr-3" />}
              {tab === 'Cloud Analytics' && <Activity className="w-5 h-5 mr-3" />}
              <span className="font-medium">{tab}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ================= CENTER MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col relative h-full overflow-y-auto custom-scrollbar">
        <header className="p-8 flex items-center justify-between sticky top-0 bg-[#030305]/90 backdrop-blur-md z-10">
          <div>
            <h1 className="text-3xl font-light text-white tracking-wide">{activeTab}</h1>
            <p className="text-gray-400 text-sm mt-1">Serverless AWS Lambda Architecture</p>
          </div>
        </header>

        <div className="p-8 flex-1 max-w-5xl mx-auto w-full pb-24">
          
          {/* VIEW 1: COMMAND CENTER (GLOWING INPUT + CARDS) */}
          {activeTab === 'Command Center' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Feature: Smart Quick Templates */}
              <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
                <button onClick={() => runWorkflow("Send daily status report via Gmail")} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-gray-300 flex items-center whitespace-nowrap"><Play className="w-3 h-3 mr-2 text-orange-400"/> Send Daily Report</button>
                <button onClick={() => runWorkflow("Create Jira ticket for server bug and notify Slack")} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-gray-300 flex items-center whitespace-nowrap"><Play className="w-3 h-3 mr-2 text-blue-400"/> Jira + Slack Alert</button>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                <div className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl p-2 flex items-center">
                  <div className="p-3 bg-white/5 rounded-xl ml-1"><Search className="w-5 h-5 text-gray-400" /></div>
                  <input 
                    type="text" value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runWorkflow()}
                    placeholder="E.g., Email HOD about project completion and message Slack..." 
                    className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:outline-none text-lg"
                  />
                  <button onClick={() => runWorkflow()} disabled={isGenerating} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center">
                    {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Generate'}
                  </button>
                </div>
              </div>

              {workflowData && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-4">Live Execution Blueprint</h3>
                  {workflowData.map((step, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border flex items-center ${step.app === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-[#0a0a0f] border-white/5'}`}>
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-6 ${step.app === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {getAppIcon(step.app)}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Step {step.step || idx+1} • {step.app}</div>
                        <div className="text-white text-lg">{step.action}</div>
                      </div>
                      <div className="text-green-400 text-sm font-medium bg-green-400/10 px-4 py-2 rounded-full flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div> Executed
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: MULTI-APP INTEGRATION HUB */}
          {activeTab === 'Integration Hub' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {[
                { name: 'Gmail', icon: <Mail className="w-8 h-8 text-red-400"/>, color: 'red', desc: 'App Password for SMTP' },
                { name: 'Slack', icon: <Slack className="w-8 h-8 text-purple-400"/>, color: 'purple', desc: 'Bot OAuth Token' },
                { name: 'Jira', icon: <Trello className="w-8 h-8 text-blue-400"/>, color: 'blue', desc: 'API Access Token' }
              ].map(app => (
                <div key={app.name} className="bg-[#0a0a0f] border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className={`w-14 h-14 bg-${app.color}-500/20 rounded-xl flex items-center justify-center mr-4`}>{app.icon}</div>
                    <div><h3 className="text-xl font-medium">{app.name}</h3><p className="text-gray-400 text-xs">{app.desc}</p></div>
                  </div>
                  <input type="password" placeholder={`Enter ${app.name} Token`} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none mb-3" onChange={(e) => setCredentials({...credentials, [app.name.toLowerCase()]: e.target.value})} />
                  <button onClick={() => handleConnect(app.name, credentials[app.name.toLowerCase()])} className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-colors">
                    {connectStatus?.app === app.name && connectStatus?.status === 'loading' ? 'Syncing...' : 'Secure Connection'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 3: OMNICHAT AI */}
          {activeTab === 'OmniChat AI' && (
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl h-[500px] flex flex-col animate-fade-in">
              <div className="p-4 border-b border-white/5 flex items-center">
                <BrainCircuit className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="font-medium">OmniFlow AI Assistant</h3>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {chatLog.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/5 flex">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChatMessage()} placeholder="Ask anything about workflows..." className="flex-1 bg-black border border-white/10 rounded-l-xl px-4 py-3 text-white focus:outline-none" />
                <button onClick={sendChatMessage} className="bg-orange-500 px-6 rounded-r-xl font-medium">Send</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= RIGHT SIDEBAR (ORIGINAL LIVE FEED + METRICS) ================= */}
      <aside className="w-[320px] h-full bg-[#08080C] border-l border-white/5 flex flex-col z-20 hidden xl:flex">
        
        {/* Live Activity Feed */}
        <div className="p-6 flex-1 flex flex-col border-b border-white/5">
          <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6 flex items-center"><Activity className="w-4 h-4 mr-2"/> Live Activity</h3>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            {liveFeed.length > 0 ? liveFeed.map((item, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex items-center mb-1">
                  <span className="text-orange-400 text-xs font-bold uppercase">{item.app}</span>
                  <span className="ml-auto text-gray-500 text-[10px]">{item.time}</span>
                </div>
                <p className="text-gray-300 text-sm">{item.message}</p>
              </div>
            )) : (
              <p className="text-gray-600 text-sm text-center mt-10">System idle. Waiting for tasks...</p>
            )}
          </div>
        </div>

        {/* Feature: Token & Resource Tracker */}
        <div className="p-6">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase">System Metrics</h3>
             <span className="text-green-400 text-xs font-medium flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>Healthy</span>
           </div>
           
           <div className="space-y-3 mb-6">
             <div className="flex justify-between text-sm"><span className="text-gray-400">Lambda Execution</span><span className="text-white">~450ms</span></div>
             <div className="w-full bg-white/10 h-1 rounded-full"><div className="bg-orange-500 h-1 rounded-full w-1/3"></div></div>
             
             <div className="flex justify-between text-sm"><span className="text-gray-400">Gemini Tokens</span><span className="text-white">1,240 / 5K</span></div>
             <div className="w-full bg-white/10 h-1 rounded-full"><div className="bg-purple-500 h-1 rounded-full w-1/4"></div></div>
           </div>

           <div className="flex justify-center">
             <div className="w-full h-24 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-orange-900/20 blur-xl"></div>
                <Cpu className="w-8 h-8 text-orange-400 relative z-10 mr-3" />
                <div className="relative z-10"><div className="text-xl font-bold text-white">V1.0</div><div className="text-xs text-gray-400">Orchestrator Core</div></div>
             </div>
           </div>
        </div>
      </aside>
    </div>
  );
}