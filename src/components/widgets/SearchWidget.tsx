import { Search } from 'lucide-react';

export const SearchWidget = () => (
  <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-3 w-[300px] shadow-xl">
    <Search size={18} className="text-white/60" />
    <input 
      type="text" 
      placeholder="Google 搜索" 
      className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/40"
      onMouseDown={(e) => e.stopPropagation()} // 防止输入时触发拖拽
    />
  </div>
);