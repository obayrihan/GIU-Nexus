import { useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../services/api';

const SaveJobButton = ({ jobId, isInitiallySaved = false, onToggle }) => {
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/jobs/${jobId}/save`);
      setIsSaved(res.data.saved);
      if (onToggle) onToggle(res.data.saved, jobId);
    } catch (error) {
      console.error('Failed to save job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-all"
    >
      <Heart 
        className={`w-5 h-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : ''}`} 
      />
      <span className="text-sm font-medium">
        {isSaved ? 'Saved' : 'Save'}
      </span>
    </button>
  );
};

export default SaveJobButton;
