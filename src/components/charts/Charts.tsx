type ChartPoint = { v: number; l: string; color?: string };

export function BarChart({
  data,
  color = '#3b82f6',
  h = 200,
}: {
  data: ChartPoint[];
  color?: string;
  h?: number;
}) {
  const W = 540;
  const PL = 38;
  const PB = 28;
  const PR = 10;
  const PT = 12;
  const cW = W - PL - PR;
  const cH = h - PB - PT;
  const max = Math.max(...data.map((d) => d.v), 1);
  const bw = Math.max(6, cW / data.length - 5);
  const gap = cW / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="block h-auto w-full">
      {[0.5, 1.0].map((pct) => {
        const y = PT + cH * (1 - pct);
        return (
          <g key={pct}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f0f4f8" strokeWidth={1} />
            <text x={PL - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#cbd5e1">
              {Math.round(max * pct)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const bH = (d.v / max) * cH;
        const x = PL + i * gap + (gap - bw) / 2;
        const y = PT + cH - bH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={Math.max(PT, y)}
              width={bw}
              height={Math.max(2, bH)}
              fill={d.color || color}
              rx={3}
              opacity={0.9}
            />
            <text x={x + bw / 2} y={h - 6} textAnchor="middle" fontSize={8} fill="#94a3b8">
              {d.l}
            </text>
          </g>
        );
      })}
      <line x1={PL} y1={PT} x2={PL} y2={PT + cH} stroke="#e2e8f0" strokeWidth={1} />
      <line x1={PL} y1={PT + cH} x2={W - PR} y2={PT + cH} stroke="#e2e8f0" strokeWidth={1} />
    </svg>
  );
}

export function LineChart({
  data,
  color = '#3b82f6',
  h = 180,
  yMin = null as number | null,
  yMax = null as number | null,
}: {
  data: ChartPoint[];
  color?: string;
  h?: number;
  yMin?: number | null;
  yMax?: number | null;
}) {
  const W = 540;
  const PL = 38;
  const PB = 28;
  const PR = 10;
  const PT = 12;
  const cW = W - PL - PR;
  const cH = h - PB - PT;
  const vals = data.map((d) => d.v);
  const rmax = Math.max(...vals);
  const rmin = Math.min(...vals);
  const span = Math.max(rmax - rmin, 1);
  const max = yMax !== null ? yMax : rmax + span * 0.15;
  const min = yMin !== null ? yMin : Math.max(0, rmin - span * 0.15);
  const range = max - min || 1;
  const getX = (i: number) =>
    PL + (data.length > 1 ? (i / (data.length - 1)) * cW : cW / 2);
  const getY = (v: number) => PT + cH - ((v - min) / range) * cH;

  const areaPath =
    data.length > 1
      ? [
          'M',
          getX(0),
          PT + cH,
          ...data.flatMap((d, i) => ['L', getX(i), getY(d.v)]),
          'L',
          getX(data.length - 1),
          PT + cH,
          'Z',
        ].join(' ')
      : '';

  const linePoints = data.map((d, i) => `${getX(i)},${getY(d.v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="block h-auto w-full">
      {[0.25, 0.5, 0.75, 1.0].map((pct) => {
        const y = PT + cH * (1 - pct);
        return (
          <g key={pct}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f0f4f8" strokeWidth={1} />
            <text x={PL - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#cbd5e1">
              {Math.round(min + range * pct)}
            </text>
          </g>
        );
      })}
      {data.length > 1 && (
        <>
          <path d={areaPath} fill={color} fillOpacity={0.08} stroke="none" />
          <polyline
            points={linePoints}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={getX(i)} cy={getY(d.v)} r={3.5} fill="white" stroke={color} strokeWidth={2} />
          <text x={getX(i)} y={h - 6} textAnchor="middle" fontSize={8} fill="#94a3b8">
            {d.l}
          </text>
        </g>
      ))}
      <line x1={PL} y1={PT} x2={PL} y2={PT + cH} stroke="#e2e8f0" strokeWidth={1} />
      <line x1={PL} y1={PT + cH} x2={W - PR} y2={PT + cH} stroke="#e2e8f0" strokeWidth={1} />
    </svg>
  );
}
