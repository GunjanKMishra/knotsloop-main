'use client';

import { useState, useEffect } from 'react';
import { X, Edit, Circle } from 'lucide-react';
import { loops as mockLoops, disciplines as mockDisciplines } from '../lib/mockData';
import CreateLoopModal from './CreateLoopModal';
import CreatePlaylistModal from './CreatePlaylistModal';
import EditSectionModal from './EditSectionModal';

interface Loop {
  id: string;
  title: string;
  thumbnail_url: string | null;
  status: 'draft' | 'published';
  sub_discipline_id: string | null;
  sub_discipline_name: string | null;
  primary_discipline_name: string | null;
  subject_name: string | null;
  playlists: PlaylistInLoop[];
}

interface PlaylistInLoop {
  id: string;
  title: string;
  url: string | null;
  order_index: number;
  primary_discipline_name: string | null;
  sub_discipline_name: string | null;
  specific_topic: string | null;
  hashtags: string[];
}

interface CreatorDashboardProps {
  onClose: () => void;
  onLoopCreated: () => void;
  initialLoopId?: string | null;
}

interface SubDiscipline {
  id: string;
  name: string;
  description?: string;
}

interface PrimaryDiscipline {
  id: string;
  name: string;
}

export default function CreatorDashboard({ onClose, onLoopCreated, initialLoopId }: CreatorDashboardProps) {
  const [loops, setLoops] = useState<Loop[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateLoop, setShowCreateLoop] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showEditSection, setShowEditSection] = useState(false);
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);
  const [selectedLoopSubDisciplineId, setSelectedLoopSubDisciplineId] = useState<string | null>(null);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editingLoopSectionId, setEditingLoopSectionId] = useState<string | null>(null);
  const [allPrimaryDisciplines, setAllPrimaryDisciplines] = useState<PrimaryDiscipline[]>([]);
  const [syncingVideos, setSyncingVideos] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadAllPrimaryDisciplines();
  }, []);

  useEffect(() => {
    if (initialLoopId && loops.length > 0) {
      const loop = loops.find(l => l.id === initialLoopId);
      if (loop) {
        setActiveSection(loop.primary_discipline_name || null);
      }
    }
  }, [initialLoopId, loops]);

  const loadAllPrimaryDisciplines = async () => {
    try {
      const allDisciplines = await mockDisciplines.getAll();
      const primaryDisciplines = allDisciplines.map(d => ({ id: d.id, name: d.name }));
      setAllPrimaryDisciplines(primaryDisciplines);
    } catch (err) {
      console.error('Error loading primary disciplines:', err);
    }
  };

  const syncAllPlaylistVideos = async () => {
    setSyncingVideos(true);
    try {
      // Mock implementation - no actual syncing needed
      setTimeout(() => {
        alert('Successfully synced all playlist videos!');
        setSyncingVideos(false);
      }, 1000);
    } catch (error) {
      console.error('Error syncing videos:', error);
      alert('Failed to sync videos. Please try again.');
      setSyncingVideos(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Mock implementation - load from mock data
      const allLoops = await mockLoops.getAll();
      
      // Transform mock loops to dashboard structure
      const loopsWithPlaylists = allLoops.map((loop: any) => ({
        id: loop.id,
        title: loop.name,
        thumbnail_url: null,
        status: 'draft' as const,
        sub_discipline_id: loop.discipline_id,
        sub_discipline_name: loop.description,
        primary_discipline_name: 'Learning',
        subject_name: loop.name,
        playlists: loop.videos.map((v: any, idx: number) => ({
          id: v.id,
          title: v.title,
          url: v.url,
          order_index: idx,
          primary_discipline_name: 'Learning',
          sub_discipline_name: loop.description,
          specific_topic: v.title,
          hashtags: [],
        }))
      }));

      setLoops(loopsWithPlaylists);
      
      // Extract unique sections from loops
      const uniqueSections = [...new Set(loopsWithPlaylists.map(l => l.primary_discipline_name))];
      setSections(uniqueSections);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlaylist = (loopId: string, subDisciplineId: string | null) => {
    setSelectedLoopId(loopId);
    setSelectedLoopSubDisciplineId(subDisciplineId);
    setEditingPlaylistId(null);
    setShowCreatePlaylist(true);
  };

  const handleCreatePlaylist = (loopId: string, subDisciplineId: string | null) => {
    setSelectedLoopId(loopId);
    setSelectedLoopSubDisciplineId(subDisciplineId);
    setEditingPlaylistId(null);
    setShowCreatePlaylist(true);
  };

  const handleRemovePlaylist = async (loopId: string, playlistId: string) => {
    try {
      // Update local state
      setLoops(loops.map(loop =>
        loop.id === loopId
          ? { ...loop, playlists: loop.playlists.filter(p => p.id !== playlistId) }
          : loop
      ));
      await loadDashboardData();
    } catch (error) {
      console.error('Error removing playlist:', error);
    }
  };

  const handleUpdateLoopSection = async (loopId: string, primaryDisciplineId: string) => {
    try {
      if (!primaryDisciplineId) {
        alert('Please select a section');
        return;
      }

      setEditingLoopSectionId(null);
      await loadDashboardData();
    } catch (error: any) {
      console.error('Error updating loop section:', error);
      alert(`Failed to update section: ${error.message || 'Unknown error'}`);
    }
  };

  const handleLoopTitleChange = async (loopId: string, title: string) => {
    try {
      setLoops(loops.map(loop =>
        loop.id === loopId ? { ...loop, title } : loop
      ));
    } catch (error) {
      console.error('Error updating loop title:', error);
    }
  };

  const handleRemoveLoop = async (loopId: string) => {
    try {
      await mockLoops.delete(loopId);
      await loadDashboardData();
      onLoopCreated();
    } catch (error) {
      console.error('Error removing loop:', error);
    }
  };

  const handleThumbnailUpload = async (loopId: string, file: File) => {
    try {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Mock implementation - simulate thumbnail URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setLoops(loops.map(loop =>
          loop.id === loopId ? { ...loop, thumbnail_url: imageUrl } : loop
        ));
        alert('Thumbnail uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Error uploading thumbnail:', error);
      alert(`Failed to upload thumbnail: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
        <div className="min-h-screen">
          <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
              <span className="text-xl font-bold text-brand-blue tracking-wider">KNOTLOOP</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={syncAllPlaylistVideos}
                  disabled={syncingVideos}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {syncingVideos ? 'Syncing...' : 'Sync Videos'}
                </button>
                <button className="px-8 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium">
                  Need Help?
                </button>
                <button className="px-6 py-2 bg-gray-200 text-slate-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                  Draft
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                >
                  Preview
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto px-8 py-12">
            <h1 className="text-4xl font-bold text-brand-blue text-center mb-12">
              Creator Dashboard
            </h1>

            <div className="flex gap-4 mb-8 justify-center">
              <button className="px-4 py-2 text-sm text-slate-600 hover:text-brand-blue transition-colors">
                Edit Profile
              </button>
              <button className="px-4 py-2 text-sm font-medium text-brand-blue border-b-2 border-brand-blue">
                Edit Section
              </button>
              <button className="px-4 py-2 text-sm text-slate-600 hover:text-brand-blue transition-colors">
                Edit Socials
              </button>
              <button className="px-4 py-2 text-sm text-slate-600 hover:text-brand-blue transition-colors">
                Settings
              </button>
            </div>

            {sections.length > 0 ? (
              <div className="bg-brand-blue bg-opacity-10 rounded-lg p-6 mb-6 border-l-4 border-brand-blue">
                <div className="flex items-center gap-4">
                  <Circle className="w-3 h-3 text-brand-blue fill-brand-blue flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-slate-900">Section</h2>
                        {activeSection && (
                          <span className="text-sm text-slate-600 font-medium">
                            Showing: <span className="text-brand-blue">{activeSection}</span>
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setShowEditSection(true)}
                        className="px-4 py-2 bg-white text-brand-blue border border-brand-blue rounded-lg hover:bg-brand-blue hover:bg-opacity-5 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Sections
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-3 flex-wrap">
                        {sections.map((section, index) => {
                          const loopCount = loops.filter(loop => loop.primary_discipline_name === section).length;
                          return (
                            <button
                              key={index}
                              onClick={() => setActiveSection(activeSection === section ? null : section)}
                              className={`px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all ${
                                activeSection === section
                                  ? 'bg-brand-blue text-white font-semibold'
                                  : 'bg-white text-brand-blue font-medium hover:bg-brand-blue hover:bg-opacity-10'
                              }`}
                            >
                              <span>{section}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                activeSection === section
                                  ? 'bg-white bg-opacity-20 text-white'
                                  : 'bg-brand-blue bg-opacity-10 text-brand-blue'
                              }`}>
                                {loopCount}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-600">
                        Click on a section to filter loops. Click again to show all.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-brand-blue bg-opacity-10 rounded-lg p-6 mb-6 border-l-4 border-brand-blue text-center">
                <p className="text-slate-600 mb-4">No sections added yet</p>
                <button
                  onClick={() => setShowEditSection(true)}
                  className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                  Add Sections
                </button>
              </div>
            )}

            <div className="space-y-6">
              {(() => {
                const filteredLoops = activeSection
                  ? loops.filter(loop => loop.primary_discipline_name === activeSection)
                  : loops;

                if (filteredLoops.length === 0) {
                  return (
                    <div className="bg-brand-blue bg-opacity-10 rounded-lg p-12 text-center border-l-4 border-brand-blue">
                      <p className="text-slate-600 text-lg">
                        {activeSection
                          ? `Nothing to show in ${activeSection} section right now`
                          : 'No loops created yet'}
                      </p>
                      {!activeSection && (
                        <button
                          onClick={() => setShowCreateLoop(true)}
                          className="mt-4 px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                        >
                          Create Your First Loop
                        </button>
                      )}
                    </div>
                  );
                }

                return filteredLoops.map((loop, index) => (
                <div
                  key={loop.id}
                  className="bg-brand-blue bg-opacity-10 rounded-lg p-6 border-l-4 border-brand-blue relative"
                >
                  <button className="absolute top-6 right-6 px-6 py-2 bg-brand-blue bg-opacity-20 text-brand-blue rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium border border-brand-blue border-opacity-30">
                    Draft
                  </button>

                  <div className="flex items-start gap-4">
                    <Circle className="w-3 h-3 text-brand-blue fill-brand-blue flex-shrink-0 mt-2" />

                    <div className="flex-1 pr-24">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Loop-{index + 1}
                      </h3>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Loop Title
                        </label>
                        <input
                          type="text"
                          value={loop.title}
                          onChange={(e) => handleLoopTitleChange(loop.id, e.target.value)}
                          placeholder="e.g., Foundations of Wisdom: Indian & Western Philosophy"
                          className="w-full px-4 py-3 bg-brand-blue bg-opacity-20 rounded-lg border-0 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900 placeholder-slate-500"
                        />
                        <div className="mt-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-slate-600">Section & Sub-discipline:</span>
                            <button
                              onClick={() => setEditingLoopSectionId(editingLoopSectionId === loop.id ? null : loop.id)}
                              className="p-1 text-brand-blue hover:text-opacity-70"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                          {editingLoopSectionId === loop.id ? (
                            <div className="flex gap-2 items-center">
                              <select
                                value={allPrimaryDisciplines.find(pd => pd.name === loop.primary_discipline_name)?.id || ''}
                                onChange={(e) => handleUpdateLoopSection(loop.id, e.target.value)}
                                className="flex-1 px-3 py-2 bg-white rounded-lg border border-brand-blue focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900 font-medium text-sm"
                              >
                                <option value="">Select section...</option>
                                {allPrimaryDisciplines
                                  .filter(discipline => sections.includes(discipline.name))
                                  .map((discipline) => (
                                    <option key={discipline.id} value={discipline.id}>
                                      {discipline.name}
                                    </option>
                                  ))}
                              </select>
                              <button
                                onClick={() => setEditingLoopSectionId(null)}
                                className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {loop.primary_discipline_name && (
                                <span className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded border border-slate-200">
                                  {loop.primary_discipline_name}
                                </span>
                              )}
                              {loop.sub_discipline_name && (
                                <>
                                  <span className="text-slate-400">→</span>
                                  <span className="px-3 py-1 bg-brand-blue bg-opacity-10 text-brand-blue text-xs font-medium rounded-full">
                                    {loop.sub_discipline_name}
                                  </span>
                                </>
                              )}
                              {!loop.primary_discipline_name && (
                                <span className="text-xs text-slate-500 italic">No section set</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Knots in the loop
                        </label>
                        <div className="space-y-2 mb-3">
                          {loop.playlists.map((playlist) => (
                            <div
                              key={playlist.id}
                              className="px-4 py-3 bg-brand-blue bg-opacity-20 rounded-lg"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="flex-1 text-slate-900 font-medium">
                                  {playlist.title || 'Untitled Knot'}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingPlaylistId(playlist.id);
                                    setSelectedLoopId(loop.id);
                                    setSelectedLoopSubDisciplineId(loop.sub_discipline_id);
                                    setShowCreatePlaylist(true);
                                  }}
                                  className="p-1 text-brand-blue hover:text-opacity-70"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRemovePlaylist(loop.id, playlist.id)}
                                  className="p-1 text-brand-blue hover:text-opacity-70"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              {(playlist.sub_discipline_name || playlist.hashtags.length > 0) && (
                                <div className="flex flex-wrap gap-2 items-center">
                                  <span className="text-xs text-slate-600">Tags:</span>
                                  {playlist.sub_discipline_name && (
                                    <span className="px-2 py-1 bg-white text-slate-700 text-xs font-medium rounded border border-slate-200">
                                      {playlist.sub_discipline_name}
                                    </span>
                                  )}
                                  {playlist.hashtags.length > 0 && (
                                    <>
                                      {playlist.sub_discipline_name && <span className="text-slate-400">→</span>}
                                      {playlist.hashtags.map((hashtag) => (
                                        <span key={hashtag} className="px-2 py-1 bg-brand-blue text-white text-xs font-medium rounded">
                                          #{hashtag}
                                        </span>
                                      ))}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAddPlaylist(loop.id, loop.sub_discipline_id)}
                            className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                          >
                            Add Knot
                          </button>
                          <button
                            onClick={() => handleCreatePlaylist(loop.id, loop.sub_discipline_id)}
                            className="px-6 py-2 bg-white text-brand-blue border border-brand-blue rounded-lg hover:bg-brand-blue hover:bg-opacity-5 transition-colors text-sm font-medium"
                          >
                            Create a Knot
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-auto">
                      <div className="w-52 h-36 bg-brand-blue bg-opacity-30 rounded-lg flex items-center justify-center relative overflow-hidden group">
                        {loop.thumbnail_url ? (
                          <img
                            src={loop.thumbnail_url}
                            alt="Loop thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-slate-700">Loop Thumbnail</span>
                        )}
                        <input
                          type="file"
                          id={`thumbnail-${loop.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleThumbnailUpload(loop.id, file);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={() => document.getElementById(`thumbnail-${loop.id}`)?.click()}
                          className="absolute bottom-2 right-2 p-2 bg-brand-blue text-white rounded-full hover:bg-opacity-90 transition-colors shadow-lg"
                          title="Upload thumbnail"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ));
              })()}

              <div className="flex items-center justify-between py-8">
                <button
                  onClick={() => loops.length > 0 && handleRemoveLoop(loops[loops.length - 1].id)}
                  disabled={loops.length === 0}
                  className="px-8 py-2 bg-brand-blue bg-opacity-20 text-brand-blue rounded-lg hover:bg-opacity-30 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove Loop
                </button>

                <div className="flex items-center gap-2">
                  {loops.slice(0, 3).map((loop, index) => (
                    <div key={loop.id} className="flex items-center">
                      <Circle
                        className={`w-4 h-4 ${
                          index === 0
                            ? 'text-brand-blue fill-brand-blue'
                            : 'text-brand-blue'
                        }`}
                      />
                      {index < 2 && (
                        <svg className="w-8 h-4" viewBox="0 0 32 16">
                          <path
                            d="M 0 8 Q 8 0, 16 8 T 32 8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-brand-blue"
                          />
                        </svg>
                      )}
                    </div>
                  ))}
                  {loops.length > 3 && (
                    <>
                      <svg className="w-8 h-4" viewBox="0 0 32 16">
                        <path
                          d="M 0 8 Q 8 0, 16 8 T 32 8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-brand-blue"
                        />
                      </svg>
                      <Circle className="w-4 h-4 text-brand-blue fill-brand-blue" />
                    </>
                  )}
                </div>

                <button
                  onClick={() => setShowCreateLoop(true)}
                  className="px-8 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                  Add Loop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateLoop && (
        <CreateLoopModal
          onClose={() => setShowCreateLoop(false)}
          onSuccess={() => {
            setShowCreateLoop(false);
            loadDashboardData();
            onLoopCreated();
          }}
        />
      )}

      {showCreatePlaylist && selectedLoopId && (
        <CreatePlaylistModal
          loopId={selectedLoopId}
          playlistId={editingPlaylistId}
          loopSubDisciplineId={selectedLoopSubDisciplineId}
          onClose={() => {
            setShowCreatePlaylist(false);
            setSelectedLoopId(null);
            setSelectedLoopSubDisciplineId(null);
            setEditingPlaylistId(null);
          }}
          onSuccess={() => {
            setShowCreatePlaylist(false);
            setSelectedLoopId(null);
            setSelectedLoopSubDisciplineId(null);
            setEditingPlaylistId(null);
            loadDashboardData();
          }}
        />
      )}

      {showEditSection && (
        <EditSectionModal
          onClose={() => setShowEditSection(false)}
          onSuccess={() => {
            setShowEditSection(false);
            loadDashboardData();
          }}
        />
      )}
    </>
  );
}
