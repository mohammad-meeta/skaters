import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { ArrowLeft, Video, Upload, Award, Save, Edit2, CheckCircle2, RotateCcw } from 'lucide-react';

export const TrainingScreen: React.FC = () => {
  const { trickId } = useParams<{ trickId: string }>();
  const navigate = useNavigate();
  const { logs, saveLog, tricks } = useApp();
  
  const trick = tricks.find(t => t.id === trickId);
  const currentLog = logs[trickId || ''];

  // Use dynamic maxCones from trick definition, default to 20 if missing
  const maxPossible = trick?.maxCones || 20;
  
  const [cones, setCones] = useState<number>(currentLog?.cones || 0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // Update local state if log changes (e.g. from context)
  useEffect(() => {
    if (currentLog) {
        setCones(currentLog.cones);
    }
  }, [currentLog?.cones]);

  if (!trick) return <div>Trick not found</div>;

  const handleSave = () => {
    setError('');
    
    // Validation
    const isMax = cones === maxPossible;
    // Check if we have a new file OR if there was a previous proof
    const hasProof = file || currentLog?.videoProofUrl;

    if (isMax && !hasProof) {
        setError('برای ثبت رکورد کامل، آپلود ویدیو الزامی است.');
        return;
    }

    let videoStatus = currentLog?.videoProofUrl; 
    
    if (file) {
        videoStatus = `recorded_offline_${Date.now()}`;
    }

    saveLog({
        trickId: trick.id,
        cones: cones,
        maxConesPossible: maxPossible,
        videoProofUrl: videoStatus,
        date: new Date().toISOString(),
        isMastered: cones === maxPossible
    }, trick.level);

    setSuccess(true);
    setTimeout(() => {
        navigate(-1);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
    }
  };

  const isEditing = !!currentLog;
  const hasVideoStored = !!currentLog?.videoProofUrl;

  return (
    <div className="pb-10 pt-4 px-6 max-w-md mx-auto min-h-screen flex flex-col bg-dark">
        <button onClick={() => navigate(-1)} className="self-start p-2 bg-card rounded-full mb-6">
            <ArrowLeft size={24} />
        </button>

        <div className="flex-1 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20">
                <span className="text-3xl font-black text-black">{trick.level}</span>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">{trick.name}</h1>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 mb-8">{trick.category}</span>

            <div className="w-full bg-card p-6 rounded-2xl border border-gray-800 shadow-lg">
                <div className="flex justify-between items-end mb-4">
                    <label className="text-gray-400 text-sm">تعداد مانع‌ها (هدف: {maxPossible})</label>
                    <div className="flex items-center gap-3">
                        {cones > 0 && (
                            <button onClick={() => setCones(0)} className="p-1 rounded-full bg-gray-800 text-gray-500 hover:text-white transition-colors">
                                <RotateCcw size={16} />
                            </button>
                        )}
                        <span className="text-4xl font-bold text-primary">{cones}</span>
                    </div>
                </div>

                <input 
                    type="range" 
                    min="0" 
                    max={maxPossible} 
                    value={cones} 
                    onChange={(e) => setCones(Number(e.target.value))}
                    className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary mb-8"
                />

                <div className="grid grid-cols-5 gap-2 mb-6">
                    {[...Array(maxPossible + 1)].map((_, i) => (
                        <div 
                            key={i} 
                            onClick={() => setCones(i)}
                            className={`h-8 rounded cursor-pointer transition-all flex items-center justify-center text-xs font-bold
                                ${cones === i ? 'bg-primary text-black ring-2 ring-primary ring-offset-2 ring-offset-gray-900' : 
                                  cones > i ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-600'}`}
                        >
                            {i}
                        </div>
                    ))}
                </div>

                {cones === maxPossible && (
                    <div className={`mt-6 p-4 rounded-xl border border-dashed transition-colors ${hasVideoStored || file ? 'bg-green-900/20 border-green-500' : 'bg-gray-900/50 border-gray-600'}`}>
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                            {hasVideoStored || file ? <CheckCircle2 className="text-green-500" size={32} /> : <Upload className="text-accent" size={24} />}
                            <span className="text-sm text-gray-300 text-center">
                                {file 
                                    ? `فایل انتخاب شد: ${file.name}` 
                                    : (hasVideoStored ? 'ویدیو قبلاً تایید شده است' : 'آپلود ویدیو (الزامی)')}
                            </span>
                            <span className="text-[10px] text-gray-500">برای تغییر ضربه بزنید</span>
                            <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 mt-4 text-sm text-center">{error}</p>}
            
            {success && (
                <div className="mt-4 flex items-center gap-2 text-green-400 bg-green-900/30 px-4 py-2 rounded-lg">
                    <Award size={20} />
                    <span>{isEditing ? 'رکورد بروزرسانی شد!' : 'رکورد با موفقیت ثبت شد!'}</span>
                </div>
            )}

            <button 
                onClick={handleSave}
                disabled={success}
                className={`mt-8 w-full py-4 font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50
                    ${isEditing ? 'bg-gray-800 text-white shadow-gray-900/20' : 'bg-primary text-black shadow-primary/20'}`}
            >
                {isEditing ? <Edit2 size={20} /> : <Save size={20} />}
                {isEditing ? 'بروزرسانی رکورد' : 'ثبت تمرین'}
            </button>
        </div>
    </div>
  );
};