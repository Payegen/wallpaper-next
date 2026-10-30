import { CloudSun } from 'lucide-react';

export const WeatherWidget = () => (
  <div className="bg-sys-bg-surface/95 backdrop-blur-md border border-sys-border rounded-2xl p-4 w-[160px] text-sys-text-base flex flex-col items-center gap-2 shadow-sys-xl">
    <CloudSun size={40} className="text-sys-text-warning" />
    <div className="text-2xl font-bold">24°C</div>
    <div className="text-xs text-sys-text-secondary">上海 · 多云</div>
  </div>
);