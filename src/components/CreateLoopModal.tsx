'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreateLoopModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLoopModal({ onClose, onSuccess }: CreateLoopModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to create a loop');
        return;
      }

      const { data: existingLoops } = await supabase
        .from('loops')
        .select('order_index')
        .eq('creator_profile_id', user.id)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = existingLoops && existingLoops.length > 0
        ? existingLoops[0].order_index + 1
        : 0;

      const { error: insertError } = await supabase
        .from('loops')
        .insert({
          creator_profile_id: user.id,
          title: '',
          status: 'draft',
          order_index: nextOrderIndex,
        });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err) {
      console.error('Error creating loop:', err);
      setError('Failed to create loop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Create New Loop
        </h2>

        <p className="text-slate-600 text-center mb-6">
          A new loop will be added to your dashboard where you can add knots and customize it.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Loop'}
          </button>
        </div>
      </div>
    </div>
  );
}
