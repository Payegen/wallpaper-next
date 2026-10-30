import { CheckCircle2 } from 'lucide-react';

export const TodoWidget = () => (
  <div className="bg-sys-bg-surface/95 backdrop-blur-md border border-sys-border rounded-xl p-4 w-[200px] text-sys-text-base shadow-sys-xl">
    <h3 className="font-semibold mb-2 text-sm border-b border-sys-border pb-1">今日待办</h3>
    <ul className="space-y-2 text-sm">
      <li className="flex gap-2 items-center opacity-80"><CheckCircle2 size={14} className="text-sys-text-success"/> 完成设计图</li>
      <li className="flex gap-2 items-center opacity-80"><div className="w-3.5 h-3.5 border border-sys-border-strong rounded-full"/> 提交代码</li>
      <li className="flex gap-2 items-center opacity-80"><div className="w-3.5 h-3.5 border border-sys-border-strong rounded-full"/> 喝杯咖啡</li>
    </ul>
  </div>
);