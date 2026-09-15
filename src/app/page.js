"use client";

import { useState } from "react";
import axios from "axios";
import { 
  Home, Share2, BrainCircuit, Blocks, Activity, BarChart2, Settings, 
  Search, Mic, HelpCircle, Bell, Sparkles, Mail, Layout, Hash, 
  Calendar, CheckCircle2, ChevronRight, MessageSquare, Loader2, Link2
} from "lucide-react";

export default function OmniFlowPremium() {
  const [activeTab, setActiveTab] = useState("Command Center");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [workflowData, setWorkflowData] = useState(null);
  
  // App connection states
  const [connectedApps, setConnectedApps] = useState({
    Gmail: true,
    Slack: false,
    Notion: false,
    Calendar: true
  });

  // Modal State Variables
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");

  // Update aana Generate function
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setWorkflowData(null);
    try {
      const response = await axios.post(
        "https://cugogf03w2.execute-api.ap-south-1.amazonaws.com/dev/generate-workflow",
        JSON.stringify({ action: "generate", userId: "111923IT01056", userPrompt: prompt }),
        { headers: { "Content-Type": "application/json" } }
      );
      setWorkflowData(response.data.plan.workflows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Connect API Call to DynamoDB
  const handleConnect = async () => {
    try {
      await axios.post(
        "https://cugogf03w2.execute-api.ap-south-1.amazonaws.com/dev/generate-workflow",
        JSON.stringify({ 
          action: "connect_app", 
          userId: "111923IT01056", 
          email: emailInput, 
          appPassword: passInput 
        }),
        { headers: { "Content-Type": "application/json" } }
      );
      setConnectedApps({ ...connectedApps, Gmail: true });
      setShowConnectModal(false);
      alert("Gmail Connected to DynamoDB Successfully! 🚀");
    } catch (err) {
      alert("Failed to connect app");
    }
  };

  const getAppIcon = (appName) => {
    const name = appName.toLowerCase();
    if (name.includes("gmail") || name.includes("email")) return <Mail className="text-red-400" />;
    if (name.includes("jira") || name.includes("notion")) return <Layout className="text-blue-400" />;
    if (name.includes("slack")) return <Hash className="text-yellow-400" />;
    if (name.includes("calendar")) return <Calendar className="text-blue-500" />;
    return <Sparkles className="text-purple-400" />;
  };

  return (
    <div className="flex h-screen bg-[#05050A] text-gray-200 font-sans overflow-hidden selection:bg-purple-500/30">
      
      {/* ================= LEFT SIDEBAR (FIXED) ================= */}
      <aside className="w-[260px] h-full flex flex-col border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl z-20 hidden md:flex">
        <div className="p-6 flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">OmniFlow</h1>
            <p className="text-[10px] text-gray-400 font-medium">One command. Infinite workflows.</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem icon={<Home />} label="Command Center" active={activeTab === "Command Center"} onClick={() => setActiveTab("Command Center")} />
          <NavItem icon={<Share2 />} label="My Workflows" active={activeTab === "My Workflows"} onClick={() => setActiveTab("My Workflows")} />
          <NavItem icon={<Blocks />} label="Connections" active={activeTab === "Connections"} onClick={() => setActiveTab("Connections")} />
          <NavItem icon={<Layout />} label="Templates" active={activeTab === "Templates"} onClick={() => setActiveTab("Templates")} />
          <NavItem icon={<Activity />} label="Activity" active={activeTab === "Activity"} onClick={() => setActiveTab("Activity")} />
          <NavItem icon={<Settings />} label="Settings" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} />
        </nav>

        {/* Automation Power Widget */}
        <div className="px-4 py-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full"></div>
            <h3 className="text-xs font-medium text-gray-400 mb-4">Automation Power</h3>
            <div className="flex justify-center mb-2 relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="226" strokeDashoffset="25" strokeLinecap="round" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">89%</span>
              </div>
            </div>
            <p className="text-[10px] text-center text-gray-400">Tasks automated this month</p>
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white text-sm shadow-lg">TV</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Thanigaivel V.</p>
              <p className="text-[10px] text-purple-400 font-medium">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= CENTER MAIN (DYNAMIC) ================= */}
      <main className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-8 z-20 border-b border-white/5">
          <div className="relative w-full max-w-xl">
            <Mic className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Tell OmniFlow what you want to automate..."
              className="w-full bg-[#0F0F16] border border-white/10 rounded-full py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 shadow-inner text-white placeholder-gray-500 transition-all"
            />
            {loading ? (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 animate-spin" />
            ) : (
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer hover:text-purple-400" onClick={handleGenerate} />
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white px-5 py-2.5 rounded-full font-medium shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:opacity-90">
              <Sparkles className="w-4 h-4" /><span>New Workflow</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content based on Tabs */}
        <div className="px-8 pb-8 pt-6 z-10 space-y-8 flex-1">
          
          {/* TAB 1: COMMAND CENTER */}
          {activeTab === "Command Center" && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-6">
                <h3 className="text-purple-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">Command Center</h3>
                <h2 className="text-4xl font-semibold text-white">What shall we <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">automate</span> today?</h2>
              </div>

              {/* Hero Section */}
              <div className="grid grid-cols-12 gap-6 bg-[#0B0B12] border border-white/10 rounded-3xl p-8 relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="col-span-5 flex flex-col justify-center relative z-10">
                  <div className="text-6xl text-white/10 font-serif absolute -top-8 -left-4">"</div>
                  <p className="text-2xl text-gray-200 leading-relaxed font-light mb-8">
                    {prompt || "Whenever my manager sends an email with 'urgent', create a Jira task, notify Slack, and block my calendar."}
                  </p>
                </div>

                <div className="col-span-7 flex justify-center items-center relative h-[300px]">
                  <div className={`relative z-20 w-32 h-32 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/80 via-purple-900/20 to-transparent flex items-center justify-center border ${loading ? 'border-pink-500 shadow-[0_0_80px_rgba(236,72,153,0.8)]' : 'border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.5)]'} transition-all duration-500`}>
                    <BrainCircuit className={`w-16 h-16 ${loading ? 'text-white animate-pulse' : 'text-pink-400'} drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]`} />
                  </div>
                  <div className={`absolute w-[280px] h-[280px] border border-white/5 rounded-full ${loading ? 'animate-[spin_10s_linear_infinite]' : 'animate-[spin_40s_linear_infinite]'}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 p-2 rounded-xl border border-white/20"><Mail className="w-5 h-5 text-white" /></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-600 p-2 rounded-xl border border-white/20"><Layout className="w-5 h-5 text-white" /></div>
                  </div>
                  <div className={`absolute w-[400px] h-[400px] border border-white/[0.03] rounded-full ${loading ? 'animate-[spin_15s_linear_infinite_reverse]' : 'animate-[spin_60s_linear_infinite_reverse]'}`}>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-green-500 p-2 rounded-xl"><MessageSquare className="w-5 h-5 text-white" /></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-orange-500 p-2 rounded-xl"><Calendar className="w-5 h-5 text-white" /></div>
                  </div>
                </div>
              </div>

              {/* Dynamic Workflow Blueprint Section */}
              <div>
                <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4">Workflow Blueprint</h3>
                <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-2">
                  {workflowData ? (
                    workflowData.map((step, index) => (
                      <div key={index} className="flex items-center">
                        <NodeCard icon={getAppIcon(step.app)} app={step.app} action={step.action.replace(/_/g, " ")} badge={`0${step.step}`} />
                        {index !== workflowData.length - 1 && <Arrow />}
                      </div>
                    ))
                  ) : (
                    <>
                      <NodeCard icon={<Mail className="text-red-400" />} app="Gmail" action="Manager sends email with 'urgent'" />
                      <Arrow /><NodeCard icon={<Layout className="text-blue-400" />} app="Jira" action="Create a new task" badge="02" />
                      <Arrow /><NodeCard icon={<Hash className="text-yellow-400" />} app="Slack" action="Notify in #urgent-alerts" badge="03" />
                      <Arrow /><NodeCard icon={<Calendar className="text-blue-500" />} app="Calendar" action="Block time on calendar" />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONNECTIONS */}
          {activeTab === "Connections" && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h3 className="text-purple-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">Integrations</h3>
                <h2 className="text-3xl font-semibold text-white">App Connections</h2>
                <p className="text-gray-400 mt-2">Connect your favorite apps to allow OmniFlow to automate tasks on your behalf securely via DynamoDB.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div onClick={() => setShowConnectModal(true)} className="cursor-pointer transform hover:scale-105 transition-transform duration-300">
                   <AppConnectCard icon={<Mail className="w-8 h-8 text-red-500" />} name="Gmail" connected={connectedApps.Gmail} />
                </div>
                <AppConnectCard icon={<Calendar className="w-8 h-8 text-blue-500" />} name="Google Calendar" connected={connectedApps.Calendar} />
                <AppConnectCard icon={<Hash className="w-8 h-8 text-yellow-500" />} name="Slack" connected={connectedApps.Slack} />
                <AppConnectCard icon={<Layout className="w-8 h-8 text-blue-400" />} name="Notion" connected={connectedApps.Notion} />
              </div>

              {/* Modal for Gmail Connection */}
              {showConnectModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                  <div className="bg-[#111116] p-8 rounded-2xl border border-purple-500/30 w-96 shadow-[0_0_40px_rgba(168,85,247,0.2)] animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-bold text-white mb-1">Connect Gmail</h3>
                    <p className="text-xs text-gray-400 mb-5">Enter details to sync with DynamoDB</p>
                    
                    <input 
                      type="email" 
                      placeholder="Gmail ID" 
                      className="w-full bg-[#05050A] border border-white/10 rounded-lg p-3 mb-3 text-white focus:border-purple-500/50 outline-none transition-colors" 
                      onChange={e => setEmailInput(e.target.value)} 
                    />
                    <input 
                      type="password" 
                      placeholder="16-digit App Password" 
                      className="w-full bg-[#05050A] border border-white/10 rounded-lg p-3 mb-6 text-white focus:border-purple-500/50 outline-none transition-colors" 
                      onChange={e => setPassInput(e.target.value)} 
                    />
                    
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => setShowConnectModal(false)} 
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleConnect} 
                        className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium shadow-lg shadow-purple-600/20 transition-all"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ================= RIGHT SIDEBAR (FIXED LIVE DATA) ================= */}
      {/* ================= RIGHT SIDEBAR (FIXED LIVE DATA) ================= */}
      <aside className="w-[320px] h-full bg-[#08080C] border-l border-white/5 flex flex-col z-20 hidden xl:flex">
        <div className="p-6 flex-1 flex flex-col border-b border-white/5">
          <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6 flex justify-between">Live Activity Feed</h3>
          
          {/* Dynamic Feed updated based on AI execution */}
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {workflowData ? (
              workflowData.map((step, index) => (
                <ActivityItem 
                  key={index}
                  icon={getAppIcon(step.app)} 
                  bg="bg-white/10" 
                  title={`${step.app} Action Triggered`} 
                  desc={step.action.replace(/_/g, " ")} 
                  time="Just now" 
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                <Activity className="w-8 h-8 text-gray-500 mb-3" />
                <p className="text-xs text-gray-400">Waiting for commands...<br/>Run a workflow to see live activity.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-b border-white/5">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase">AI Brain Status</h3>
             <span className="text-green-400 text-xs font-medium flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>Online</span>
           </div>
           <div className="flex justify-center my-4">
             <div className="w-32 h-24 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] relative rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-orange-900/50 blur-xl"></div>
                <BrainCircuit className="w-12 h-12 text-orange-400 relative z-10" />
             </div>
           </div>
           <p className="text-xs text-gray-400 text-center leading-relaxed">Learning from your workflows.<br/>Getting smarter every day.</p>
        </div>
      </aside>
    </div>
  );
}

// ----- Mini Components -----
function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${active ? 'bg-gradient-to-r from-white/10 to-transparent text-white border-l-2 border-pink-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <span className="w-5 h-5">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function NodeCard({ icon, app, action, badge }) {
  return (
    <div className="min-w-[180px] bg-[#13131A] border border-white/10 rounded-xl p-4 flex items-start space-x-3 relative group hover:border-purple-500/50 transition-all cursor-pointer">
      <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-white flex items-center capitalize">{app} {badge && <span className="ml-2 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{badge}</span>}</h4>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 capitalize">{action}</p>
      </div>
    </div>
  );
}

function Arrow() {
  return <div className="w-8 h-px bg-gradient-to-r from-purple-500/50 to-pink-500/50 mx-2 relative flex-shrink-0"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-pink-500/80 rotate-45"></div></div>;
}

function ActivityItem({ icon, bg, title, desc, time }) {
  return (
    <div className="flex space-x-3 items-start relative">
      <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0 shadow-lg relative z-10 border border-white/20`}>{icon}</div>
      <div className="flex-1"><h4 className="text-sm font-medium text-white">{title}</h4><p className="text-xs text-gray-500 mt-0.5">{desc}</p></div>
      <div className="flex items-center space-x-1"><span className="text-[10px] text-gray-500">{time}</span><CheckCircle2 className="w-3 h-3 text-green-500" /></div>
    </div>
  );
}

function AppConnectCard({ icon, name, connected }) {
  return (
    <div className="bg-[#111116] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-purple-500/50 transition-all group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="bg-white/5 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform relative z-10 border border-white/10">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2 relative z-10">{name}</h3>
      <p className="text-xs text-gray-400 mb-6 relative z-10">Automate {name} workflows securely</p>
      {connected ? (
        <button className="w-full flex items-center justify-center space-x-2 bg-green-500/10 text-green-400 border border-green-500/20 py-2.5 rounded-xl font-medium text-sm relative z-10">
          <CheckCircle2 className="w-4 h-4" /><span>Connected</span>
        </button>
      ) : (
        <button className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 py-2.5 rounded-xl font-medium text-sm transition-colors relative z-10">
          <Link2 className="w-4 h-4" /><span>Connect Account</span>
        </button>
      )}
    </div>
  );
}