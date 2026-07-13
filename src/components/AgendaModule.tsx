"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  Info,
  DollarSign,
  Briefcase
} from "lucide-react";

// Mock definitions
const PROFESSIONALS = [
  { id: 1, name: "Dra. Paula Medeiros", role: "Biomédica Esteta" },
  { id: 2, name: "Juliana Alves", role: "Esteticista Corporal" },
  { id: 3, name: "Dra. Mariana Cruz", role: "Dermatologista" },
  { id: 4, name: "Rafael Lima", role: "Massoterapeuta" }
];

const ROOMS = [
  { id: "room1", name: "Sala 01 (Injetáveis)" },
  { id: "room2", name: "Sala 02 (Laser/Corporal)" },
  { id: "room3", name: "Sala Estética 01" }
];

const EQUIPMENT = [
  { id: "laser", name: "Laser Soprano Titanium" },
  { id: "crio", name: "Criofrequência Body Health" },
  { id: "none", name: "Nenhum" }
];

const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

interface AgendaModuleProps {
  appointments: any[];
  setAppointments: React.Dispatch<React.SetStateAction<any[]>>;
  patients: any[];
}

export default function AgendaModule({ appointments, setAppointments, patients }: AgendaModuleProps) {
  const [subTab, setSubTab] = useState<"agenda" | "recepcao">("agenda");
  const [viewMode, setViewMode] = useState<"pro" | "room">("pro");
  
  // Drawer states (Prontuário Rápido)
  const [selectedPatientProfile, setSelectedPatientProfile] = useState<any | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<any | null>(null);
  const [formClient, setFormClient] = useState("");
  const [formService, setFormService] = useState("");
  const [formProId, setFormProId] = useState(1);
  const [formRoom, setFormRoom] = useState("Sala 01 (Injetáveis)");
  const [formEquip, setFormEquip] = useState("Nenhum");
  const [formTime, setFormTime] = useState("09:00");
  const [formStatus, setFormStatus] = useState("Agendado");
  const [validationError, setValidationError] = useState("");

  const handleOpenNewModal = () => {
    setEditingApp(null);
    setFormClient("");
    setFormService("");
    setFormProId(1);
    setFormRoom("Sala 01 (Injetáveis)");
    setFormEquip("Nenhum");
    setFormTime("09:00");
    setFormStatus("Agendado");
    setValidationError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app: any) => {
    setEditingApp(app);
    setFormClient(app.client);
    setFormService(app.service);
    setFormProId(app.proId || 1);
    setFormRoom(app.room || "Sala 01 (Injetáveis)");
    setFormEquip(app.equipment || "Nenhum");
    setFormTime(app.time);
    setFormStatus(app.status);
    setValidationError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClient.trim()) {
      setValidationError("O nome do paciente é obrigatório.");
      return;
    }
    if (!formService.trim()) {
      setValidationError("O serviço é obrigatório.");
      return;
    }

    // Checking for multi-level double booking (same professional, same room, or same equipment at the same time)
    const conflict = appointments.find((app) => {
      if (editingApp && app.id === editingApp.id) return false;
      if (app.time !== formTime) return false;
      
      const proConflict = app.proId === Number(formProId);
      const roomConflict = app.room === formRoom;
      const equipConflict = formEquip !== "Nenhum" && app.equipment === formEquip;

      return proConflict || roomConflict || equipConflict;
    });

    if (conflict) {
      let conflictMsg = "Conflito: ";
      if (conflict.proId === Number(formProId)) {
        const pName = PROFESSIONALS.find(p => p.id === Number(formProId))?.name;
        conflictMsg += `${pName} já possui atendimento às ${formTime}. `;
      } else if (conflict.room === formRoom) {
        conflictMsg += `${formRoom} já está reservada para às ${formTime}. `;
      } else {
        conflictMsg += `${formEquip} já está em uso às ${formTime}. `;
      }
      setValidationError(conflictMsg);
      return;
    }

    const proName = PROFESSIONALS.find(p => p.id === Number(formProId))?.name || "Dra. Paula";

    if (editingApp) {
      setAppointments(prev => prev.map(app => {
        if (app.id === editingApp.id) {
          return {
            ...app,
            client: formClient,
            service: formService,
            proId: Number(formProId),
            pro: proName,
            room: formRoom,
            equipment: formEquip,
            time: formTime,
            status: formStatus
          };
        }
        return app;
      }));
    } else {
      const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
      const newApp = {
        id: newId,
        client: formClient,
        service: formService,
        proId: Number(formProId),
        pro: proName,
        room: formRoom,
        equipment: formEquip,
        time: formTime,
        status: formStatus,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      };
      setAppointments(prev => [...prev, newApp]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    setIsModalOpen(false);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, status: newStatus };
      }
      return app;
    }));
  };

  const handleOpenDrawer = (patientName: string) => {
    // Find patient in patients mock or simulate a comprehensive spa chart profile
    const foundPatient = patients.find(p => p.name.toLowerCase() === patientName.toLowerCase()) || {
      name: patientName,
      phone: "(11) 99999-8888",
      tag: "Tratamento",
      since: "Novo Paciente",
      lastVisit: "Hoje",
      status: "Ativo"
    };

    setSelectedPatientProfile({
      ...foundPatient,
      ticketAverage: "1.420,00",
      totalSpent: "4.800,00",
      activeSessions: 6,
      totalSessions: 10,
      protocol: "Protocolo Renovação Celular & Harmonização",
      financialStatus: "Em Dia",
      history: [
        { date: "13 Jul 2026", desc: "Aplicação de Toxina Botulínica - Dra. Paula Medeiros" },
        { date: "02 Jun 2026", desc: "Sessão 02 Drenagem Corporal - Juliana Alves" },
        { date: "24 Mai 2026", desc: "Avaliação Facial Geral - Dra. Paula Medeiros" }
      ]
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs and actions bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0b0c10] border border-white/5 p-4 rounded-xl shadow-xl gap-4">
        
        {/* Module Subtabs */}
        <div className="bg-[#141722] p-1 rounded-lg border border-white/5 flex gap-1 w-full sm:w-auto">
          <button
            onClick={() => setSubTab("agenda")}
            className={`flex-1 sm:flex-initial text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-md transition-all ${
              subTab === "agenda" ? "bg-purple-600 text-white shadow-md shadow-purple-600/10" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Agenda do Dia
          </button>
          <button
            onClick={() => setSubTab("recepcao")}
            className={`flex-1 sm:flex-initial text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-md transition-all ${
              subTab === "recepcao" ? "bg-purple-600 text-white shadow-md shadow-purple-600/10" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Fila de Recepção
          </button>
        </div>

        {/* View filters / Agenda creation buttons */}
        {subTab === "agenda" && (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="bg-[#141722] p-0.5 rounded-lg border border-white/5 flex text-[9px] font-bold uppercase tracking-wider">
              <button
                onClick={() => setViewMode("pro")}
                className={`px-3 py-1.5 rounded-md ${viewMode === "pro" ? "bg-[#202534] text-white" : "text-zinc-400"}`}
              >
                Por Profissional
              </button>
              <button
                onClick={() => setViewMode("room")}
                className={`px-3 py-1.5 rounded-md ${viewMode === "room" ? "bg-[#202534] text-white" : "text-zinc-400"}`}
              >
                Por Sala
              </button>
            </div>
            <button
              onClick={handleOpenNewModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white text-xs font-bold rounded-lg shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" /> Novo Agendamento
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          VIEW: AGENDA (COLUMNS CALENDAR)
          ───────────────────────────────────────────── */}
      {subTab === "agenda" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {viewMode === "pro" ? (
            // Professional Columns Layout
            PROFESSIONALS.map((emp) => {
              const columnApps = appointments
                .filter(a => a.proId === emp.id)
                .sort((a, b) => a.time.localeCompare(b.time));

              return (
                <div key={emp.id} className="glass-panel rounded-xl overflow-hidden shadow-xl flex flex-col h-[600px]">
                  <div className="p-4 border-b border-white/5 bg-[#10121a] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-xs">
                      {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{emp.name}</p>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{emp.role}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-[#08090d]/30">
                    {columnApps.length > 0 ? (
                      columnApps.map((app) => (
                        <AgendaCard 
                          key={app.id} 
                          app={app} 
                          onEdit={handleOpenEditModal} 
                          onProfile={handleOpenDrawer}
                        />
                      ))
                    ) : (
                      <EmptySlot />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            // Room Columns Layout
            ROOMS.map((room) => {
              const columnApps = appointments
                .filter(a => a.room === room.name)
                .sort((a, b) => a.time.localeCompare(b.time));

              return (
                <div key={room.id} className="glass-panel rounded-xl overflow-hidden shadow-xl flex flex-col h-[600px] xl:col-span-1">
                  <div className="p-4 border-b border-white/5 bg-[#10121a] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{room.name}</p>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Espaço Físico</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-[#08090d]/30">
                    {columnApps.length > 0 ? (
                      columnApps.map((app) => (
                        <AgendaCard 
                          key={app.id} 
                          app={app} 
                          onEdit={handleOpenEditModal} 
                          onProfile={handleOpenDrawer}
                        />
                      ))
                    ) : (
                      <EmptySlot />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          VIEW: RECEPÇÃO (CHECK-IN QUEUE)
          ───────────────────────────────────────────── */}
      {subTab === "recepcao" && (
        <div className="glass-panel rounded-xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/5 bg-[#10121a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Fila de Atendimento do Dia</h3>
              <p className="text-[11px] text-zinc-500 mt-1">Check-in rápido e alteração operacional de status de presença.</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-zinc-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Confirmados: {appointments.filter(a => a.status === 'Confirmado').length}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Em Atendimento: {appointments.filter(a => a.status === 'Em Atendimento').length}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Finalizados: {appointments.filter(a => a.status === 'Concluído').length}</span>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="border-b border-white/5 bg-[#10121a]/55 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <th className="p-4">Horário</th>
                  <th className="p-4">Paciente</th>
                  <th className="p-4">Serviço Agendado</th>
                  <th className="p-4">Profissional / Sala</th>
                  <th className="p-4">Presença / Status</th>
                  <th className="p-4 text-right">Ação Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{app.time}</td>
                    <td className="p-4 flex items-center gap-3">
                      <div 
                        onClick={() => handleOpenDrawer(app.client)}
                        className="font-bold text-white hover:text-purple-400 cursor-pointer underline decoration-purple-600/40"
                      >
                        {app.client}
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300 font-bold">{app.service}</td>
                    <td className="p-4 text-zinc-400">
                      <span className="block font-semibold text-white">{app.pro}</span>
                      <span className="text-[10px] opacity-75">{app.room}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                        app.status === 'Confirmado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        app.status === 'Em Atendimento' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                        app.status === 'Agendado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {app.status === "Confirmado" && (
                        <button
                          onClick={() => handleStatusChange(app.id, "Em Atendimento")}
                          className="px-3.5 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 rounded-md font-bold transition-all"
                        >
                          Iniciar Atendimento
                        </button>
                      )}
                      {app.status === "Em Atendimento" && (
                        <button
                          onClick={() => handleStatusChange(app.id, "Concluído")}
                          className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-md font-bold transition-all"
                        >
                          Finalizar Sessão
                        </button>
                      )}
                      {app.status === "Agendado" && (
                        <button
                          onClick={() => handleStatusChange(app.id, "Confirmado")}
                          className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md font-bold transition-all"
                        >
                          Confirmar Presença
                        </button>
                      )}
                      {app.status === "Concluído" && (
                        <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">✔ Atendido</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          DRAWER: PRONTUÁRIO RÁPIDO
          ───────────────────────────────────────────── */}
      {selectedPatientProfile && (
        <div className="fixed inset-y-0 right-0 w-[450px] bg-[#0b0c10] border-l border-white/10 z-50 shadow-2xl flex flex-col animate-slide-in font-sans">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/5 bg-[#10121a] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm">
                {selectedPatientProfile.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div>
                <h4 className="font-black text-white text-sm">{selectedPatientProfile.name}</h4>
                <p className="text-[10px] text-zinc-500 font-bold">{selectedPatientProfile.phone}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPatientProfile(null)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#141722] border border-white/5 rounded-xl">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Total Comprado</span>
                <span className="text-sm font-black text-white">R$ {selectedPatientProfile.totalSpent}</span>
              </div>
              <div className="p-4 bg-[#14141a] border border-white/5 rounded-xl">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Status Financeiro</span>
                <span className="text-sm font-black text-emerald-400">{selectedPatientProfile.financialStatus}</span>
              </div>
            </div>

            {/* Consumo de Tratamentos */}
            <div className="p-5 bg-gradient-to-br from-purple-950/20 to-[#0e1017] border border-purple-500/10 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-[11px] uppercase tracking-wider">Consumo do Pacote</span>
                <span className="text-[10px] font-bold text-purple-300">
                  {selectedPatientProfile.activeSessions} / {selectedPatientProfile.totalSessions} sessões
                </span>
              </div>
              
              <p className="text-[10px] font-semibold text-zinc-300">{selectedPatientProfile.protocol}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full" 
                  style={{ width: `${(selectedPatientProfile.activeSessions / selectedPatientProfile.totalSessions) * 100}%` }}
                />
              </div>
            </div>

            {/* Timeline do Paciente */}
            <div className="space-y-4">
              <h5 className="font-black text-zinc-500 uppercase tracking-wider text-[10px]">Histórico de Atendimentos</h5>
              <div className="space-y-3">
                {selectedPatientProfile.history.map((hist: any, index: number) => (
                  <div key={index} className="p-3 bg-[#141722] border border-white/5 rounded-lg flex justify-between items-center gap-4">
                    <div>
                      <p className="font-bold text-white">{hist.desc}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{hist.date}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-white/5 bg-[#08090d] flex gap-3">
            <button
              onClick={() => setSelectedPatientProfile(null)}
              className="w-full py-2.5 bg-[#141722] border border-white/5 hover:bg-white/5 text-zinc-300 hover:text-white rounded-lg font-bold transition-all text-xs"
            >
              Fechar Painel
            </button>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────
          MODAL: CRIAÇÃO / EDIÇÃO DE AGENDAMENTO
          ───────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-white/5 w-full max-w-md shadow-2xl flex flex-col rounded-xl overflow-hidden">
            
            <div className="p-5 border-b border-white/5 bg-[#10121a] flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                {editingApp ? "Editar Agendamento" : "Novo Agendamento"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              
              {validationError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Paciente */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Paciente</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Digite o nome da paciente..."
                    value={formClient}
                    onChange={e => setFormClient(e.target.value)}
                    className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                    list="patient-options"
                  />
                  <datalist id="patient-options">
                    {patients.map(p => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Serviço */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Procedimento</label>
                <input
                  type="text"
                  placeholder="Ex: Aplicação Botox, Sessão Drenagem..."
                  value={formService}
                  onChange={e => setFormService(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Profissional */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Profissional Responsável</label>
                <select
                  value={formProId}
                  onChange={e => setFormProId(Number(e.target.value))}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                >
                  {PROFESSIONALS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.role.split(" ")[0]})</option>
                  ))}
                </select>
              </div>

              {/* Sala */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Sala</label>
                <select
                  value={formRoom}
                  onChange={e => setFormRoom(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                >
                  {ROOMS.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Equipamento */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Equipamento Requerido</label>
                <select
                  value={formEquip}
                  onChange={e => setFormEquip(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                >
                  {EQUIPMENT.map(eq => (
                    <option key={eq.id} value={eq.name}>{eq.name}</option>
                  ))}
                </select>
              </div>

              {/* Horário */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Horário</label>
                <select
                  value={formTime}
                  onChange={e => setFormTime(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                >
                  {HOURS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Status do Atendimento</label>
                <select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                >
                  <option value="Agendado">Agendado</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Em Atendimento">Em Atendimento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-between gap-3">
                {editingApp && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingApp.id)}
                    className="px-4 py-2.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 text-rose-400 rounded-lg font-bold transition-all"
                  >
                    Excluir
                  </button>
                )}
                <div className="flex gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-[#141722] border border-white/5 hover:bg-white/5 text-zinc-400 hover:text-white rounded-lg font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-lg transition-all"
                  >
                    Salvar
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────
// COLUMN SUBCOMPONENTS
// ─────────────────────────────────────────────

function AgendaCard({ app, onEdit, onProfile }: { app: any; onEdit: (app: any) => void; onProfile: (name: string) => void }) {
  const borderCol = app.status === 'Confirmado' ? 'border-l-emerald-500' 
                  : app.status === 'Em Atendimento' ? 'border-l-purple-500' 
                  : app.status === 'Agendado' ? 'border-l-blue-500' 
                  : 'border-l-amber-500';

  return (
    <div className={`p-4 bg-[#11131a] border border-white/5 border-l-4 ${borderCol} rounded-xl space-y-3 hover:border-white/10 transition-all flex flex-col justify-between`}>
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-white font-mono">{app.time}</span>
          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
            app.status === 'Confirmado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
            app.status === 'Em Atendimento' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
            app.status === 'Agendado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {app.status}
          </span>
        </div>
        
        <p className="text-xs font-bold text-white">{app.client}</p>
        <p className="text-[10px] text-zinc-400 font-semibold">{app.service}</p>
        
        {app.equipment && app.equipment !== "Nenhum" && (
          <p className="text-[9px] text-purple-300 font-semibold bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10 w-fit">
            🛠 {app.equipment}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-2 text-[10px] font-bold">
        <button 
          onClick={() => onProfile(app.client)}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          Prontuário ➔
        </button>
        <button 
          onClick={() => onEdit(app)}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Editar
        </button>
      </div>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="h-full min-h-[220px] flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl text-center p-6 text-zinc-600 space-y-2">
      <Calendar className="w-5 h-5 opacity-40" />
      <span className="text-[10px] font-black uppercase tracking-wider">Sem atendimentos</span>
    </div>
  );
}
