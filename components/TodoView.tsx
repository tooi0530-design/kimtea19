import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { TodoItem } from '../types';
import { getSmallSuccessSuggestion } from '../services/gemini';

interface TodoViewProps {
  dateStr: string;
  todos: TodoItem[];
  onBack: () => void;
  onUpdateTodos: (date: string, todos: TodoItem[]) => void;
}

const TodoView: React.FC<TodoViewProps> = ({ dateStr, todos, onBack, onUpdateTodos }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

  const handleAddTodo = (text: string) => {
    if (!text.trim()) return;
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    };
    onUpdateTodos(dateStr, [...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    const newTodos = todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    onUpdateTodos(dateStr, newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter(t => t.id !== id);
    onUpdateTodos(dateStr, newTodos);
  };

  const handleSuggestion = async () => {
    setIsSuggesting(true);
    const suggestion = await getSmallSuccessSuggestion();
    setInputValue(suggestion);
    setIsSuggesting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background animate-slide-up">
      {/* Header */}
      <div className="p-6 pb-2 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-muted hover:text-white hover:bg-white/10 transition-colors"
        >
          <Icons.ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="font-semibold text-lg">{formattedDate}</h2>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Progress */}
      <div className="px-6 py-4">
        <div className="flex justify-between text-xs text-muted mb-2">
            <span>오늘의 작은 성공</span>
            <span>{todos.filter(t => t.completed).length} / {todos.length}</span>
        </div>
        <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
            <div 
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${todos.length > 0 ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0}%` }}
            />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3 no-scrollbar">
        {todos.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-muted/50">
                <Icons.Sparkles className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">아직 기록된 성공이 없어요.</p>
            </div>
        )}
        
        {todos.map((todo) => (
          <div 
            key={todo.id}
            className={`
                group relative flex items-center p-4 rounded-2xl transition-all duration-500 ease-in-out transform
                ${todo.completed 
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]' 
                    : 'bg-surface text-gray-200 border border-white/5 hover:border-white/10'
                }
            `}
          >
            <button 
              onClick={() => toggleTodo(todo.id)}
              className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300
                ${todo.completed 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-500 hover:border-white'
                }
              `}
            >
              {todo.completed && <Icons.Check className="w-3 h-3" strokeWidth={4} />}
            </button>
            
            <span className={`flex-1 font-medium transition-all duration-500 ${todo.completed ? 'line-through opacity-70' : ''}`}>
              {todo.text}
            </span>

            <button 
                onClick={() => deleteTodo(todo.id)}
                className={`
                    p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                    ${todo.completed ? 'text-black/50 hover:bg-black/10' : 'text-white/50 hover:bg-white/10'}
                `}
            >
                <Icons.Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-background sticky bottom-0 z-20">
        <div className="flex gap-2 mb-2 justify-end">
            <button 
                onClick={handleSuggestion}
                disabled={isSuggesting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-white/10 text-xs text-purple-300 hover:bg-white/5 disabled:opacity-50 transition-colors"
            >
                <Icons.Sparkles className={`w-3 h-3 ${isSuggesting ? 'animate-spin' : ''}`} />
                {isSuggesting ? '생각중...' : 'AI 추천받기'}
            </button>
        </div>
        <div className="flex gap-2 items-center bg-surface p-2 pr-2 rounded-full border border-white/10 focus-within:border-white/30 transition-colors shadow-lg shadow-black/50">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="오늘의 작은 성공을 입력하세요..."
            className="flex-1 bg-transparent px-4 py-2 text-white placeholder-gray-500 focus:outline-none text-sm"
          />
          <button 
            onClick={() => handleAddTodo(inputValue)}
            disabled={!inputValue.trim()}
            className="p-2.5 rounded-full bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            <Icons.Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoView;