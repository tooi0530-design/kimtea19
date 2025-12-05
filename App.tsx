import React, { useState, useEffect } from 'react';
import CalendarView from './components/CalendarView';
import TodoView from './components/TodoView';
import { ViewState, DayData, TodoItem } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('CALENDAR');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, DayData>>({});

  // Load data from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('small_success_data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      localStorage.setItem('small_success_data', JSON.stringify(data));
    }
  }, [data]);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setView('TODO_LIST');
  };

  const handleBackToCalendar = () => {
    setView('CALENDAR');
    setSelectedDate(null);
  };

  const handleUpdateTodos = (date: string, todos: TodoItem[]) => {
    setData(prev => ({
      ...prev,
      [date]: {
        date,
        todos
      }
    }));
  };

  // Safe access to todos for the selected date
  const currentTodos = selectedDate && data[selectedDate] ? data[selectedDate].todos : [];

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-white/20 selection:text-white overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Mobile Frame Simulation Container (centered on desktop, full on mobile) */}
      <div className="h-screen flex flex-col relative">
        {view === 'CALENDAR' ? (
          <CalendarView 
            onSelectDate={handleSelectDate} 
            data={data}
          />
        ) : (
          <TodoView 
            dateStr={selectedDate!} 
            todos={currentTodos}
            onBack={handleBackToCalendar}
            onUpdateTodos={handleUpdateTodos}
          />
        )}
      </div>
      
      {/* Style overrides for transitions */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;