import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { Level, Category, Trick } from '../types';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Settings } from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const navigate = useNavigate();
  const { tricks, addTrick, updateTrick, deleteTrick } = useApp();
  
  const [isEditing, setIsEditing] = useState<string | null>(null); // Trick ID or 'NEW'
  const [formData, setFormData] = useState<Partial<Trick>>({});
  const [filterLevel, setFilterLevel] = useState<Level | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const resetForm = () => {
      setFormData({});
      setIsEditing(null);
  };

  const handleEdit = (trick: Trick) => {
      setFormData(trick);
      setIsEditing(trick.id);
  };

  const handleNew = () => {
      setFormData({
          id: `custom_${Date.now()}`,
          name: '',
          level: Level.A,
          category: Category.OTHERS,
          maxCones: 20
      });
      setIsEditing('NEW');
  };

  const handleSave = () => {
      if (!formData.name || !formData.maxCones) return;

      if (isEditing === 'NEW') {
          addTrick(formData as Trick);
      } else {
          updateTrick(formData as Trick);
      }
      resetForm();
  };

  const handleDelete = (id: string) => {
      if (window.confirm('آیا از حذف این حرکت اطمینان دارید؟')) {
          deleteTrick(id);
      }
  };

  const filteredTricks = tricks.filter(t => {
      const matchesLevel = filterLevel === 'ALL' || t.level === filterLevel;
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLevel && matchesSearch;
  }).sort((a, b) => a.level.localeCompare(b.level));

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen bg-dark">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-card rounded-full">
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
            <Settings size={20} /> مدیریت حرکات
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-2">
        <input 
            type="text" 
            placeholder="جستجو..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-gray-800 rounded-lg p-3 text-sm"
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button onClick={() => setFilterLevel('ALL')} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${filterLevel === 'ALL' ? 'bg-primary text-black' : 'bg-card border border-gray-800'}`}>همه</button>
            {Object.values(Level).map(l => (
                <button key={l} onClick={() => setFilterLevel(l)} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${filterLevel === l ? 'bg-primary text-black' : 'bg-card border border-gray-800'}`}>{l}</button>
            ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 pb-20">
        <button onClick={handleNew} className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
            <Plus size={20} /> افزودن حرکت جدید
        </button>

        {filteredTricks.map(trick => (
            <div key={trick.id} className="bg-card border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                    <div className="font-bold text-white">{trick.name}</div>
                    <div className="text-xs text-gray-400 mt-1 flex gap-2">
                        <span className="bg-gray-800 px-1.5 rounded">Lvl {trick.level}</span>
                        <span className="bg-gray-800 px-1.5 rounded">{trick.category}</span>
                        <span className="bg-gray-800 px-1.5 rounded text-primary">{trick.maxCones} مانع</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(trick)} className="p-2 bg-blue-900/30 text-blue-400 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(trick.id)} className="p-2 bg-red-900/30 text-red-400 rounded-lg"><Trash2 size={16} /></button>
                </div>
            </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-card w-full max-w-sm rounded-2xl p-6 border border-gray-700 shadow-2xl">
                  <h2 className="text-xl font-bold mb-4">{isEditing === 'NEW' ? 'حرکت جدید' : 'ویرایش حرکت'}</h2>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-gray-400 block mb-1">نام حرکت</label>
                          <input 
                            value={formData.name || ''} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="text-xs text-gray-400 block mb-1">سطح</label>
                              <select 
                                value={formData.level} 
                                onChange={e => setFormData({...formData, level: e.target.value as Level})}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                              >
                                  {Object.values(Level).map(l => <option key={l} value={l}>{l}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="text-xs text-gray-400 block mb-1">دسته</label>
                              <select 
                                value={formData.category} 
                                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm"
                              >
                                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                      </div>

                      <div>
                          <label className="text-xs text-gray-400 block mb-1">حداکثر تعداد مانع</label>
                          <div className="flex items-center gap-4">
                              <input 
                                type="range" min="1" max="50"
                                value={formData.maxCones || 20} 
                                onChange={e => setFormData({...formData, maxCones: Number(e.target.value)})}
                                className="flex-1 accent-primary h-2 bg-gray-700 rounded-lg appearance-none"
                              />
                              <span className="font-bold text-xl w-8 text-center">{formData.maxCones}</span>
                          </div>
                      </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                      <button onClick={resetForm} className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold">انصراف</button>
                      <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-primary text-black font-bold">ذخیره</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};