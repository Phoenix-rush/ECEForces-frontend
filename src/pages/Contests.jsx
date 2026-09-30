import React, { useState, useEffect, useRef } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const CONTESTS = [
  {
    id: 'makerchip-showdown-2026',
    name: 'Makerchip ASIC Design Showdown 2026',
    org: 'Redwood EDA',
    status: 'RESULTS_PENDING',
    category: 'ASIC · RTL',
    theme: '"Eleven Towers" — write Verilog/TL-Verilog circuits that play a strategy game head-to-head',
    closedIST: 'Submissions closed Jul 27, 2026 · 11:00 PM IST',
    prize: 'Cash prizes in USD (Wise / PayPal)',
    url: 'https://www.redwoodeda.com/showdown-info',
    tool: 'Makerchip IDE · browser-based, free, no install',
    description:
      'The second annual Makerchip ASIC Design Showdown. Teams compete head-to-head by writing Verilog or TL-Verilog circuits that play a competitive strategy game — this year\'s challenge: "Eleven Towers". Open worldwide, no EDA license needed. Ideal for ECE students wanting real ASIC design experience without proprietary tools. Results are being tabulated now.',
    tags: ['Verilog', 'TL-Verilog', 'ASIC', 'Open Source', 'Global'],
    featured: true,
  },
  {
    id: 'hdlbits',
    name: 'HDLBits',
    org: '01xz Team',
    status: 'ALWAYS_OPEN',
    category: 'Practice',
    theme: '200+ progressive Verilog problems with instant auto-judging — the LeetCode of HDL',
    closedIST: null,
    prize: 'Free · No prizes — pure skill',
    url: 'https://hdlbits.01xz.net',
    tool: 'Icarus Verilog (ModelSim backend)',
    description:
      'The most widely used Verilog practice platform in the world. Structured from basic gates to full FSMs and timing analysis — each problem is auto-judged against reference waveforms in the browser. Essential before entering any Verilog competition. Covers Verilog Language, Combinational Logic, Sequential Logic, Finite State Machines, Timing Diagrams, and Writing Testbenches.',
    tags: ['Verilog', 'Self-Paced', 'Auto-Judged', 'Industry Standard', 'Interview Prep'],
    featured: false,
  },
  {
    id: 'makerchip-ide',
    name: 'Makerchip IDE',
    org: 'Redwood EDA',
    status: 'ALWAYS_OPEN',
    category: 'Simulator',
    theme: 'Browser-based Verilog & TL-Verilog IDE — waveforms, circuit diagram, instant sim',
    closedIST: null,
    prize: 'Free to use',
    url: 'https://makerchip.com',
    tool: 'Browser-based · Verilog, TL-Verilog, SystemVerilog',
    description:
      'Free browser IDE supporting Verilog and TL-Verilog with real-time waveform viewer (WAVEFORM), circuit diagram visualization (DIAGRAM), and built-in tutorials. The official environment for the Makerchip ASIC Design Showdown. TL-Verilog extends Verilog with cleaner timing abstractions — worth learning. Perfect for quick circuit prototyping when you don\'t have Vivado or ModelSim.',
    tags: ['Verilog', 'TL-Verilog', 'Free', 'No Install', 'Waveform Viewer'],
    featured: false,
  },
  {
    id: 'eda-playground',
    name: 'EDA Playground',
    org: 'EDA Playground Community',
    status: 'ALWAYS_OPEN',
    category: 'Simulator',
    theme: 'Online multi-simulator for Verilog, VHDL, SystemVerilog — shareable links',
    closedIST: null,
    prize: 'Free to use',
    url: 'https://www.edaplayground.com',
    tool: 'Icarus Verilog, ModelSim, Cadence Xcelium, Synopsys VCS, GHDL',
    description:
      'Online IDE with multiple simulator backends — Icarus Verilog, ModelSim, Cadence Xcelium, VCS, and more. Supports Verilog, SystemVerilog, VHDL, and UVM. Create shareable simulation links instantly — great for submitting contest entries, debugging with teammates, or sharing code with professors. A must-know tool for any serious RTL engineer.',
    tags: ['Verilog', 'VHDL', 'SystemVerilog', 'Shareable', 'Multi-Simulator', 'Free'],
    featured: false,
  },
  {
    id: 'hackster-contests',
    name: 'Hackster.io Hardware Contests',
    org: 'Hackster.io',
    status: 'RECURRING',
    category: 'FPGA · Hardware',
    theme: 'Multiple simultaneous FPGA, MCU & SBC design competitions at all times',
    closedIST: 'Multiple active now — check site for current deadlines',
    prize: 'Hardware dev kits + cash prizes (up to $500–$2000 per contest)',
    url: 'https://www.hackster.io/contests',
    tool: 'AMD/Xilinx, Intel FPGA boards (often free to selected applicants)',
    description:
      'The most active hub for FPGA and embedded hardware competitions online. Multiple contests run simultaneously — sponsored by AMD, Intel, Digilent, Seeed Studio, and others. Many provide free development boards to selected teams. Projects range from AI inference on FPGA to robotics and sensor fusion. Winning submissions build an impressive portfolio visible to industry recruiters.',
    tags: ['FPGA', 'AMD Xilinx', 'Intel', 'Free Hardware', 'Portfolio', 'Beginner OK'],
    featured: false,
  },
  {
    id: 'nokia-fpga-hackathon',
    name: 'Nokia FPGA Hackathon',
    org: 'Nokia R&D Kraków',
    status: 'RECURRING',
    category: 'FPGA',
    theme: 'Annual 2-day pro-grade FPGA challenge; 7th edition in 2025 (Moon-themed)',
    closedIST: 'Next edition: ~March 2026 registration · check fpgahackathon.com',
    prize: 'Cash prizes + hardware + networking with Nokia engineers',
    url: 'https://fpgahackathon.com',
    tool: 'FPGA dev boards provided on-site (2-day event, Kraków, Poland)',
    description:
      'One of the most prestigious annual FPGA hackathons in Europe. Run by Nokia\'s telecom R&D engineers. Now in its 7th edition. Entry test required — covers basic electronics and FPGA fundamentals. Challenging real-world telecom-grade problems with tight time limits. International participation. Strong mentorship from professional FPGA engineers working on 4G/5G systems. Entry is competitive.',
    tags: ['FPGA', 'RTL', 'Professional', 'Europe', 'International', 'Annual', '5G'],
    featured: false,
  },
  {
    id: 'bits-pilani-fpga',
    name: 'BITS Pilani FPGA Hackathon',
    org: 'BITS Pilani Hyderabad',
    status: 'RECURRING',
    category: 'FPGA · India',
    theme: 'Edge AI inference on AMD/Xilinx FPGA using Verilog RTL — Indian student contest',
    closedIST: 'Next edition: ~Feb 2027 · 2026 edition completed Apr 10–11, 2026',
    prize: '₹1,50,000 prize pool',
    url: 'https://www.bits-pilani.ac.in/hyderabad/fpgahackathon/',
    tool: 'ZedBoard, Zybo Z7, PYNQ-Z2 (provided at venue)',
    description:
      'Indian academic FPGA hackathon focused on hardware-accelerated Edge AI using Verilog RTL. Two rounds: online RTL design submission + on-site hackathon at BITS Pilani Hyderabad. Open to UG, PG, and PhD students across India. Application domains include Agriculture, Biomedical, Traffic Management, and Smart Energy. Emphasis on Verilog RTL — not HLS. A strong choice for ECE students building their first major FPGA project.',
    tags: ['FPGA', 'RTL', 'India', 'Edge AI', 'Students', 'Verilog', '₹1.5L Prize'],
    featured: false,
  },
  {
    id: 'fccm-rcc',
    name: 'FCCM Reconfigurable Computing Challenge',
    org: 'IEEE · FCCM Symposium',
    status: 'RECURRING',
    category: 'FPGA · Research',
    theme: 'Self-defined FPGA / NPU / AIE projects — any domain, showcase at IEEE',
    closedIST: 'FCCM 2026 closed Apr 1, 2026 · Next: ~Nov 2026 registration for FCCM 2027',
    prize: 'Cash + optional IEEE proceedings publication',
    url: 'https://www.fccm.org/fccm-2026-competition/',
    tool: 'Any FPGA/NPU platform · AMD Vivado preferred',
    description:
      'Annual design competition at the IEEE International Symposium on Field-Programmable Custom Computing Machines. Open to researchers, students, and engineers worldwide. Design any self-defined project that runs on FPGA, AMD AI Engine (AIE), or NPU — any application domain. Finalist teams may publish a 4-page paper in IEEE FCCM proceedings. Direct exposure to AMD engineers and top academics. Best for final-year UG, PG, and PhD students with a research angle.',
    tags: ['FPGA', 'Research', 'IEEE', 'Academic', 'Publication', 'NPU', 'Annual'],
    featured: false,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  RESULTS_PENDING: {
    dot: 'bg-[#FFB224] shadow-[0_0_8px_0_rgba(255,178,36,0.6)]',
    text: 'text-[#FFB224]',
    badge: 'border-[rgba(255,178,36,0.35)] bg-[rgba(255,178,36,0.08)] text-[#FFB224]',
    label: 'Results Pending',
    pulse: true,
  },
  ALWAYS_OPEN: {
    dot: 'bg-[#00E887] shadow-[0_0_8px_0_rgba(0,232,135,0.6)]',
    text: 'text-[#00E887]',
    badge: 'border-[rgba(0,232,135,0.35)] bg-[rgba(0,232,135,0.07)] text-[#00E887]',
    label: 'Always Open',
    pulse: true,
  },
  RECURRING: {
    dot: 'bg-[#5B7FFF]',
    text: 'text-[#5B7FFF]',
    badge: 'border-[rgba(91,127,255,0.35)] bg-[rgba(91,127,255,0.07)] text-[#5B7FFF]',
    label: 'Recurring',
    pulse: false,
  },
};

const CATEGORY_FILTER_OPTIONS = ['All', 'Practice', 'Simulator', 'FPGA · Hardware', 'FPGA', 'FPGA · India', 'FPGA · Research', 'ASIC · RTL'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.RECURRING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  );
}

function CategoryPill({ label }) {
  return (
    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wide border border-white/[0.06] text-[#8891A0] bg-[#141920] rounded-sm">
      {label}
    </span>
  );
}

function Tag({ label }) {
  return (
    <span className="px-2 py-0.5 text-[11px] bg-white/[0.04] border border-white/[0.06] text-[#8891A0] rounded-sm font-mono">
      {label}
    </span>
  );
}

function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

// ─── Oscilloscope Hero Animation ──────────────────────────────────────────────

function OscilloscopeHero() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let t = 0;
    const W = canvas.width;
    const H = canvas.height;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Grid lines (dim)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += W / 8) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += H / 4) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Primary signal — digital square-ish with slight rounding
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0,232,135,0.85)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0,232,135,0.4)';
      ctx.shadowBlur = 8;

      for (let px = 0; px < W; px++) {
        const progress = px / W;
        const phase = progress * Math.PI * 4 + t;
        // Squarish wave via tanh shaping
        const square = Math.tanh(Math.sin(phase) * 4) * 0.4;
        // Secondary wobble
        const noise = Math.sin(phase * 3.1 + t * 0.7) * 0.06;
        const y = H / 2 + (square + noise) * (H * 0.35);
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary dim signal (yellow-amber)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,178,36,0.3)';
      ctx.lineWidth = 1;
      for (let px = 0; px < W; px++) {
        const progress = px / W;
        const phase = progress * Math.PI * 4 + t * 0.8 + 1.2;
        const y = H / 2 + Math.sin(phase) * (H * 0.22);
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();

      // Scanning cursor line
      const cursorX = ((t * 60) % W + W) % W;
      const grad = ctx.createLinearGradient(cursorX - 40, 0, cursorX + 4, 0);
      grad.addColorStop(0, 'rgba(0,232,135,0)');
      grad.addColorStop(1, 'rgba(0,232,135,0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(cursorX - 40, 0, 44, H);

      t += 0.008;
      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={120}
      className="w-full h-full opacity-80"
    />
  );
}

// ─── Contest Card ─────────────────────────────────────────────────────────────

function ContestCard({ contest, index }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[contest.status] || STATUS_CONFIG.RECURRING;

  const delayMs = Math.min(index * 55, 400);

  return (
    <div
      className={`row-enter glass-card transition-all duration-300 ${
        contest.featured ? 'border-[rgba(0,232,135,0.3)] bg-[#0C1015]' : ''
      }`}
      style={{ '--row-delay': `${delayMs}ms` }}
    >
      {/* Featured accent strip */}
      {contest.featured && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00E887]/50 to-transparent" />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <StatusBadge status={contest.status} />
              <CategoryPill label={contest.category} />
              {contest.featured && (
                <span className="px-2 py-0.5 text-[10px] font-semibold border border-[rgba(0,232,135,0.4)] text-[#00E887] bg-[rgba(0,232,135,0.07)] rounded-sm tracking-wide">
                  FEATURED
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#EAEDF0] leading-snug">{contest.name}</h3>
            <p className="text-xs text-[#8891A0] mt-0.5 font-mono">{contest.org}</p>
          </div>

          {/* Visit button */}
          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#00E887]/30 text-[#00E887] bg-[#00E887]/10 hover:bg-[#00E887]/20 rounded-lg transition-colors flex-shrink-0"
          >
            Visit <ExternalIcon />
          </a>
        </div>

        {/* Theme */}
        <p className="text-sm text-[#00E887]/80 mb-3 leading-relaxed">{contest.theme}</p>

        {/* Key info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {contest.closedIST && (
            <div className="flex items-start gap-2">
              <span className="text-white/[0.3] mt-0.5 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="text-xs text-[#8891A0] font-mono leading-relaxed">{contest.closedIST}</span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <span className="text-white/[0.3] mt-0.5 flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-xs text-[#8891A0] font-mono leading-relaxed">{contest.prize}</span>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <span className="text-white/[0.3] mt-0.5 flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </span>
            <span className="text-xs text-[#8891A0] font-mono leading-relaxed">{contest.tool}</span>
          </div>
        </div>

        {/* Expandable description */}
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-0'}`}>
          <p className="text-sm text-[#8891A0] leading-relaxed pb-3 border-t border-white/[0.06] pt-3">
            {contest.description}
          </p>
        </div>

        {/* Tags + toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
          <div className="flex flex-wrap gap-1.5">
            {contest.tags.slice(0, 4).map(t => <Tag key={t} label={t} />)}
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-[#8891A0] hover:text-[#00E887] transition-colors font-mono flex items-center gap-1 flex-shrink-0"
          >
            {expanded ? 'Less' : 'More'}
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Prep Steps ───────────────────────────────────────────────────────────────

const PREP_STEPS = [
  { step: '01', title: 'Master Verilog Basics', detail: 'Complete HDLBits cover-to-cover. It\'s free, browser-based, and covers everything from gates to FSMs. Most contest setters use HDLBits-style difficulty as a benchmark.' },
  { step: '02', title: 'Simulate Without Installing', detail: 'Use EDA Playground or Makerchip IDE to write and test circuits instantly. Get comfortable with Icarus Verilog error messages — you\'ll see them in every contest.' },
  { step: '03', title: 'Learn Testbench Writing', detail: 'Real contests test your module against a hidden testbench. Practice writing your own `$display`-based testbenches — understanding what a judge does to your code is half the battle.' },
  { step: '04', title: 'Build One FPGA Project', detail: 'Apply for free FPGA boards through Hackster.io contests. Implement something on silicon: a 7-segment counter, a UART, or a simple processor. This is what separates interview candidates.' },
  { step: '05', title: 'Enter a Real Contest', detail: 'Start with the Makerchip Showdown (browser-based, low barrier) or Hackster.io hardware contests. The Showdown uses TL-Verilog — spend a day on its tutorials before registering.' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Contests() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? CONTESTS
    : CONTESTS.filter(c => c.category === filter || c.category.includes(filter));

  const featuredContest = CONTESTS.find(c => c.featured);
  const platformCards = filtered.filter(c => !c.featured || filter !== 'All');
  const mainList = filter === 'All' ? CONTESTS.filter(c => !c.featured) : filtered;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div className="mb-10">
          {/* Oscilloscope display */}
          <div className="border border-white/[0.06] bg-[#0C1015] p-1 mb-6 relative overflow-hidden">
            {/* Corner labels */}
            <span className="absolute top-2 left-3 font-mono text-[10px] text-[#8891A0]/50 tracking-widest z-10">CH1 · SIGNAL</span>
            <span className="absolute top-2 right-3 font-mono text-[10px] text-[#FFB224]/50 tracking-widest z-10">CH2 · REF</span>
            <span className="absolute bottom-2 left-3 font-mono text-[10px] text-[#8891A0]/40 z-10">50ms/div · 2V/div</span>
            <span className="absolute bottom-2 right-3 font-mono text-[10px] text-[#00E887]/40 z-10">TRIG: AUTO</span>
            <div className="h-28">
              <OscilloscopeHero />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 bg-[#00E887]" />
                <span className="font-mono text-xs text-[#00E887] tracking-widest uppercase">Global Contests</span>
              </div>
              <h1 className="text-3xl font-bold text-[#EAEDF0] tracking-tight leading-tight">
                Compete. Build.<br />
                <span className="text-[#00E887]">Conquer.</span>
              </h1>
              <p className="text-sm text-[#8891A0] mt-2 max-w-lg leading-relaxed">
                Every real-world HDL/FPGA competition and practice platform — curated for ECE students who want to go beyond theory. All times in <span className="text-[#EAEDF0] font-medium">IST (UTC+5:30)</span>.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-1.5 text-xs font-mono shrink-0">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2 text-[#8891A0]">
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span>{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Featured Contest ──────────────────────────────────────────── */}
        {filter === 'All' && featuredContest && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-xs font-mono text-[#8891A0] tracking-widest uppercase px-2">This Season</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
            <ContestCard contest={featuredContest} index={0} />
          </div>
        )}

        {/* ── Filter Tabs ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Practice', 'Simulator', 'FPGA', 'ASIC · RTL', 'India'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                filter === f || (f === 'FPGA' && filter === 'All' && false)
                  ? 'border-[#00E887]/30 text-[#00E887] bg-[#00E887]/10'
                  : 'border-white/[0.06] text-[#8891A0] hover:text-[#EAEDF0] hover:border-white/[0.12] bg-white/[0.03]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Main Grid ─────────────────────────────────────────────────── */}
        <div className="mb-3">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs font-mono text-[#8891A0] tracking-widest uppercase px-2">
              {filter === 'All' ? 'All Platforms & Contests' : filter}
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {mainList.length === 0 ? (
            <p className="text-center text-[#8891A0] py-12 font-mono text-sm">
              No entries for this filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mainList.map((contest, i) => (
                <ContestCard key={contest.id} contest={contest} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* ── How to Prep ───────────────────────────────────────────────── */}
        {filter === 'All' && (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-xs font-mono text-[#8891A0] tracking-widest uppercase px-2">How to Prep</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="space-y-0 border-l border-white/[0.06] ml-4">
              {PREP_STEPS.map((s, i) => (
                <div
                  key={s.step}
                  className="row-enter pl-6 pb-6 relative"
                  style={{ '--row-delay': `${i * 60}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border border-white/[0.06] bg-[#0C1015] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#00E887]" />
                  </div>

                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-mono text-[10px] text-[#00E887]/60 tracking-widest">{s.step}</span>
                    <h4 className="text-sm font-semibold text-[#EAEDF0]">{s.title}</h4>
                  </div>
                  <p className="text-sm text-[#8891A0] leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer note ───────────────────────────────────────────────── */}
        {filter === 'All' && (
          <div className="mt-10 border border-white/[0.06] glass-card p-4">
            <p className="text-xs text-[#8891A0] leading-relaxed font-mono">
              <span className="text-[#EAEDF0]">Note:</span> Dates, prizes, and registration links may change. Always verify on the official contest site before registering. Deadlines shown above are in IST (UTC+5:30). ECEForces is not affiliated with any of the listed platforms.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
