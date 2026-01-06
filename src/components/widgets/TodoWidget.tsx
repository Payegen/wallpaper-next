import { CheckCircle2 } from 'lucide-react';

export const TodoWidget = () => (
  <div className="bg-gray-900/60 backdrop-blur-md border border-white/20 rounded-xl p-4 w-[200px] text-white shadow-xl">
    <h3 className="font-semibold mb-2 text-sm border-b border-white/10 pb-1">今日待办</h3>
    <ul className="space-y-2 text-sm">
      <li className="flex gap-2 items-center opacity-80"><CheckCircle2 size={14} className="text-green-400"/> 完成设计图</li>
      <li className="flex gap-2 items-center opacity-80"><div className="w-3.5 h-3.5 border border-white/40 rounded-full"/> 提交代码</li>
      <li className="flex gap-2 items-center opacity-80"><div className="w-3.5 h-3.5 border border-white/40 rounded-full"/> 喝杯咖啡</li>
    </ul>
  </div>
);