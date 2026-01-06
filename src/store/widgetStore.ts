import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type WidgetType = 'clock' | 'weather' | 'search' | 'todo';

export interface WidgetItem {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
}

interface WidgetState {
  widgets: WidgetItem[];
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
}

export const useWidgetStore = create<WidgetState>((set) => ({
  // 默认放一个时钟在中间
  widgets: [
    { id: 'default-clock', type: 'clock', x: 0, y: 0 }
  ],
  
  addWidget: (type) => set((state) => ({
    widgets: [
      ...state.widgets,
      // 新增组件默认稍微错开一点位置，防止重叠
      { id: uuidv4(), type, x: Math.random() * 50, y: Math.random() * 50 }
    ]
  })),

  removeWidget: (id) => set((state) => ({
    widgets: state.widgets.filter((w) => w.id !== id)
  })),

  updatePosition: (id, x, y) => set((state) => ({
    widgets: state.widgets.map((w) => 
      w.id === id ? { ...w, x, y } : w
    )
  })),
}));