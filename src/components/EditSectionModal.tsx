import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PrimaryDiscipline {
  id: string;
  name: string;
  major_branch_id: string;
}

interface CreatorDiscipline {
  id: string;
  primary_discipline_id: string;
  display_order: number;
  is_platform_assigned: boolean;
  primary_disciplines: {
    name: string;
  };
}

interface EditSectionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditSectionModal({ onClose, onSuccess }: EditSectionModalProps) {
  const [allDisciplines, setAllDisciplines] = useState<PrimaryDiscipline[]>([]);
  const [creatorDisciplines, setCreatorDisciplines] = useState<CreatorDiscipline[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [disciplinesResult, creatorDisciplinesResult] = await Promise.all([
        supabase.from('primary_disciplines').select('*').order('name'),
        supabase
          .from('creator_disciplines')
          .select(`
            id,
            primary_discipline_id,
            display_order,
            is_platform_assigned,
            primary_disciplines (
              name
            )
          `)
          .eq('creator_id', user.id)
          .order('display_order'),
      ]);

      if (disciplinesResult.data) setAllDisciplines(disciplinesResult.data);
      if (creatorDisciplinesResult.data) {
        setCreatorDisciplines(creatorDisciplinesResult.data as any);
        setSelectedIds(creatorDisciplinesResult.data.map((d: any) => d.primary_discipline_id));
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load disciplines');
    } finally {
      setLoading(false);
    }
  };

  const toggleDiscipline = (disciplineId: string) => {
    setSelectedIds(prev =>
      prev.includes(disciplineId)
        ? prev.filter(id => id !== disciplineId)
        : [...prev, disciplineId]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await supabase
        .from('creator_disciplines')
        .delete()
        .eq('creator_id', user.id);

      if (selectedIds.length > 0) {
        const records = selectedIds.map((disciplineId, index) => ({
          creator_id: user.id,
          primary_discipline_id: disciplineId,
          is_platform_assigned: false,
          display_order: index,
        }));

        const { error: insertError } = await supabase
          .from('creator_disciplines')
          .insert(records);

        if (insertError) throw insertError;
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving disciplines:', err);
      setError(err instanceof Error ? err.message : 'Failed to save sections');
    } finally {
      setSaving(false);
    }
  };

  const filteredDisciplines = allDisciplines.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-brand-blue">Edit Sections</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-slate-600">Loading...</div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-slate-600 mb-4">
                  Select the disciplines that best represent your content. These sections will be
                  displayed on your profile and help students find your courses.
                </p>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search disciplines..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">
                  Selected: {selectedIds.length}
                </h3>
                <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                  {filteredDisciplines.map(discipline => (
                    <button
                      key={discipline.id}
                      onClick={() => toggleDiscipline(discipline.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedIds.includes(discipline.id)
                          ? 'bg-brand-blue text-white'
                          : 'bg-white border border-gray-300 text-slate-600 hover:bg-gray-100'
                      }`}
                    >
                      {discipline.name}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-slate-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
