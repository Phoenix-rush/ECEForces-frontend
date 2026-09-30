import React from 'react';

const VERDICT_STYLES = {
    AC:    'bg-[#00E887]/10 text-[#00E887] border-[#00E887]/30',
    WA:    'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/30',
    CE:    'bg-[#FFB224]/10 text-[#FFB224] border-[#FFB224]/30',
    TLE:   'bg-[#FFB224]/10 text-[#FFB224] border-[#FFB224]/30',
    RE:    'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/30',
    Error: 'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/30',
};
const DEFAULT_STYLE = 'bg-white/[0.04] text-[#8891A0] border-white/[0.06]';

function VerdictBadge({ verdict, message, size = 'md' }) {
    const style = VERDICT_STYLES[verdict] || DEFAULT_STYLE;
    const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

    return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-bold rounded-lg border ${sizeClass} ${style}`}>
            {verdict}{message ? `: ${message}` : ''}
        </span>
    );
}

export default VerdictBadge;
