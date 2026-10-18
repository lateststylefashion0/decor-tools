import React from 'react';

interface ThumbnailProps {
  id: string;
}

export default function CalculatorThumbnail({ id }: ThumbnailProps) {
  switch (id) {
    case 'rug-size':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          <rect x="20" y="25" width="160" height="75" rx="6" fill="#c4b5a2" stroke="#a3927e" strokeWidth="2" />
          <rect x="28" y="32" width="144" height="61" rx="4" fill="#dfd7cb" stroke="#8c7860" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="36" y="38" width="128" height="49" rx="2" fill="#eae4db" />
          {/* Coffee table */}
          <rect x="75" y="52" width="50" height="22" rx="3" fill="#6b4c35" />
          {/* Sofa front legs */}
          <rect x="40" y="10" width="120" height="20" rx="4" fill="#4a5568" />
        </svg>
      );

    case 'curtain-size':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Window frame */}
          <rect x="60" y="20" width="80" height="85" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <line x1="100" y1="20" x2="100" y2="105" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="60" y1="60" x2="140" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Rod */}
          <line x1="40" y1="15" x2="160" y2="15" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          {/* Curtains */}
          <path d="M45 15 C55 40 45 80 50 110 L68 110 C62 80 72 40 68 15 Z" fill="#bfa084" opacity="0.9" />
          <path d="M155 15 C145 40 155 80 150 110 L132 110 C138 80 128 40 132 15 Z" fill="#bfa084" opacity="0.9" />
        </svg>
      );

    case 'wall-art-size':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Wall background */}
          <rect x="10" y="10" width="180" height="100" rx="4" fill="#f8fafc" />
          {/* Frames */}
          <rect x="45" y="22" width="48" height="42" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
          <rect x="107" y="22" width="48" height="42" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
          {/* Abstract artwork art */}
          <circle cx="69" cy="40" r="12" fill="#f59e0b" opacity="0.7" />
          <polygon points="120,55 131,35 142,55" fill="#0d9488" opacity="0.7" />
          {/* Sofa below */}
          <rect x="35" y="80" width="130" height="24" rx="4" fill="#64748b" />
        </svg>
      );

    case 'paint':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Painted swath */}
          <rect x="30" y="20" width="95" height="55" rx="3" fill="#15803d" opacity="0.2" />
          {/* Paint roller */}
          <rect x="75" y="25" width="55" height="18" rx="4" fill="#15803d" />
          {/* Arm and handle */}
          <path d="M102 43 L102 65 L135 65 L135 90" stroke="#78716c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="130" y="85" width="10" height="22" rx="2" fill="#44403c" />
        </svg>
      );

    case 'flooring':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Hardwood planks */}
          <g stroke="#d6c3b0" strokeWidth="1.5">
            <rect x="20" y="20" width="80" height="18" fill="#e8d5be" rx="1" />
            <rect x="100" y="20" width="80" height="18" fill="#dfcca4" rx="1" />
            <rect x="20" y="38" width="55" height="18" fill="#dfcca4" rx="1" />
            <rect x="75" y="38" width="85" height="18" fill="#eedcc6" rx="1" />
            <rect x="160" y="38" width="20" height="18" fill="#dfcca4" rx="1" />
            <rect x="20" y="56" width="95" height="18" fill="#e3ceb0" rx="1" />
            <rect x="115" y="56" width="65" height="18" fill="#e8d5be" rx="1" />
            <rect x="20" y="74" width="60" height="18" fill="#eedcc6" rx="1" />
            <rect x="80" y="74" width="80" height="18" fill="#dfcca4" rx="1" />
          </g>
        </svg>
      );

    case 'tile':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Tile Grid */}
          <g fill="#f8fafc" stroke="#94a3b8" strokeWidth="2">
            <rect x="25" y="20" width="34" height="22" rx="1" />
            <rect x="63" y="20" width="34" height="22" rx="1" />
            <rect x="101" y="20" width="34" height="22" rx="1" />
            <rect x="139" y="20" width="34" height="22" rx="1" />

            <rect x="15" y="46" width="26" height="22" rx="1" />
            <rect x="45" y="46" width="34" height="22" rx="1" />
            <rect x="83" y="46" width="34" height="22" rx="1" />
            <rect x="121" y="46" width="34" height="22" rx="1" />
            <rect x="159" y="46" width="26" height="22" rx="1" />

            <rect x="25" y="72" width="34" height="22" rx="1" />
            <rect x="63" y="72" width="34" height="22" rx="1" />
            <rect x="101" y="72" width="34" height="22" rx="1" />
            <rect x="139" y="72" width="34" height="22" rx="1" />
          </g>
        </svg>
      );

    case 'wallpaper':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Wallpaper roll unrolling */}
          <path d="M40 25 C40 18 65 18 65 25 L65 85 C65 92 40 92 40 85 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          <path d="M65 25 L150 40 L150 95 L65 85 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
          {/* Wallpaper floral botanical pattern */}
          <circle cx="95" cy="55" r="7" fill="#15803d" opacity="0.6" />
          <circle cx="125" cy="65" r="7" fill="#15803d" opacity="0.6" />
          <path d="M95 62 Q105 70 115 62" stroke="#15803d" strokeWidth="1.5" />
        </svg>
      );

    case 'recessed-lighting':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Ceiling line */}
          <line x1="20" y1="30" x2="180" y2="30" stroke="#94a3b8" strokeWidth="3" />
          {/* Light fixture */}
          <ellipse cx="100" cy="30" rx="30" ry="10" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
          <ellipse cx="100" cy="30" rx="16" ry="5" fill="#fef08a" />
          {/* Light cone beam */}
          <polygon points="100,35 40,105 160,105" fill="#fef9c3" opacity="0.5" />
        </svg>
      );

    case 'bathroom-mirror-size':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Mirror frame */}
          <rect x="65" y="15" width="70" height="55" rx="20" fill="#e0f2fe" stroke="#0f172a" strokeWidth="3" />
          <line x1="75" y1="28" x2="88" y2="40" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
          {/* Vanity base & faucet */}
          <rect x="40" y="85" width="120" height="25" rx="3" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
          <path d="M100 85 L100 74 Q100 68 95 68" stroke="#475569" strokeWidth="2.5" fill="none" />
        </svg>
      );

    case 'room-size':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Floorplan */}
          <rect x="35" y="20" width="130" height="75" fill="#f1f5f9" stroke="#0f172a" strokeWidth="2.5" />
          <path d="M35 55 L75 55 L75 95" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="30" y1="12" x2="170" y2="12" stroke="#15803d" strokeWidth="1.5" />
          <polygon points="30,12 36,9 36,15" fill="#15803d" />
          <polygon points="170,12 164,9 164,15" fill="#15803d" />
          <text x="92" y="10" fontSize="10" fill="#15803d" fontWeight="bold">L</text>
        </svg>
      );

    case 'ceiling-fan-size':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Fan center */}
          <line x1="100" y1="15" x2="100" y2="40" stroke="#334155" strokeWidth="3" />
          <circle cx="100" cy="45" r="10" fill="#475569" />
          {/* 4 Blades */}
          <path d="M92 45 L35 32 L40 50 Z" fill="#92400e" opacity="0.9" />
          <path d="M108 45 L165 32 L160 50 Z" fill="#92400e" opacity="0.9" />
          <path d="M100 53 L100 95 L112 90 Z" fill="#92400e" opacity="0.9" />
          <ellipse cx="100" cy="98" rx="60" ry="8" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      );

    case 'chandelier-size':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Chain */}
          <line x1="100" y1="10" x2="100" y2="35" stroke="#b45309" strokeWidth="2" strokeDasharray="3 2" />
          {/* Chandelier body */}
          <path d="M100 35 L60 65 Q100 75 140 65 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
          {/* Candles & drops */}
          <circle cx="70" cy="60" r="3" fill="#f59e0b" />
          <circle cx="100" cy="62" r="3" fill="#f59e0b" />
          <circle cx="130" cy="60" r="3" fill="#f59e0b" />
          <line x1="100" y1="72" x2="100" y2="85" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="100" cy="88" r="4" fill="#fbbf24" />
        </svg>
      );

    case 'tv-size':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* TV outer frame */}
          <rect x="35" y="20" width="130" height="75" rx="4" fill="#09090b" stroke="#27272a" strokeWidth="3" />
          {/* Screen glow */}
          <rect x="39" y="24" width="122" height="67" rx="2" fill="#1e293b" />
          <path d="M42 27 L158 88" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          {/* TV Stand */}
          <rect x="95" y="95" width="10" height="12" fill="#3f3f46" />
          <rect x="75" y="107" width="50" height="4" rx="2" fill="#3f3f46" />
        </svg>
      );

    case 'baseboard':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Floor & Wall */}
          <rect x="20" y="85" width="160" height="25" fill="#e2d4c0" />
          <rect x="20" y="15" width="160" height="70" fill="#f4f4f5" />
          {/* Baseboard molding profile */}
          <rect x="20" y="55" width="160" height="30" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="20" y="55" width="160" height="6" fill="#f1f5f9" />
          <rect x="20" y="80" width="160" height="5" fill="#f8fafc" />
        </svg>
      );

    case 'trim':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Door casing frame */}
          <rect x="45" y="20" width="110" height="90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          {/* Casing trim */}
          <path d="M50 110 L50 25 L150 25 L150 110 L140 110 L140 35 L60 35 L60 110 Z" fill="#ffffff" stroke="#475569" strokeWidth="2" />
          <line x1="50" y1="25" x2="60" y2="35" stroke="#475569" strokeWidth="2" />
          <line x1="150" y1="25" x2="140" y2="35" stroke="#475569" strokeWidth="2" />
        </svg>
      );

    case 'countertop':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Stone slab countertop */}
          <rect x="30" y="35" width="140" height="50" rx="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
          {/* Backsplash */}
          <rect x="30" y="22" width="140" height="13" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Sink cutout */}
          <rect x="75" y="45" width="50" height="30" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          {/* Quartz vein */}
          <path d="M40 40 Q60 55 90 48 T150 65" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.6" />
        </svg>
      );

    case 'drywall':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Drywall stack */}
          <polygon points="50,45 140,25 155,75 65,95" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="45,50 135,30 150,80 60,100" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="40,55 130,35 145,85 55,105" fill="#ffffff" stroke="#64748b" strokeWidth="2" />
        </svg>
      );

    case 'carpet':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Carpet roll */}
          <path d="M35 30 C35 20 60 20 60 30 L60 90 C60 100 35 100 35 90 Z" fill="#d6c7b2" stroke="#8c7a65" strokeWidth="2" />
          <path d="M60 30 L165 45 L165 105 L60 90 Z" fill="#e8dec8" stroke="#8c7a65" strokeWidth="2" />
          <line x1="60" y1="45" x2="165" y2="60" stroke="#c4b59d" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="60" y1="65" x2="165" y2="80" stroke="#c4b59d" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'wall-area':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Isometric room walls */}
          <polygon points="30,25 100,10 100,85 30,100" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
          <polygon points="100,10 170,25 170,100 100,85" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
          {/* Window on right wall */}
          <polygon points="120,40 150,46 150,70 120,64" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
          {/* Door on left wall */}
          <polygon points="50,55 75,50 75,93 50,98" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        </svg>
      );

    case 'square-footage':
    default:
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px]" fill="none">
          {/* Tape measure */}
          <rect x="40" y="35" width="60" height="50" rx="8" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          <circle cx="70" cy="60" r="14" fill="#1c1917" />
          <path d="M100 65 L160 65" stroke="#facc15" strokeWidth="8" strokeLinecap="round" />
          <line x1="115" y1="62" x2="115" y2="68" stroke="#713f12" strokeWidth="1.5" />
          <line x1="130" y1="61" x2="130" y2="69" stroke="#713f12" strokeWidth="1.5" />
          <line x1="145" y1="62" x2="145" y2="68" stroke="#713f12" strokeWidth="1.5" />
        </svg>
      );
  }
}
