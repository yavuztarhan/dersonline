'use client';

import React from 'react';
import {
  Dot,
  Minus,
  ArrowRight,
  Compass,
  Maximize2,
  Sparkles,
  Layers,
  Palette,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export type GeometryStationId = 'lines' | 'angle' | 'compass' | 'perpendicular' | 'art';

export interface GeometryStation {
  id: GeometryStationId;
  stationNumber: number;
  title: string;
  badge: string;
  toolFocus: string;
  icon: React.ReactNode;
  color: string;
  activeBg: string;
  borderColor: string;
  summary: string;
}

export const GEOMETRY_STATIONS: GeometryStation[] = [
  {
    id: 'lines',
    stationNumber: 1,
    title: 'Nokta, Çizgeç & Çizgiler',
    badge: 'OB2 • SB1.1',
    toolFocus: '•, [AB], [AB>, d',
    icon: <Minus className="w-4 h-4 stroke-[3]" />,
    color: 'text-teal-700',
    activeBg: 'bg-teal-50 border-teal-500 text-teal-900',
    borderColor: 'border-teal-200',
    summary: 'Boyutsuz nokta, ölçüsüz cetvel (çizgeç), [AB] doğru parçası, [AB> ışını ve sınırsız d doğrusu.'
  },
  {
    id: 'angle',
    stationNumber: 2,
    title: 'Dinamik Açı & Dönme',
    badge: 'SB2.1 • s(B)',
    toolFocus: '∠ABC, Dar, Dik, Geniş',
    icon: <Maximize2 className="w-4 h-4" />,
    color: 'text-blue-700',
    activeBg: 'bg-blue-50 border-blue-500 text-blue-900',
    borderColor: 'border-blue-200',
    summary: 'Bir ışının başlangıç noktası etrafında dönmesiyle oluşan açıklık, köşe ve kollar.'
  },
  {
    id: 'compass',
    stationNumber: 3,
    title: 'Pergel, Çember & Daire',
    badge: 'OB2 • r & R',
    toolFocus: 'Merkez M, Yarıçap r, Çap R',
    icon: <Compass className="w-4 h-4" />,
    color: 'text-purple-700',
    activeBg: 'bg-purple-50 border-purple-500 text-purple-900',
    borderColor: 'border-purple-200',
    summary: 'Sabit noktaya eşit uzaklıktaki noktaların pergel iziyle çemberi ve kilitli pergel ile eş çemberleri oluşturması.'
  },
  {
    id: 'perpendicular',
    stationNumber: 4,
    title: 'Gönye & Dikme (d ⊥ k)',
    badge: 'SB2.3 • En Kısa Yol',
    toolFocus: 'Gönye, Dikme Ayağı H, Düzlem',
    icon: <span className="font-black text-sm">⊥</span>,
    color: 'text-rose-700',
    activeBg: 'bg-rose-50 border-rose-500 text-rose-900',
    borderColor: 'border-rose-200',
    summary: 'Doğruya dışındaki noktadan çizilebilecek en kısa doğru parçasının 90° dikme olduğunu keşfetme.'
  },
  {
    id: 'art',
    stationNumber: 5,
    title: 'Estetik Sanat Panosu',
    badge: 'D7.1 • SDB1.3 & 2.2',
    toolFocus: 'Selçuklu Çinisi, Motif, Logo',
    icon: <Palette className="w-4 h-4" />,
    color: 'text-amber-700',
    activeBg: 'bg-amber-50 border-amber-500 text-amber-900',
    borderColor: 'border-amber-200',
    summary: 'Çizgeç, pergel ve gönye ile estetik tasarımlar yapma, okul panosunda sergileme ve akran değerlendirmesi.'
  }
];

interface GeometryFlowSelectorProps {
  activeStation: GeometryStationId;
  onSelectStation: (stationId: GeometryStationId) => void;
  completedStations?: Record<GeometryStationId, boolean>;
}

export function GeometryFlowSelector({
  activeStation,
  onSelectStation,
  completedStations = {
    lines: true,
    angle: false,
    compass: false,
    perpendicular: false,
    art: false
  }
}: GeometryFlowSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
            Maarif Geometri İstasyonları (MAT.5.3.1)
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          5 Aşamalı Akış
        </span>
      </div>

      {/* Station Cards Slider / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
        {GEOMETRY_STATIONS.map((st) => {
          const isActive = activeStation === st.id;
          const isDone = completedStations[st.id];

          return (
            <button
              key={st.id}
              onClick={() => onSelectStation(st.id)}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                isActive
                  ? `${st.activeBg} shadow-sm ring-1 ring-offset-1`
                  : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                      isActive ? 'bg-white shadow-xs' : 'bg-white/80 border border-slate-200'
                    } ${st.color}`}
                  >
                    {st.icon}
                  </div>
                  <span className="text-[11px] font-black text-slate-400">
                    #{st.stationNumber}
                  </span>
                </div>

                {isDone && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
              </div>

              <div>
                <h4 className="text-xs font-extrabold line-clamp-1 leading-tight mb-0.5 text-slate-900">
                  {st.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span className="font-mono text-[9px] font-bold text-teal-700 bg-teal-50 px-1 rounded">
                    {st.badge}
                  </span>
                  <span className="truncate max-w-[80px]">{st.toolFocus}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
