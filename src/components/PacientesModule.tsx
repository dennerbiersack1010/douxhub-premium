"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Calendar,
  MoreHorizontal,
  Paperclip,
  Smile,
  Send,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from "lucide-react";

// ─────────────────────────────────────────────
// PATIENTS DATA SET FOR THE EXACT SPECIFICATION
// ─────────────────────────────────────────────

interface Message {
  sender: "client" | "clinic";
  time: string;
  text: string;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  email: string;
  status: "Em tratamento" | "Aguardando retorno" | "Sessão hoje" | "Parcela em aberto";
  avatar: string;
  protocol: string;
  sessionsCompleted: number;
  sessionsTotal: number;
  nextSession: string;
  financeOpen: string;
  totalContracted: string;
  totalReceived: string;
  totalOpen: string;
  messages: Message[];
}

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 78532,
    name: "Juliana Mendes",
    age: 32,
    phone: "(11) 99876-5432",
    email: "juliana.mendes@email.com",
    status: "Em tratamento",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    protocol: "Protocolo facial - 8 sessões",
    sessionsCompleted: 5,
    sessionsTotal: 8,
    nextSession: "24 mai, 10:00",
    financeOpen: "R$ 1.250,00",
    totalContracted: "R$ 3.200,00",
    totalReceived: "R$ 1.950,00",
    totalOpen: "R$ 1.250,00",
    messages: [
      { sender: "client", time: "08:42", text: "Bom dia! Tudo bem? Confirmando minha sessão de amanhã." },
      { sender: "clinic", time: "08:43", text: "Oi Juliana! Está tudo confirmado para amanhã às 10h. Qualquer dúvida, estamos à disposição." }
    ]
  },
  {
    id: 66211,
    name: "Beatriz Oliveira",
    age: 28,
    phone: "(11) 98877-6655",
    email: "beatriz.oliveira@email.com",
    status: "Aguardando retorno",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    protocol: "Preenchimento Labial - 2 sessões",
    sessionsCompleted: 1,
    sessionsTotal: 2,
    nextSession: "Pendente",
    financeOpen: "R$ 0,00",
    totalContracted: "R$ 1.800,00",
    totalReceived: "R$ 1.800,00",
    totalOpen: "R$ 0,00",
    messages: [
      { sender: "client", time: "11:15", text: "Gostei muito do resultado da primeira sessão! Quando posso voltar?" },
      { sender: "clinic", time: "11:20", text: "Que ótimo, Beatriz! O ideal são 15 dias. Vamos agendar para o dia 28?" }
    ]
  },
  {
    id: 99123,
    name: "Carolina Alves",
    age: 41,
    phone: "(11) 97766-5544",
    email: "carolina.alves@email.com",
    status: "Sessão hoje",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    protocol: "Lipo Sem Cortes - 10 sessões",
    sessionsCompleted: 8,
    sessionsTotal: 10,
    nextSession: "Hoje, 15:30",
    financeOpen: "R$ 500,00",
    totalContracted: "R$ 4.500,00",
    totalReceived: "R$ 4.000,00",
    totalOpen: "R$ 500,00",
    messages: [
      { sender: "client", time: "09:00", text: "Hoje a sessão está confirmada, né?" },
      { sender: "clinic", time: "09:05", text: "Confirmadíssima, Carolina! Aguardamos você às 15h30." }
    ]
  },
  {
    id: 55421,
    name: "Renata Costa",
    age: 35,
    phone: "(11) 96655-4433",
    email: "renata.costa@email.com",
    status: "Parcela em aberto",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
    protocol: "Protocolo Flacidez Zero - 6 sessões",
    sessionsCompleted: 3,
    sessionsTotal: 6,
    nextSession: "02 jun, 14:00",
    financeOpen: "R$ 2.100,00",
    totalContracted: "R$ 4.200,00",
    totalReceived: "R$ 2.100,00",
    totalOpen: "R$ 2.100,00",
    messages: [
      { sender: "client", time: "14:22", text: "Consegue me enviar a segunda via do boleto vencido dia 10?" },
      { sender: "clinic", time: "14:30", text: "Claro, Renata! Já encaminhei para o seu e-mail cadastrado." }
    ]
  },
  {
    id: 33109,
    name: "Amanda Lopes",
    age: 29,
    phone: "(11) 95544-3322",
    email: "amanda.lopes@email.com",
    status: "Aguardando retorno",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    protocol: "Peeling de Diamante - 3 sessões",
    sessionsCompleted: 2,
    sessionsTotal: 3,
    nextSession: "Pendente",
    financeOpen: "R$ 0,00",
    totalContracted: "R$ 900,00",
    totalReceived: "R$ 900,00",
    totalOpen: "R$ 0,00",
    messages: [
      { sender: "client", time: "10:12", text: "Oi! Tive um imprevisto e não poderei comparecer na próxima semana." }
    ]
  },
  {
    id: 88122,
    name: "Larissa Martins",
    age: 31,
    phone: "(11) 94433-2211",
    email: "larissa.martins@email.com",
    status: "Em tratamento",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    protocol: "Aplicação Botox - 1 sessão",
    sessionsCompleted: 0,
    sessionsTotal: 1,
    nextSession: "28 mai, 11:00",
    financeOpen: "R$ 1.500,00",
    totalContracted: "R$ 1.500,00",
    totalReceived: "R$ 0,00",
    totalOpen: "R$ 1.500,00",
    messages: []
  },
  {
    id: 44210,
    name: "Patrícia Gomes",
    age: 37,
    phone: "(11) 93322-1100",
    email: "patricia.gomes@email.com",
    status: "Em tratamento",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150",
    protocol: "Fios PDO Sustentação - 4 sessões",
    sessionsCompleted: 2,
    sessionsTotal: 4,
    nextSession: "05 jun, 16:00",
    financeOpen: "R$ 2.400,00",
    totalContracted: "R$ 4.800,00",
    totalReceived: "R$ 2.400,00",
    totalOpen: "R$ 2.400,00",
    messages: []
  }
];

export default function PacientesModule() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [activePatientId, setActivePatientId] = useState<number>(78532);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailTab, setDetailTab] = useState("visao");
  const [chatMessage, setChatMessage] = useState("");

  const activePatient = useMemo(() => {
    return patients.find(p => p.id === activePatientId) || patients[0];
  }, [patients, activePatientId]);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      String(p.id).includes(searchQuery)
    );
  }, [patients, searchQuery]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setPatients(prev => prev.map(p => {
      if (p.id === activePatientId) {
        return {
          ...p,
          messages: [
            ...p.messages,
            { sender: "clinic", time: "13:52", text: chatMessage }
          ]
        };
      }
      return p;
    }));
    setChatMessage("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full overflow-hidden text-zinc-100 font-sans select-none">
      
      {/* COLUMN 1: PATIENTS LIST (LEFT) - 3 Columns Width */}
      <div className="lg:col-span-3 bg-[#131416] border border-white/[0.05] rounded-2xl flex flex-col h-full overflow-hidden">
        
        {/* Search header area */}
        <div className="p-4 space-y-3.5 bg-[#131416]">
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-black text-white uppercase tracking-wider">Pacientes</span>
            <button className="flex items-center gap-1 text-[11px] text-zinc-400 font-bold bg-[#1c1d1f] border border-white/[0.06] px-3 py-1.5 rounded-lg hover:text-white transition-all">
              Todos <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1d1f] border border-white/[0.06] focus:border-[#bcf046]/30 focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          </div>

          <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider text-zinc-500 pt-1">
            <span className="text-white border-b-2 border-[#bcf046] pb-2.5 cursor-pointer">Todos <strong className="text-white font-bold ml-0.5">128</strong></span>
            <span className="cursor-pointer hover:text-zinc-300 pb-2.5">Ativos <strong className="text-zinc-500 font-bold ml-0.5">66</strong></span>
            <span className="cursor-pointer hover:text-zinc-300 pb-2.5">Inativos <strong className="text-zinc-500 font-bold ml-0.5">12</strong></span>
          </div>
        </div>

        {/* Patients list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-transparent border-t border-white/[0.05]">
          {filteredPatients.map(p => {
            const isSelected = p.id === activePatientId;
            
            const statusDot = p.status === "Em tratamento" || p.status === "Sessão hoje" 
              ? "bg-[#bcf046]" 
              : p.status === "Aguardando retorno" 
              ? "bg-amber-400" 
              : "bg-rose-500";

            return (
              <div
                key={p.id}
                onClick={() => setActivePatientId(p.id)}
                className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border ${
                  isSelected 
                    ? "bg-[#21231a] border-[#bcf046]/25 shadow-sm relative overflow-hidden" 
                    : "bg-transparent border-transparent hover:bg-white/5"
                }`}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#bcf046]" />
                )}
                
                <img 
                  src={p.avatar} 
                  alt={p.name} 
                  className={`w-9 h-9 rounded-full object-cover border ${isSelected ? "border-[#bcf046]/25" : "border-white/10"}`} 
                  onError={(e) => {
                    // Fallback to placeholder if Unsplash is slow
                    e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.name}`;
                  }}
                />
                
                <div className="overflow-hidden flex-1 leading-tight space-y-1">
                  <p className={`text-xs font-bold truncate ${isSelected ? "text-[#bcf046]" : "text-zinc-200"}`}>{p.name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold">ID {p.id} · {p.age} anos</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot} shrink-0`} />
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      isSelected && p.status === "Em tratamento" ? "text-[#bcf046]" : "text-zinc-400"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Patient Footer */}
        <div className="p-3 border-t border-white/[0.05] bg-[#131416]">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1c1d1f] hover:bg-[#232528] border border-white/[0.06] text-xs font-bold uppercase tracking-wider text-white rounded-xl transition-all shadow-md">
            <Plus className="w-4 h-4 text-[#bcf046]" /> Novo paciente
          </button>
        </div>
      </div>

      {/* COLUMN 2: PATIENT DETAIL (CENTER) - 6 Columns Width */}
      <div className="lg:col-span-6 flex flex-col h-full space-y-4">
        
        {/* Header Profile card */}
        <div className="bg-[#131416] border border-white/[0.05] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <img 
                src={activePatient.avatar} 
                alt={activePatient.name} 
                className="w-11 h-11 rounded-full object-cover border border-[#bcf046]/30 shadow-md shadow-[#bcf046]/5" 
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${activePatient.name}`;
                }}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-base font-black text-white leading-none">{activePatient.name}</h4>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#bcf046]/10 text-[#bcf046] border border-[#bcf046]/20 leading-none">
                    Ativa
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-semibold tracking-wide leading-none">
                  ID {activePatient.id} · {activePatient.age} anos · {activePatient.phone} · {activePatient.email}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button className="px-3.5 py-2 border border-white/10 bg-[#1c1d1f] hover:bg-white/5 text-zinc-300 hover:text-white text-xs font-bold rounded-xl transition-all">
                Editar perfil
              </button>
              
              <button className="flex items-center gap-1 px-3.5 py-2 bg-[#bcf046] hover:bg-[#acd840] text-black text-xs font-black rounded-xl shadow-md hover:shadow-[#bcf046]/15 transition-all">
                Nova consulta <ChevronDown className="w-3.5 h-3.5 text-black" />
              </button>

              <button className="p-2.5 border border-white/10 bg-[#1c1d1f] hover:bg-white/5 text-zinc-400 hover:text-white rounded-xl transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Sub Navigation Tabs */}
          <div className="border-t border-white/[0.05] pt-3 flex gap-6 overflow-x-auto text-[10px] font-black uppercase tracking-wider text-zinc-500">
            <button onClick={() => setDetailTab("visao")} className={`pb-2 hover:text-white transition-all relative ${detailTab === "visao" ? "text-white" : ""}`}>
              Visão geral
              {detailTab === "visao" && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#bcf046]" />}
            </button>
            <button onClick={() => setDetailTab("tratamentos")} className={`pb-2 hover:text-white transition-all relative ${detailTab === "tratamentos" ? "text-white" : ""}`}>
              Tratamentos
              {detailTab === "tratamentos" && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#bcf046]" />}
            </button>
            <button onClick={() => setDetailTab("comercial")} className={`pb-2 hover:text-white transition-all relative ${detailTab === "comercial" ? "text-white" : ""}`}>
              Comercial
              {detailTab === "comercial" && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#bcf046]" />}
            </button>
            <button onClick={() => setDetailTab("financeiro")} className={`pb-2 hover:text-white transition-all relative ${detailTab === "financeiro" ? "text-white" : ""}`}>
              Financeiro
              {detailTab === "financeiro" && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#bcf046]" />}
            </button>
            <button onClick={() => setDetailTab("prontuarios")} className={`pb-2 hover:text-white transition-all relative ${detailTab === "prontuarios" ? "text-white" : ""}`}>
              Prontuários
              {detailTab === "prontuarios" && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#bcf046]" />}
            </button>
            <button onClick={() => setDetailTab("timeline")} className={`pb-2 hover:text-white transition-all relative ${detailTab === "timeline" ? "text-white" : ""}`}>
              Timeline
              {detailTab === "timeline" && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#bcf046]" />}
            </button>
          </div>
        </div>

        {/* Dynamic Detail Card + Chat Panel */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
          
          {/* Card: Ciclo do Tratamento */}
          <div className="bg-[#131416] border border-white/[0.05] rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4 relative overflow-hidden">
            
            {/* Visual Image representing the treatment */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] opacity-20 pointer-events-none select-none">
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800" 
                alt="Spa Facial Therapy"
                className="w-full h-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#131416] via-transparent to-[#131416]" />
            </div>

            {/* Left Content Column */}
            <div className="md:col-span-8 space-y-4 relative z-10">
              <div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">Ciclo do tratamento</span>
                <h3 className="text-sm font-black text-white mt-1">{activePatient.protocol}</h3>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-zinc-400">
                  {activePatient.sessionsCompleted} de {activePatient.sessionsTotal} sessões concluídas
                </span>
                
                {/* Horizontal progress bar */}
                <div className="w-[85%] bg-zinc-800/80 h-[5px] rounded-full overflow-hidden">
                  <div 
                    className="bg-[#bcf046] h-full" 
                    style={{ width: `${(activePatient.sessionsCompleted / activePatient.sessionsTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Next session and badges */}
              <div className="flex flex-wrap items-center gap-5 pt-1">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Próxima sessão</span>
                  <div className="flex items-center gap-1.5 text-xs text-white font-bold">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{activePatient.nextSession}</span>
                  </div>
                </div>

                <div className="self-end pb-0.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#bcf046] bg-[#21231a] border border-[#bcf046]/20 px-2.5 py-1.5 rounded-lg">
                    Tratamento em andamento
                  </span>
                </div>
              </div>
              {/* Financial status row */}
              <div className="pt-1.5">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Financeiro do tratamento: <strong className="text-amber-500 font-black">{activePatient.financeOpen} em aberto</strong>
                </p>
              </div>
            </div>

            {/* Right Progress Ring Column */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-l border-white/[0.05] pl-4 relative z-10">
              {/* Circular SVG chart */}
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="rgba(255, 255, 255, 0.03)" 
                    strokeWidth="7" 
                    fill="transparent" 
                  />
                  {/* Glowing progress Circle */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="#bcf046" 
                    strokeWidth="7" 
                    fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * (activePatient.sessionsCompleted / activePatient.sessionsTotal))}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    style={{ filter: "drop-shadow(0 0 4px rgba(188, 240, 70, 0.35))" }}
                  />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center">
                  <span className="text-base font-black text-white">
                    {Math.round((activePatient.sessionsCompleted / activePatient.sessionsTotal) * 100)}%
                  </span>
                  <span className="text-[7px] text-zinc-500 font-black uppercase tracking-widest mt-1">Progresso</span>
                </div>
              </div>

              <button className="mt-3.5 px-4 py-1.5 bg-[#1c1d1f] hover:bg-white/5 text-zinc-300 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-white/[0.06] shadow-sm">
                Ver detalhes
              </button>
            </div>

          </div>

          {/* Conversations panel */}
          <div className="bg-[#131416] border border-white/[0.05] rounded-2xl flex flex-col h-[320px] overflow-hidden">
            
            {/* Conversations inner tabs */}
            <div className="px-5 pt-3 border-b border-white/[0.05] bg-[#131416] flex gap-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <button className="pb-2 text-white border-b-2 border-[#bcf046] relative font-bold">Conversas</button>
              <button className="pb-2 hover:text-white transition-colors">Anotações</button>
              <button className="pb-2 hover:text-white transition-colors">Arquivos</button>
              <button className="pb-2 hover:text-white transition-colors">Histórico</button>
            </div>

            {/* Chat logs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
              {activePatient.messages.length > 0 ? (
                activePatient.messages.map((msg, index) => {
                  const isClinic = msg.sender === "clinic";
                  return (
                    <div 
                      key={index} 
                      className={`flex gap-3 text-xs max-w-[85%] ${isClinic ? "ml-auto flex-row-reverse" : ""}`}
                    >
                      <img 
                        src={isClinic ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" : activePatient.avatar} 
                        alt="sender" 
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10" 
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${isClinic ? 'clinic' : activePatient.name}`;
                        }}
                      />
                      
                      <div className="space-y-1">
                        <div className={`flex items-center gap-1.5 ${isClinic ? "justify-end" : ""}`}>
                          <span className="text-[9px] font-black text-white">{isClinic ? "Clínica" : activePatient.name}</span>
                          <span className="text-[8px] text-zinc-500 font-mono">{msg.time}</span>
                        </div>
                        <div className={`p-3 rounded-2xl leading-relaxed text-white text-xs ${
                          isClinic 
                            ? "bg-[#1c1d1f] border border-white/[0.06] rounded-tr-none" 
                            : "bg-[#1c1d1f] border border-white/[0.06] rounded-tl-none"
                        }`}>
                          <p>{msg.text}</p>
                          {isClinic && (
                            <div className="flex justify-end mt-1 text-[8px]">
                              <CheckCheck className="w-3.5 h-3.5 text-[#bcf046]" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-600 space-y-1.5">
                  <MessageSquare className="w-5 h-5 opacity-30" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Nenhuma conversa encontrada</span>
                </div>
              )}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/[0.05] bg-[#131416] flex items-center gap-2">
              <button type="button" className="text-zinc-500 hover:text-white p-1 hover:bg-white/5 rounded-md shrink-0">
                <Smile className="w-4.5 h-4.5" />
              </button>
              <button type="button" className="text-zinc-500 hover:text-white p-1 hover:bg-white/5 rounded-md shrink-0">
                <Paperclip className="w-4.5 h-4.5" />
              </button>
              
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                className="flex-1 bg-[#1c1d1f] border border-white/[0.06] focus:outline-none rounded-xl px-4 py-2 text-xs text-white focus:border-white/20 transition-colors"
              />

              <button 
                type="submit" 
                className="p-2 bg-[#bcf046] hover:bg-[#acd840] text-black rounded-xl transition-all shrink-0 shadow-md shadow-[#bcf046]/10"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* COLUMN 3: FINANCE & ACTIONS (RIGHT) - 3 Columns Width */}
      <div className="lg:col-span-3 flex flex-col h-full space-y-4">
        
        {/* Card: Resumo Financeiro */}
        <div className="bg-[#131416] border border-white/[0.05] rounded-2xl p-4.5 space-y-4 shadow-sm">
          <div className="border-b border-white/[0.05] pb-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Resumo financeiro</h4>
          </div>

          <div className="space-y-4 text-xs font-bold leading-none">
            <div className="flex justify-between">
              <span className="text-zinc-400">Total contratado</span>
              <span className="text-white">{activePatient.totalContracted}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-zinc-400">Total recebido</span>
              <span className="text-white">{activePatient.totalReceived}</span>
            </div>

            <div className="flex justify-between items-center border-t border-white/[0.05] pt-3.5 mt-1">
              <span className="text-zinc-400">Em aberto</span>
              <span className="text-amber-500 font-black text-sm">{activePatient.totalOpen}</span>
            </div>
          </div>

          <button className="w-full py-2 bg-transparent border border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all mt-2">
            Ver detalhes financeiros
          </button>
        </div>

        {/* Card: Ações de Hoje */}
        <div className="bg-[#131416] border border-white/[0.05] rounded-2xl p-4.5 flex-1 flex flex-col justify-between shadow-sm min-h-[300px]">
          
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Ações de hoje</h4>
              <span className="text-[10px] font-black uppercase text-black bg-[#bcf046] px-2 py-0.5 rounded-md leading-none">
                4
              </span>
            </div>

            {/* Checklist tasks */}
            <div className="space-y-4 text-xs overflow-y-auto max-h-[240px] pr-1">
              <TaskCheckbox label="Confirmar sessão" pro="09:00" desc={activePatient.name} />
              <TaskCheckbox label="Cobrar parcela" pro="11:00" desc={activePatient.name} />
              <TaskCheckbox label="Enviar termo" pro="14:00" desc={activePatient.name} />
              <TaskCheckbox label="Agendar retorno" pro="16:00" desc={activePatient.name} />
            </div>
          </div>

          <button className="w-full py-2 bg-transparent border border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all mt-4 shrink-0">
            Ver todas as ações
          </button>
        </div>

      </div>

    </div>
  );
}

// ─────────────────────────────────────────────
// CHECKBOX COMPONENT
// ─────────────────────────────────────────────

function TaskCheckbox({ label, pro, desc }: { label: string; pro: string; desc: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <label className="flex items-start gap-3 cursor-pointer group select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="hidden"
      />
      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
        checked ? "bg-[#bcf046] border-[#bcf046]" : "bg-transparent border-white/10 group-hover:border-white/20"
      }`}>
        {checked && <CheckCheck className="w-3 h-3 text-black font-black" />}
      </div>
      
      <div className="flex-1 leading-none space-y-1">
        <div className="flex justify-between">
          <span className={`text-[11px] font-bold ${checked ? "text-zinc-500 line-through" : "text-zinc-300 group-hover:text-white"}`}>{label}</span>
          <span className="text-[10px] text-zinc-500 font-bold">{pro}</span>
        </div>
        <p className="text-[9px] text-zinc-500 font-semibold">{desc}</p>
      </div>
    </label>
  );
}
