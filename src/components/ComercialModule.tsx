"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  DollarSign,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  XCircle,
  AlertTriangle,
  Flame,
  PieChart,
  MessageSquare,
  HelpCircle,
  ThumbsDown,
  Sparkles
} from "lucide-react";

const STAGES = [
  { id: "novo", label: "Novo Lead" },
  { id: "contato", label: "Contato" },
  { id: "avaliacao", label: "Avaliação" },
  { id: "proposta", label: "Proposta" },
  { id: "negociacao", label: "Negociação" },
  { id: "ganho", label: "Venda Realizada" },
  { id: "perdido", label: "Perdido" }
];

const CHANNELS = ["Instagram Ads", "Google Search", "TikTok Ads", "Indicação", "Outros"];

const PROFESSIONALS = [
  { id: 1, name: "Dra. Paula Medeiros" },
  { id: 2, name: "Juliana Alves" },
  { id: 3, name: "Dra. Mariana Cruz" }
];

export interface Lead {
  id: number;
  name: string;
  phone: string;
  service: string;
  value: number;
  origin: string;
  stage: string;
  temperature: "Quente" | "Morna" | "Fria";
  proId: number;
  lastInteraction: string;
  nextAction: string;
  lossReason?: string;
}

interface ComercialModuleProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export default function ComercialModule({ leads, setLeads }: ComercialModuleProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemp, setSelectedTemp] = useState<string>("all");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formService, setFormService] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formOrigin, setFormOrigin] = useState("Instagram Ads");
  const [formTemp, setFormTemp] = useState<"Quente" | "Morna" | "Fria">("Morna");
  const [formProId, setFormProId] = useState(1);
  const [formNextAction, setFormNextAction] = useState("");
  const [formLossReason, setFormLossReason] = useState("");
  const [formStage, setFormStage] = useState("novo");
  
  // Validation message
  const [valError, setValError] = useState("");

  const handleOpenNewModal = () => {
    setEditingLead(null);
    setFormName("");
    setFormPhone("");
    setFormService("");
    setFormValue("");
    setFormOrigin("Instagram Ads");
    setFormTemp("Morna");
    setFormProId(1);
    setFormNextAction("Enviar primeira mensagem de boas-vindas");
    setFormLossReason("");
    setFormStage("novo");
    setValError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormName(lead.name);
    setFormPhone(lead.phone);
    setFormService(lead.service);
    setFormValue(String(lead.value));
    setFormOrigin(lead.origin);
    setFormTemp(lead.temperature);
    setFormProId(lead.proId);
    setFormNextAction(lead.nextAction);
    setFormLossReason(lead.lossReason || "");
    setFormStage(lead.stage);
    setValError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setValError("O nome é obrigatório.");
      return;
    }
    if (!formService.trim()) {
      setValError("O procedimento de interesse é obrigatório.");
      return;
    }
    if (isNaN(Number(formValue)) || Number(formValue) <= 0) {
      setValError("Digite um valor válido para a proposta.");
      return;
    }

    if (editingLead) {
      setLeads(prev => prev.map(l => {
        if (l.id === editingLead.id) {
          return {
            ...l,
            name: formName,
            phone: formPhone,
            service: formService,
            value: Number(formValue),
            origin: formOrigin,
            temperature: formTemp,
            proId: Number(formProId),
            nextAction: formNextAction,
            stage: formStage,
            lossReason: formStage === "perdido" ? formLossReason : undefined
          };
        }
        return l;
      }));
    } else {
      const newId = leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1;
      const newLead: Lead = {
        id: newId,
        name: formName,
        phone: formPhone,
        service: formService,
        value: Number(formValue),
        origin: formOrigin,
        stage: "novo",
        temperature: formTemp,
        proId: Number(formProId),
        lastInteraction: "Hoje",
        nextAction: formNextAction
      };
      setLeads(prev => [...prev, newLead]);
    }

    setIsModalOpen(false);
  };

  const handleMoveStage = (leadId: number, direction: "next" | "prev") => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const currentIdx = STAGES.findIndex(s => s.id === l.stage);
        let nextIdx = currentIdx;
        if (direction === "next" && currentIdx < STAGES.length - 1) {
          nextIdx = currentIdx + 1;
        } else if (direction === "prev" && currentIdx > 0) {
          nextIdx = currentIdx - 1;
        }
        
        // If moving to 'perdido', we prompt reason in edit modal instead, 
        // but default here is moving normally.
        return {
          ...l,
          stage: STAGES[nextIdx].id
        };
      }
      return l;
    }));
  };

  const handleDelete = (id: number) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    setIsModalOpen(false);
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            l.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTemp = selectedTemp === "all" || l.temperature === selectedTemp;
      return matchesSearch && matchesTemp;
    });
  }, [leads, searchQuery, selectedTemp]);

  // Stage values summaries
  const stageSums = useMemo(() => {
    const sums: { [key: string]: { value: number; count: number } } = {};
    STAGES.forEach(s => {
      sums[s.id] = { value: 0, count: 0 };
    });
    filteredLeads.forEach(l => {
      if (sums[l.stage]) {
        sums[l.stage].value += l.value;
        sums[l.stage].count += 1;
      }
    });
    return sums;
  }, [filteredLeads]);

  // Conversion statistics by origin
  const originStats = useMemo(() => {
    const stats: { [key: string]: { total: number; closed: number } } = {};
    CHANNELS.forEach(c => {
      stats[c] = { total: 0, closed: 0 };
    });
    leads.forEach(l => {
      if (stats[l.origin]) {
        stats[l.origin].total += 1;
        if (l.stage === "ganho") {
          stats[l.origin].closed += 1;
        }
      }
    });
    return stats;
  }, [leads]);

  return (
    <div className="space-y-6">

      {/* Filter and Top Panel */}
      <div className="flex flex-col xl:flex-row justify-between items-center bg-[#0b0c10] border border-white/5 p-4 rounded-xl shadow-xl gap-4">
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por lead ou procedimento..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg pl-9 pr-4 py-2 text-xs text-white"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          </div>

          <div className="relative w-full sm:w-44">
            <select
              value={selectedTemp}
              onChange={e => setSelectedTemp(e.target.value)}
              className="w-full bg-[#141722] text-xs border border-white/5 px-3 py-2 focus:outline-none rounded-lg appearance-none pr-8 cursor-pointer"
            >
              <option value="all">Todas as Temperaturas</option>
              <option value="Quente">Quente 🔥</option>
              <option value="Morna">Morna ⚡</option>
              <option value="Fria">Fria ❄</option>
            </select>
            <Filter className="w-3 h-3 text-zinc-500 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Create Lead Button */}
        <div className="w-full xl:w-auto flex justify-end">
          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white text-xs font-bold rounded-lg shadow-lg"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Lead
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          KANBAN BOARD PIPELINE
          ───────────────────────────────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
        {STAGES.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
          const colSum = stageSums[stage.id]?.value || 0;
          const colCount = stageSums[stage.id]?.count || 0;

          return (
            <div key={stage.id} className="w-[280px] shrink-0 bg-[#0b0c10]/70 border border-white/5 rounded-xl flex flex-col h-[580px] shadow-xl">
              
              {/* Column Header */}
              <div className="p-4 border-b border-white/5 bg-[#10121a] flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">{stage.label}</h4>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase mt-1.5 block">
                    {colCount} {colCount === 1 ? "lead" : "leads"}
                  </span>
                </div>
                <span className="text-[10px] font-black text-purple-400 font-mono">
                  R$ {colSum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Column List area */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1 bg-[#08090d]/10">
                {stageLeads.length > 0 ? (
                  stageLeads.map(lead => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onEdit={handleOpenEditModal}
                      onMove={handleMoveStage}
                    />
                  ))
                ) : (
                  <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-center p-4 text-zinc-700 space-y-1.5">
                    <TrendingUp className="w-4 h-4 opacity-30" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Vazio</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────
          CONVERSION METRICS BLOCK
          ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Origin Conversion Rate */}
        <div className="glass-panel rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <PieChart className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Origem dos Leads e Fechamento</h4>
          </div>

          <div className="space-y-4">
            {CHANNELS.map(ch => {
              const chTotal = originStats[ch]?.total || 0;
              const chClosed = originStats[ch]?.closed || 0;
              const rate = chTotal > 0 ? Math.round((chClosed / chTotal) * 100) : 0;

              return (
                <div key={ch} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-zinc-300">{ch}</span>
                    <span className="text-white">
                      {chClosed} ganhos / {chTotal} total ({rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full transition-all" 
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CRM Quick Guide */}
        <div className="glass-panel rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">IA Insights Comerciais</h4>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
              <p>
                💡 **Leads do Instagram Ads** estão com taxa de resposta rápida elevada, mas a conversão em avaliações realizadas decaiu 5% esta semana. Recomenda-se iniciar automação de lembrete 2 horas antes da avaliação marcada.
              </p>
              <p>
                🔥 **Foco Comercial:** Há **3 leads quentes** parados na etapa de *Negociação*. Envie uma proposta com incentivo ou agende uma chamada rápida para fechamento.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest text-right">
            atualizado em tempo real
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────
          MODAL: CADASTRAR / EDITAR LEAD
          ───────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-white/5 w-full max-w-md shadow-2xl flex flex-col rounded-xl overflow-hidden">
            
            <div className="p-5 border-b border-white/5 bg-[#10121a] flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                {editingLead ? "Detalhes do Lead" : "Novo Lead Comercial"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              
              {valError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{valError}</span>
                </div>
              )}

              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Nome do lead..."
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Procedimento */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Procedimento de Interesse</label>
                <input
                  type="text"
                  placeholder="Ex: Harmonização Mandibular"
                  value={formService}
                  onChange={e => setFormService(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Valor Oportunidade */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Valor Estimado (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 1500"
                  value={formValue}
                  onChange={e => setFormValue(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Origem */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Origem do Lead</label>
                <select
                  value={formOrigin}
                  onChange={e => setFormOrigin(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                >
                  {CHANNELS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Temperatura */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Temperatura (Engajamento)</label>
                <select
                  value={formTemp}
                  onChange={e => setFormTemp(e.target.value as any)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                >
                  <option value="Quente">Quente 🔥</option>
                  <option value="Morna">Morna ⚡</option>
                  <option value="Fria">Fria ❄</option>
                </select>
              </div>

              {/* Responsável */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Profissional Responsável</label>
                <select
                  value={formProId}
                  onChange={e => setFormProId(Number(e.target.value))}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                >
                  {PROFESSIONALS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Etapa (Only in editing mode) */}
              {editingLead && (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Etapa do Funil</label>
                  <select
                    value={formStage}
                    onChange={e => setFormStage(e.target.value)}
                    className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Motivo de perda (Only if stage is 'perdido') */}
              {formStage === "perdido" && (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest block">Motivo da Perda do Lead</label>
                  <input
                    type="text"
                    placeholder="Ex: Preço elevado, sem resposta..."
                    value={formLossReason}
                    onChange={e => setFormLossReason(e.target.value)}
                    className="w-full bg-[#141722] border border-rose-500/20 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                  />
                </div>
              )}

              {/* Ação recomendada */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Próxima Ação Agendada</label>
                <input
                  type="text"
                  placeholder="Ex: Enviar proposta de orçamento"
                  value={formNextAction}
                  onChange={e => setFormNextAction(e.target.value)}
                  className="w-full bg-[#141722] border border-white/5 focus:border-white/10 focus:outline-none rounded-lg px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-between gap-3">
                {editingLead && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingLead.id)}
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
// CARD SUBCOMPONENT
// ─────────────────────────────────────────────

function LeadCard({ lead, onEdit, onMove }: { lead: Lead; onEdit: (lead: Lead) => void; onMove: (id: number, dir: "next" | "prev") => void }) {
  const currentStageIdx = STAGES.findIndex(s => s.id === lead.stage);

  const tempColor = lead.temperature === "Quente" ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : lead.temperature === "Morna" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20";

  return (
    <div className="p-4 bg-[#11131a] border border-white/5 hover:border-white/10 rounded-xl space-y-3 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
      
      {/* Temperature and Origin header */}
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{lead.origin}</span>
        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${tempColor}`}>
          <Flame className="w-2 h-2 shrink-0" />
          {lead.temperature}
        </span>
      </div>

      {/* Main Info */}
      <div className="space-y-1">
        <p className="text-xs font-bold text-white hover:text-purple-400 transition-colors cursor-pointer" onClick={() => onEdit(lead)}>
          {lead.name}
        </p>
        <p className="text-[10px] text-zinc-400 font-semibold">{lead.service}</p>
        
        {lead.lossReason && (
          <p className="text-[9px] text-rose-400 font-semibold bg-rose-500/5 px-2 py-1 rounded border border-rose-500/10 mt-1 leading-normal">
            Motivo da perda: "{lead.lossReason}"
          </p>
        )}
      </div>

      {/* Value */}
      <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-2 text-[10px] font-black">
        <span className="text-white font-mono">
          R$ {lead.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
        
        {/* Stage manipulation controls */}
        <div className="flex items-center gap-1">
          {currentStageIdx > 0 && (
            <button 
              onClick={() => onMove(lead.id, "prev")}
              className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded transition-colors"
              title="Mover para coluna anterior"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}
          {currentStageIdx < STAGES.length - 1 && (
            <button 
              onClick={() => onMove(lead.id, "next")}
              className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded transition-colors"
              title="Mover para próxima coluna"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          
          <button 
            onClick={() => onEdit(lead)}
            className="p-1 bg-purple-950/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 rounded transition-all ml-1"
            title="Mais detalhes"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
