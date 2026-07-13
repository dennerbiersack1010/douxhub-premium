"use client";

import React, { useState, useMemo } from "react";
import AgendaModule from "@/components/AgendaModule";
import ComercialModule, { Lead } from "@/components/ComercialModule";
import PacientesModule from "@/components/PacientesModule";
import {
  LayoutDashboard,
  Calendar,
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  FileText,
  Briefcase,
  Zap,
  BarChart3,
  Network,
  Settings,
  Bot,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Plus,
  Send,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingDown
} from "lucide-react";

// ─────────────────────────────────────────────
// MOCK DATA SETS
// ─────────────────────────────────────────────

const MOCK_PATIENTS = [
  { id: 1, name: "Maria Silva", phone: "(11) 98765-4321", tag: "Drenagem", since: "12/03/2025", lastVisit: "Há 4 dias", status: "Ativo" },
  { id: 2, name: "Ana Souza", phone: "(11) 97766-5544", tag: "Botox", since: "05/04/2025", lastVisit: "Há 12 dias", status: "Ativo" },
  { id: 3, name: "Roberta Lima", phone: "(11) 96655-4433", tag: "Preenchimento", since: "20/01/2025", lastVisit: "Há 48 dias", status: "Frio" },
  { id: 4, name: "Fernanda Costa", phone: "(11) 95544-3322", tag: "Fios PDO", since: "10/02/2025", lastVisit: "Há 60 dias", status: "Em Risco" }
];

const MOCK_APPOINTMENTS = [
  { id: 1, client: "Camila Ferreira", service: "Avaliação Harmonização", time: "14:00", pro: "Dra. Paula", room: "Sala 02", status: "Confirmado" },
  { id: 2, client: "Maria Silva", service: "Sessão 03/10 Drenagem", time: "15:30", pro: "Juliana Alves", room: "Sala Estética", status: "Em Atendimento" },
  { id: 3, client: "Juliano Martins", service: "Aplicação Botox", time: "17:00", pro: "Dra. Paula", room: "Sala 01", status: "Agendado" },
  { id: 4, client: "Patrícia Gomes", service: "Lipo Sem Cortes", time: "18:30", pro: "Juliana Alves", room: "Sala 02", status: "Pendente" }
];

const MOCK_LEADS = [
  { id: 1, name: "Beatriz Costa", phone: "(11) 99999-1111", service: "Harmonização Facial", origin: "Instagram Ads", stage: "avaliacao", temperature: "Quente" as const, value: 3500, proId: 1, lastInteraction: "Hoje", nextAction: "Confirmar horário da avaliação" },
  { id: 2, name: "Gabriela Rocha", phone: "(11) 98888-2222", service: "Depilação Laser", origin: "Google Search", stage: "novo", temperature: "Morna" as const, value: 1200, proId: 2, lastInteraction: "Ontem", nextAction: "Enviar tabela de preços" },
  { id: 3, name: "Juliana Mendes", phone: "(11) 97777-3333", service: "Criolipólise", origin: "TikTok Ads", stage: "negociacao", temperature: "Quente" as const, value: 2200, proId: 1, lastInteraction: "Há 2 dias", nextAction: "Apresentar condições de parcelamento" }
];

const MOCK_TREATMENTS = [
  { id: 1, client: "Maria Silva", plan: "Protocolo Redutor Premium", sessionsUsed: 3, sessionsTotal: 10, nextSession: "18/07/2026", status: "Em Andamento" },
  { id: 2, client: "Roberta Lima", plan: "Preenchimento Mandibular", sessionsUsed: 1, sessionsTotal: 2, nextSession: "Excedido (Faltou)", status: "Em Risco" }
];

// ─────────────────────────────────────────────
// COMPONENT: Home (Douxhub Layout & Views)
// ─────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [selectedBranch, setSelectedBranch] = useState("Unidade Principal");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  // Tab configurations
  const menuItems = [
    { id: "inicio", label: "Início", icon: LayoutDashboard },
    { id: "agenda", label: "Agenda & Recepção", icon: Calendar },
    { id: "pacientes", label: "Pacientes", icon: Users },
    { id: "comercial", label: "Comercial", icon: TrendingUp },
    { id: "tratamentos", label: "Tratamentos", icon: Activity },
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
    { id: "prontuarios", label: "Prontuários & Docs", icon: FileText },
    { id: "equipe", label: "Equipe & Comissões", icon: Briefcase },
    { id: "automacoes", label: "Automações", icon: Zap },
    { id: "relatorios", label: "Relatórios", icon: BarChart3 },
    { id: "integracoes", label: "Integrações", icon: Network },
    { id: "configuracoes", label: "Configurações", icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-[#0f111a] text-[#f8fafc] overflow-hidden select-none font-sans relative">
      
      {/* Background glow effects */}
      <div className="bg-glow-purple" />
      <div className="bg-glow-lime" />

      {/* SIDEBAR NAVEGAÇÃO */}
      <aside className={`bg-[#12141d] border-r border-white/5 flex flex-col justify-between shrink-0 z-10 transition-all duration-300 ${isSidebarCollapsed ? "w-[70px]" : "w-[260px]"}`}>
        <div>
          {/* Header Brand */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 bg-[#10121a]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#bcf046] to-[#86b12c] flex items-center justify-center shrink-0 shadow-lg shadow-[#bcf046]/15">
                <span className="font-black text-black text-sm tracking-tighter">D</span>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-black tracking-[0.18em] uppercase text-white">DOUXHUB</span>
                  <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase mt-0.5">Estética OS</span>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className="text-zinc-500 hover:text-white p-1 hover:bg-white/5 rounded-md transition-colors"
              title={isSidebarCollapsed ? "Expandir" : "Recolher"}
            >
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? "" : "rotate-180"}`} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg transition-all text-left text-xs font-bold uppercase tracking-wider relative group ${
                    isActive 
                      ? "bg-gradient-to-r from-[#bcf046]/10 to-transparent text-[#bcf046] border-l-2 border-[#bcf046]" 
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#bcf046]" : "text-zinc-400 group-hover:text-white"}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Block */}
        <div className="p-3.5 border-t border-white/5 bg-[#10121a]">
          <div className="flex items-center justify-between px-1 cursor-pointer group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-black text-zinc-300 uppercase shrink-0">
                AD
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">Dra. Paula Medeiros</p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest truncate">Gestora Geral</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        
        {/* TOP CONTEXT BAR */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#12141d]">
          <div className="flex items-center gap-2.5 text-[10px] text-zinc-500 uppercase tracking-widest font-black">
            <span>CLÍNICA ESTÉTICA</span>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <span className="text-white">
              {menuItems.find(i => i.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Branch switcher */}
            <div className="relative">
              <select 
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="bg-[#141722] text-[10px] font-black uppercase tracking-wider text-zinc-300 border border-white/5 px-3 py-1.5 focus:outline-none rounded-md appearance-none pr-8 cursor-pointer"
              >
                <option value="Unidade Principal">Unidade Principal</option>
                <option value="Unidade Jardins">Unidade Jardins</option>
              </select>
              <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-3 top-2.5 pointer-events-none" />
            </div>

            <div className="h-4 w-[1px] bg-white/5" />

            <div className="flex items-center gap-3.5">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-400 font-semibold">Hoje, 13 de Julho</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* TAB 1: INÍCIO (Central de Operações) */}
            {activeTab === "inicio" && (
              <div className="space-y-6">
                
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard title="Faturamento do Período" value="R$ 48.950,00" change="+14% vs. anterior" changeType="up" accentColor="purple" />
                  <MetricCard title="Vendas Fechadas" value="34" change="+8% vs. anterior" changeType="up" accentColor="blue" />
                  <MetricCard title="Valor não Consumido" value="R$ 18.420,00" change="Garantia de atendimento" changeType="neutral" accentColor="emerald" />
                  <MetricCard title="Taxa de Renovação" value="82%" change="+2.4% vs. anterior" changeType="up" accentColor="amber" />
                </div>

                {/* Dashboard Operations split layout */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* Left columns - "O que fazer agora" & IA Alerts */}
                  <div className="xl:col-span-2 space-y-6">
                    
                    {/* Active operational tasks checklist */}
                    <div className="glass-panel rounded-2xl p-6 shadow-xl">
                      <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                        <div>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Painel Operacional</span>
                          <h3 className="text-sm font-bold text-white mt-1">Ações recomendadas pela IA do Douxhub</h3>
                        </div>
                        <span className="text-[8px] font-black uppercase text-[#bcf046] bg-[#bcf046]/5 px-2.5 py-1 border border-[#bcf046]/20 rounded-md">
                          IA Integrada
                        </span>
                      </div>

                      <div className="space-y-3">
                        <TaskRow type="warning" title="Pacientes inativas sem retorno" desc="4 pacientes concluíram o tratamento há mais de 45 dias e não agendaram manutenção." action="Criar campanha WhatsApp" />
                        <TaskRow type="danger" title="Inadimplência financeira activa" desc="Camila Costa possui 2 parcelas atrasadas no boleto. Venceu há 10 dias." action="Enviar cobrança autorizada" />
                        <TaskRow type="pending" title="Avaliações sem fechamento de proposta" desc="3 propostas enviadas na última semana estão aguardando feedback da paciente." action="Ver funil comercial" />
                        <TaskRow type="info" title="Tratamento em risco de abandono" desc="Roberta Silva faltou à última sessão de Preenchimento e não reagendou." action="Ligar para paciente" />
                      </div>
                    </div>

                    {/* Funil Comercial Resumo */}
                    <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Pipeline Comercial</span>
                          <h3 className="text-sm font-bold text-white mt-1">Status dos Leads Ativos</h3>
                        </div>
                        <button onClick={() => setActiveTab("comercial")} className="text-[10px] font-black uppercase tracking-wider text-[#bcf046] hover:underline">Ver CRM detalhado</button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
                        <FunnelBlock label="Novos Leads" count="12" color="bg-zinc-800" text="Morna" />
                        <FunnelBlock label="Qualificados" count="8" color="bg-blue-950/20 text-blue-400 border-blue-500/20" text="Contatos" />
                        <FunnelBlock label="Avaliações" count="5" color="bg-amber-950/20 text-amber-400 border-amber-500/20" text="Marcadas" />
                        <FunnelBlock label="Propostas" count="4" color="bg-purple-950/20 text-purple-400 border-purple-500/20" text="Negociação" />
                        <FunnelBlock label="Ganhos" count="9" color="bg-emerald-950/20 text-emerald-400 border-[#bcf046]/20" text="Vendas" />
                      </div>
                    </div>

                  </div>

                  {/* Right column - Quick operational info (daily agenda check-in) */}
                  <div className="space-y-6">
                    
                    {/* Daily agenda tracker */}
                    <div className="glass-panel rounded-2xl p-5.5 space-y-4 shadow-xl">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-xs font-black text-white uppercase tracking-wider">Agendados de Hoje</span>
                        <button onClick={() => setActiveTab("agenda")} className="text-[10px] font-black text-[#bcf046] hover:underline uppercase tracking-wider">Ver Agenda</button>
                      </div>

                      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                        {appointments.map(app => (
                          <div key={app.id} className="p-3.5 bg-[#141624]/60 border border-white/5 hover:border-white/10 rounded-xl flex items-center justify-between text-xs transition-all duration-250 hover:bg-[#1b1f33]/70">
                            <div className="space-y-1">
                              <p className="font-bold text-white leading-tight">{app.client}</p>
                              <p className="text-[10px] text-zinc-500 font-semibold">{app.service} · {app.pro}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                              <span className="text-[10px] text-zinc-400 font-mono font-semibold">{app.time}</span>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                                app.status === 'Confirmado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                app.status === 'Em Atendimento' ? 'bg-[#9f5cf5]/10 text-[#9f5cf5] border-[#9f5cf5]/20' : 
                                app.status === 'Agendado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* WhatsApp Quality API integration Status */}
                    <div className="glass-panel rounded-2xl p-5.5 shadow-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-xs font-black text-white uppercase tracking-wider">Status do WhatsApp</span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#bcf046] animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#bcf046]">Ativo</span>
                        </span>
                      </div>
                      
                      <div className="text-xs space-y-3.5 text-zinc-400 font-semibold">
                        <div className="flex justify-between">
                          <span>Qualidade do Número:</span>
                          <span className="font-bold text-white">Alta (Verde)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Disparos Hoje:</span>
                          <span className="font-bold text-white">48/1000 limit</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: AGENDA & RECEPÇÃO */}
            {activeTab === "agenda" && (
              <AgendaModule 
                appointments={appointments} 
                setAppointments={setAppointments} 
                patients={MOCK_PATIENTS} 
              />
            )}

            {/* TAB 3: COMERCIAL (CRM) */}
            {activeTab === "comercial" && (
              <ComercialModule 
                leads={leads}
                setLeads={setLeads}
              />
            )}

            {/* TAB 4: PACIENTES */}
            {activeTab === "pacientes" && (
              <PacientesModule />
            )}

            {/* PLACEHOLDERS FOR OTHER 8 TABS */}
            {activeTab !== "inicio" && activeTab !== "agenda" && activeTab !== "comercial" && activeTab !== "pacientes" && (
              <div className="glass-panel rounded-xl p-10 text-center min-h-[500px] flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 shadow-xl">
                  {React.createElement(menuItems.find(i => i.id === activeTab)?.icon || LayoutDashboard, { className: "w-8 h-8" })}
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-bold text-white">Módulo em Desenvolvimento</h3>
                  <p className="text-xs text-zinc-400">
                    A aba **{menuItems.find(i => i.id === activeTab)?.label}** do Douxhub foi provisionada com sucesso no roteamento modular. Ela está pronta para receber a codificação operacional e o design final do sistema unificado.
                  </p>
                </div>
                <div className="bg-[#11131a] border border-white/5 rounded-lg p-4 max-w-lg text-left text-xs font-mono text-zinc-500">
                  <span className="text-purple-400 font-bold">douxhub_routing_status:</span> ready_to_render_module: {activeTab}
                </div>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────

function MetricCard({ title, value, change, changeType, accentColor }: { title: string; value: string; change: string; changeType: "up" | "down" | "neutral"; accentColor: string }) {
  const glowShadow = accentColor === 'purple' ? 'hover:shadow-[0_0_25px_rgba(159,92,245,0.15)] hover:border-[#9f5cf5]/30' 
                   : accentColor === 'blue' ? 'hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:border-blue-500/30' 
                   : accentColor === 'emerald' ? 'hover:shadow-[0_0_25px_rgba(188,240,70,0.15)] hover:border-[#bcf046]/30' 
                   : 'hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:border-amber-500/30';

  const accentBg = accentColor === 'purple' ? 'bg-[#9f5cf5]' 
                 : accentColor === 'blue' ? 'bg-blue-400' 
                 : accentColor === 'emerald' ? 'bg-[#bcf046]' 
                 : 'bg-amber-400';

  return (
    <div className={`glass-panel rounded-2xl p-5.5 flex flex-col justify-between hover:bg-[#171a26]/80 ${glowShadow} transform hover:-translate-y-0.5 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">{title}</span>
        <span className={`w-2 h-2 rounded-full ${accentBg} shadow-md shadow-white/10`} />
      </div>
      
      <div className="flex items-end justify-between pt-6">
        <span className="text-2xl font-black text-white tracking-tight font-sans">{value}</span>
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border ${
          changeType === 'up' ? 'bg-[#bcf046]/10 text-[#bcf046] border-[#bcf046]/20' :
          changeType === 'down' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
          'bg-[#1c1e2d] text-zinc-400 border-white/5'
        } uppercase tracking-wider`}>
          {change}
        </span>
      </div>
    </div>
  );
}

function TaskRow({ type, title, desc, action }: { type: "warning" | "danger" | "pending" | "info"; title: string; desc: string; action: string }) {
  const accentColor = type === 'warning' ? '#f59e0b' : type === 'danger' ? '#f43f5e' : type === 'pending' ? '#bcf046' : '#3b82f6';
  const borderCol = type === 'warning' ? 'border-l-amber-500' : type === 'danger' ? 'border-l-rose-500' : type === 'pending' ? 'border-l-[#bcf046]' : 'border-l-blue-500';
  
  return (
    <div className={`p-4 bg-[#141624]/60 border border-white/5 border-l-4 ${borderCol} rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-[#1b1f33]/70 transition-all duration-200`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <p className="font-black text-white uppercase tracking-wider text-[10px]">{title}</p>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed pl-3.5 font-medium">{desc}</p>
      </div>
      <button className="px-4 py-2 bg-[#1c1e2d] hover:bg-[#bcf046] hover:text-black text-white font-black tracking-wider uppercase text-[9px] rounded-lg border border-white/5 transition-all shadow-sm shrink-0">
        {action}
      </button>
    </div>
  );
}

function FunnelBlock({ label, count, color, text }: { label: string; count: string; color: string; text: string }) {
  return (
    <div className="glass-card-list p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden group">
      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.18em]">{label}</span>
      <span className="text-xl font-black text-white group-hover:scale-105 transition-transform">{count}</span>
      <span className={`text-[8px] font-black px-2.5 py-1 rounded-md border uppercase tracking-wider ${color}`}>
        {text}
      </span>
    </div>
  );
}
