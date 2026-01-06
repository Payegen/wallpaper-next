import { CloudSun } from 'lucide-react';

export const WeatherWidget = () => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-[160px] text-white flex flex-col items-center gap-2 shadow-xl">
    <CloudSun size={40} className="text-yellow-300" />
    <div className="text-2xl font-bold">24°C</div>
    <div className="text-xs text-white/60">上海 · 多云</div>
  </div>
);