import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { CalendarDay, DayData } from '../types';

interface CalendarViewProps {
  onSelectDate: (date: string) => void;
  data: Record<string, DayData>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onSelectDate, data }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('ko-KR', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const calendarGrid = useMemo(() => {
    const days: CalendarDay[] = [];
    
    // Padding for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, dateString: '', hasItems: false, completionRate: 0 });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayData = data[dateString];
      const todos = dayData?.todos || [];
      const total = todos.length;
      const completed = todos.filter(t => t.completed).length;
      
      days.push({
        day: i,
        dateString,
        hasItems: total > 0,
        completionRate: total > 0 ? completed / total : 0
      });
    }

    return days;
  }, [year, month, daysInMonth, firstDayOfMonth, data]);

  const isToday = (dateString: string) => {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return dateString === todayString;
  };

  return (
    <div className="flex flex-col h-full p-6 animate-fade-in">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary tracking-tight">나의 작은 성공</h1>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                <Icons.Calendar className="w-4 h-4 text-muted" />
            </div>
        </div>
      </header>

      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-white/5 text-muted hover:text-white transition-colors">
          <Icons.ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-medium text-white">{monthName}</h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-white/5 text-muted hover:text-white transition-colors">
          <Icons.ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
          <div key={day} className={`text-center text-xs font-medium ${idx === 0 ? 'text-red-400' : 'text-muted'}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarGrid.map((cell, index) => {
          if (cell.day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isCurrentDay = isToday(cell.dateString);
          
          return (
            <button
              key={cell.dateString}
              onClick={() => onSelectDate(cell.dateString)}
              className={`
                relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300
                ${isCurrentDay ? 'bg-white/10 border border-white/20' : 'bg-surface border border-transparent hover:bg-white/5'}
              `}
            >
              <span className={`text-sm font-medium ${isCurrentDay ? 'text-white' : 'text-gray-400'}`}>
                {cell.day}
              </span>
              
              {cell.hasItems && (
                <div className="mt-1 flex gap-0.5">
                   <div 
                     className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${cell.completionRate === 1 ? 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'bg-white/20'}`}
                   />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-muted">날짜를 선택하여 작은 성공을 기록하세요.</p>
      </div>
    </div>
  );
};

export default CalendarView;