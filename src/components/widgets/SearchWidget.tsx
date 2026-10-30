import { Search } from 'lucide-react';

export const SearchWidget = () => (
  <div className="bg-sys-bg-surface/95 text-sys-text-base backdrop-blur-md border border-sys-border rounded-full px-4 py-2 flex items-center gap-3 w-[300px] shadow-sys-xl">
    <Search size={18} className="text-sys-text-secondary" />
    <input 
      type="text" 
      placeholder="Google 搜索" 
      className="bg-transparent border-none outline-none text-sys-text-base w-full placeholder:text-sys-text-muted"
      onMouseDown={(e) => e.stopPropagation()} // 防止输入时触发拖拽
    />
  </div>
);