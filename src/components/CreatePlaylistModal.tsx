import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreatePlaylistModalProps {
  loopId: string;
  playlistId?: string | null;
  loopSubDisciplineId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface Discipline {
  id: string;
  name: string;
  description?: string;
}

export default function CreatePlaylistModal({
  loopId,
  playlistId,
  loopSubDisciplineId,
  onClose,
  onSuccess,
}: CreatePlaylistModalProps) {
  const [knotTitle, setKnotTitle] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [subDisciplineId, setSubDisciplineId] = useState('');
  const [specificTopic, setSpecificTopic] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [userHashtags, setUserHashtags] = useState<string[]>([]);
  const [systemHashtags, setSystemHashtags] = useState<string[]>([]);
  const [allSubDisciplines, setAllSubDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(!!playlistId);

  useEffect(() => {
    loadAllSubDisciplines();
    loadUserHashtags();
    if (playlistId) {
      loadPlaylistData();
    } else if (loopSubDisciplineId) {
      setSubDisciplineId(loopSubDisciplineId);
    }
  }, [playlistId, loopSubDisciplineId]);

  useEffect(() => {
    if (subDisciplineId) {
      loadSystemHashtags(subDisciplineId);
    } else {
      setSystemHashtags([]);
    }
  }, [subDisciplineId]);

  const loadAllSubDisciplines = async () => {
    try {
      const { data } = await supabase
        .from('sub_disciplines')
        .select('id, name, description')
        .order('description, name');

      if (data) {
        setAllSubDisciplines(data);
      }
    } catch (err) {
      console.error('Error loading subdisciplines:', err);
    }
  };

  const loadUserHashtags = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userPlaylists } = await supabase
        .from('playlists')
        .select('id')
        .eq('creator_profile_id', user.id);

      if (userPlaylists && userPlaylists.length > 0) {
        const playlistIds = userPlaylists.map(p => p.id);
        const { data: hashtags } = await supabase
          .from('topic_hashtags')
          .select('hashtag')
          .in('playlist_id', playlistIds);

        if (hashtags) {
          const uniqueHashtags = Array.from(new Set(hashtags.map(h => h.hashtag)));
          setUserHashtags(uniqueHashtags);
        }
      }
    } catch (err) {
      console.error('Error loading user hashtags:', err);
    }
  };

  const loadSystemHashtags = async (subDisciplineId: string) => {
    try {
      const { data } = await supabase
        .from('suggested_hashtags')
        .select('hashtag')
        .eq('sub_discipline_id', subDisciplineId)
        .order('usage_count', { ascending: false });

      if (data) {
        setSystemHashtags(data.map(h => h.hashtag));
      }
    } catch (err) {
      console.error('Error loading system hashtags:', err);
    }
  };

  const loadPlaylistData = async () => {
    if (!playlistId) return;

    try {
      const { data: playlistData } = await supabase
        .from('playlists')
        .select('title, youtube_playlist_url, sub_discipline_id, specific_topic')
        .eq('id', playlistId)
        .maybeSingle();

      if (playlistData) {
        setKnotTitle(playlistData.title || '');
        setPlaylistUrl(playlistData.youtube_playlist_url || '');
        setSubDisciplineId(playlistData.sub_discipline_id || '');
        setSpecificTopic(playlistData.specific_topic || '');
      }

      const { data: hashtagData } = await supabase
        .from('topic_hashtags')
        .select('hashtag')
        .eq('playlist_id', playlistId);

      if (hashtagData) {
        setSelectedHashtags(hashtagData.map(h => h.hashtag));
      }
    } catch (err) {
      console.error('Error loading playlist:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const extractPlaylistId = (url: string): string | null => {
    const patterns = [
      /[?&]list=([^&]+)/,
      /youtube\.com\/playlist\?list=([^&]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  const addHashtag = (hashtag: string) => {
    const cleanHashtag = hashtag.trim().replace(/^#/, '').toLowerCase();
    if (cleanHashtag && !selectedHashtags.includes(cleanHashtag)) {
      setSelectedHashtags([...selectedHashtags, cleanHashtag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (hashtag: string) => {
    setSelectedHashtags(selectedHashtags.filter(h => h !== hashtag));
  };

  const handleHashtagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag(hashtagInput);
    }
  };

  const handleSave = async () => {
    setError('');

    if (!knotTitle.trim()) {
      setError('Please enter a name for the knot');
      return;
    }

    if (!playlistUrl.trim()) {
      setError('Please enter a YouTube playlist URL');
      return;
    }

    const extractedPlaylistId = extractPlaylistId(playlistUrl);
    if (!extractedPlaylistId) {
      setError('Please enter a valid YouTube playlist URL');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in');
        return;
      }

      let currentPlaylistId = playlistId;

      // Get primary_discipline_id from selected subdiscipline
      let primaryDisciplineId = null;
      if (subDisciplineId) {
        const { data: subDiscData } = await supabase
          .from('sub_disciplines')
          .select('primary_discipline_id')
          .eq('id', subDisciplineId)
          .maybeSingle();

        primaryDisciplineId = subDiscData?.primary_discipline_id || null;
      }

      if (playlistId) {
        await supabase
          .from('playlists')
          .update({
            title: knotTitle.trim(),
            youtube_playlist_url: playlistUrl,
            youtube_playlist_id: extractedPlaylistId,
            primary_discipline_id: primaryDisciplineId,
            sub_discipline_id: subDisciplineId || null,
            specific_topic: specificTopic || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', playlistId);
      } else {
        const { data: newPlaylist, error: playlistError } = await supabase
          .from('playlists')
          .insert({
            creator_profile_id: user.id,
            title: knotTitle.trim(),
            youtube_playlist_url: playlistUrl,
            youtube_playlist_id: extractedPlaylistId,
            primary_discipline_id: primaryDisciplineId,
            sub_discipline_id: subDisciplineId || null,
            specific_topic: specificTopic || null,
          })
          .select()
          .single();

        if (playlistError) throw playlistError;
        currentPlaylistId = newPlaylist.id;

        const { data: loopPlaylists } = await supabase
          .from('loop_playlists')
          .select('order_index')
          .eq('loop_id', loopId)
          .order('order_index', { ascending: false })
          .limit(1);

        const nextOrderIndex =
          loopPlaylists && loopPlaylists.length > 0
            ? loopPlaylists[0].order_index + 1
            : 0;

        await supabase.from('loop_playlists').insert({
          loop_id: loopId,
          playlist_id: currentPlaylistId,
          order_index: nextOrderIndex,
        });
      }

      // Handle hashtags
      if (currentPlaylistId) {
        // Delete existing hashtags
        await supabase
          .from('topic_hashtags')
          .delete()
          .eq('playlist_id', currentPlaylistId);

        // Insert new hashtags
        if (selectedHashtags.length > 0) {
          const hashtagRecords = selectedHashtags.map(hashtag => ({
            playlist_id: currentPlaylistId,
            hashtag: hashtag,
          }));

          await supabase
            .from('topic_hashtags')
            .insert(hashtagRecords);

          // Update usage count for system hashtags
          for (const hashtag of selectedHashtags) {
            await supabase.rpc('increment_hashtag_usage', { hashtag_name: hashtag });
          }
        }
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving playlist:', err);
      setError('Failed to save playlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-brand-blue bg-opacity-10 rounded-lg shadow-xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-900"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          {playlistId ? 'Edit Knot' : 'Add Knot'}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-slate-900 mb-3 text-center">
              Knot Name
            </label>
            <input
              type="text"
              value={knotTitle}
              onChange={(e) => setKnotTitle(e.target.value)}
              placeholder="e.g., Introduction to Philosophy"
              className="w-full px-4 py-3 bg-brand-blue bg-opacity-30 rounded-lg border-0 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900 placeholder-slate-600 font-medium"
            />
            <p className="mt-3 text-sm text-slate-800 text-center font-medium">
              Give this knot a descriptive name
            </p>
          </div>

          <div>
            <label className="block text-base font-semibold text-slate-900 mb-3 text-center">
              YouTube Playlist URL
            </label>
            <input
              type="text"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
              className="w-full px-4 py-3 bg-brand-blue bg-opacity-30 rounded-lg border-0 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900 placeholder-slate-600 font-medium"
            />
            <p className="mt-3 text-sm text-slate-800 text-center font-medium">
              Paste the URL of your YouTube playlist
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
              Discipline Tags (Optional)
            </h3>
            <p className="text-sm text-slate-600 text-center mb-4">
              {loopSubDisciplineId && !playlistId
                ? 'Pre-filled from loop discipline. You can modify these tags for this knot.'
                : 'Add hierarchical tags to help categorize this knot'}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Sub-discipline
                </label>
                <select
                  value={subDisciplineId}
                  onChange={(e) => setSubDisciplineId(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-blue bg-opacity-30 rounded-lg border-0 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900 font-medium"
                >
                  <option value="">Select discipline...</option>
                  {(() => {
                    const grouped: { [key: string]: Discipline[] } = {};
                    allSubDisciplines.forEach((disc) => {
                      const category = disc.description || 'Other';
                      if (!grouped[category]) {
                        grouped[category] = [];
                      }
                      grouped[category].push(disc);
                    });

                    return Object.entries(grouped).map(([category, disciplines]) => (
                      <optgroup key={category} label={category}>
                        {disciplines.map((discipline) => (
                          <option key={discipline.id} value={discipline.id}>
                            {discipline.name}
                          </option>
                        ))}
                      </optgroup>
                    ));
                  })()}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Topic Hashtags
                </label>

                {selectedHashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedHashtags.map((hashtag) => (
                      <span
                        key={hashtag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-brand-blue text-white rounded-full text-sm font-medium"
                      >
                        #{hashtag}
                        <button
                          onClick={() => removeHashtag(hashtag)}
                          className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={handleHashtagInputKeyDown}
                    placeholder="Add custom hashtag..."
                    className="flex-1 px-4 py-2 bg-brand-blue bg-opacity-30 rounded-lg border-0 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900 placeholder-slate-600 font-medium text-sm"
                  />
                  <button
                    onClick={() => addHashtag(hashtagInput)}
                    className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium text-sm"
                  >
                    Add
                  </button>
                </div>

                {(systemHashtags.length > 0 || userHashtags.length > 0) && (
                  <div className="space-y-3">
                    {systemHashtags.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-600 mb-2 font-semibold">Suggested for this discipline:</p>
                        <div className="flex flex-wrap gap-2">
                          {systemHashtags
                            .filter(h => !selectedHashtags.includes(h))
                            .map((hashtag) => (
                              <button
                                key={hashtag}
                                onClick={() => addHashtag(hashtag)}
                                className="px-3 py-1 bg-brand-blue bg-opacity-20 text-slate-900 rounded-full text-xs font-medium hover:bg-opacity-30 transition-colors"
                              >
                                #{hashtag}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {userHashtags.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-600 mb-2 font-semibold">Your previously used:</p>
                        <div className="flex flex-wrap gap-2">
                          {userHashtags
                            .filter(h => !selectedHashtags.includes(h))
                            .slice(0, 10)
                            .map((hashtag) => (
                              <button
                                key={hashtag}
                                onClick={() => addHashtag(hashtag)}
                                className="px-3 py-1 bg-slate-200 text-slate-900 rounded-full text-xs font-medium hover:bg-slate-300 transition-colors"
                              >
                                #{hashtag}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-2 text-xs text-slate-600">
                  Add hashtags to classify this knot's specific topics
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              onClick={handleSave}
              className="px-16 py-4 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold text-lg disabled:opacity-50 shadow-lg"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
