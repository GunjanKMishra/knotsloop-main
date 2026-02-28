import { useState, useEffect } from 'react';
import { Play, Square, Sun, Eye, User, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import VideoPlayer from './VideoPlayer';

interface Video {
  id: string;
  title: string;
  url: string;
  video_id: string;
  order_index: number;
  duration?: string;
}

interface Knot {
  id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

interface Loop {
  id: string;
  title: string;
  order_index: number;
  knots: Knot[];
}

interface LoopsPageProps {
  onBack: () => void;
}

export default function LoopsPage({ onBack }: LoopsPageProps) {
  const [loops, setLoops] = useState<Loop[]>([]);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [selectedKnot, setSelectedKnot] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'qna' | 'announcements' | 'reviews'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoops();
  }, []);

  const fetchLoops = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: loopsData, error: loopsError } = await supabase
        .from('loops')
        .select('id, title, order_index')
        .eq('creator_profile_id', user.id)
        .order('order_index');

      if (loopsError) throw loopsError;

      const loopsWithKnots = await Promise.all(
        (loopsData || []).map(async (loop) => {
          const { data: loopPlaylists } = await supabase
            .from('loop_playlists')
            .select('playlist_id, order_index')
            .eq('loop_id', loop.id)
            .order('order_index');

          const knots = await Promise.all(
            (loopPlaylists || []).map(async (lp) => {
              const { data: playlist } = await supabase
                .from('playlists')
                .select('id, title')
                .eq('id', lp.playlist_id)
                .single();

              const { data: videos } = await supabase
                .from('playlist_videos')
                .select('*')
                .eq('playlist_id', lp.playlist_id)
                .order('order_index');

              return {
                id: playlist?.id || '',
                title: playlist?.title || '',
                order_index: lp.order_index,
                videos: videos || [],
              };
            })
          );

          return {
            ...loop,
            knots,
          };
        })
      );

      setLoops(loopsWithKnots);
      if (loopsWithKnots.length > 0) {
        setSelectedLoop(loopsWithKnots[0].id);
        if (loopsWithKnots[0].knots.length > 0) {
          setSelectedKnot(loopsWithKnots[0].knots[0].id);
          if (loopsWithKnots[0].knots[0].videos.length > 0) {
            setSelectedVideo(loopsWithKnots[0].knots[0].videos[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching loops:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentLoop = loops.find(l => l.id === selectedLoop);
  const currentKnot = currentLoop?.knots.find(k => k.id === selectedKnot);

  const calculateProgress = () => {
    if (!currentLoop) return 0;
    const totalVideos = currentLoop.knots.reduce((sum, knot) => sum + knot.videos.length, 0);
    return totalVideos > 0 ? Math.round((3 / totalVideos) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-cyan-500 tracking-wide">KNOTLOOP</h1>
          </div>

          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 text-sm">
              <option>En</option>
            </select>
            <div className="flex gap-2">
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Sun className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={onBack}
              className="p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex flex-col">
            <div className="flex gap-6">
              {loops.length > 0 ? (
                loops.map((loop, idx) => (
                  <button
                    key={loop.id}
                    onClick={() => {
                      setSelectedLoop(loop.id);
                      if (loop.knots.length > 0) {
                        setSelectedKnot(loop.knots[0].id);
                        if (loop.knots[0].videos.length > 0) {
                          setSelectedVideo(loop.knots[0].videos[0]);
                        }
                      }
                    }}
                    className={`py-2.5 px-1 font-semibold border-b-2 transition-colors text-sm ${
                      selectedLoop === loop.id
                        ? 'text-cyan-500 border-cyan-500'
                        : 'text-gray-400 border-transparent hover:text-gray-600'
                    }`}
                  >
                    {loop.title || `Loop ${idx + 1}`}
                  </button>
                ))
              ) : (
                <>
                  <button className="py-2.5 px-1 font-semibold border-b-2 transition-colors text-sm text-cyan-500 border-cyan-500">
                    History of Philosophy
                  </button>
                  <button className="py-2.5 px-1 font-semibold border-b-2 transition-colors text-sm text-gray-400 border-transparent hover:text-gray-600">
                    Ethics & Morality
                  </button>
                  <button className="py-2.5 px-1 font-semibold border-b-2 transition-colors text-sm text-gray-400 border-transparent hover:text-gray-600">
                    Logic & Reasoning
                  </button>
                  <button className="py-2.5 px-1 font-semibold border-b-2 transition-colors text-sm text-gray-400 border-transparent hover:text-gray-600">
                    Metaphysics
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-4 mt-1">
              {currentLoop?.knots.length > 0 ? (
                currentLoop.knots.map((knot, idx) => (
                  <button
                    key={knot.id}
                    onClick={() => {
                      setSelectedKnot(knot.id);
                      if (knot.videos.length > 0) {
                        setSelectedVideo(knot.videos[0]);
                      }
                    }}
                    className={`py-2 px-1 font-medium border-b-2 transition-colors text-xs ${
                      selectedKnot === knot.id
                        ? 'text-gray-900 border-gray-900'
                        : 'text-gray-400 border-transparent hover:text-gray-600'
                    }`}
                  >
                    {knot.title || `Knot ${idx + 1}`}
                  </button>
                ))
              ) : (
                <>
                  <button className="py-2 px-1 font-medium border-b-2 transition-colors text-xs text-gray-900 border-gray-900">
                    Introduction to Philosophy
                  </button>
                  <button className="py-2 px-1 font-medium border-b-2 transition-colors text-xs text-gray-400 border-transparent hover:text-gray-600">
                    Ancient Greek Philosophy
                  </button>
                  <button className="py-2 px-1 font-medium border-b-2 transition-colors text-xs text-gray-400 border-transparent hover:text-gray-600">
                    Medieval Philosophy
                  </button>
                  <button className="py-2 px-1 font-medium border-b-2 transition-colors text-xs text-gray-400 border-transparent hover:text-gray-600">
                    Modern Philosophy
                  </button>
                  <button className="py-2 px-1 font-medium border-b-2 transition-colors text-xs text-gray-400 border-transparent hover:text-gray-600">
                    Contemporary Philosophy
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 bg-cyan-100 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '80vh' }}>
            <div className="p-5 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-cyan-700 uppercase tracking-widest">Progress</span>
                <span className="text-xs font-bold text-cyan-700">{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-cyan-200 rounded-full h-1.5">
                <div
                  className="bg-cyan-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {(currentLoop?.knots && currentLoop.knots.length > 0 ? currentLoop.knots : []).map((knot, knotIdx, allKnots) => {
                const isExpanded = selectedKnot === knot.id;
                const isLastKnot = knotIdx === allKnots.length - 1;

                return (
                  <div key={knot.id} className="relative">
                    <button
                      onClick={() => {
                        if (isExpanded) {
                          setSelectedKnot(null);
                        } else {
                          setSelectedKnot(knot.id);
                          if (knot.videos.length > 0 && !selectedVideo) {
                            setSelectedVideo(knot.videos[0]);
                          }
                        }
                      }}
                      className="w-full flex items-center gap-4 py-3 group"
                    >
                      <div className="relative flex flex-col items-center flex-shrink-0" style={{ width: '24px' }}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                          isExpanded
                            ? 'bg-cyan-500 border-cyan-500'
                            : 'bg-white border-cyan-400 group-hover:border-cyan-500'
                        }`}>
                          {isExpanded && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <span className={`text-sm font-medium text-left leading-snug transition-colors ${
                        isExpanded ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {knot.title}
                      </span>
                    </button>

                    {isExpanded && knot.videos.length > 0 && (
                      <div className="flex gap-4 pb-2">
                        <div className="flex flex-col items-center flex-shrink-0" style={{ width: '24px' }}>
                          <div className="w-px flex-1 bg-cyan-400" />
                        </div>
                        <div className="flex-1 bg-white/70 rounded-xl p-3 mb-2 space-y-1">
                          {knot.videos.map((video) => (
                            <button
                              key={video.id}
                              onClick={() => setSelectedVideo(video)}
                              className={`w-full text-left flex items-start gap-2 px-2 py-2 rounded-lg transition-colors group ${
                                selectedVideo?.id === video.id
                                  ? 'bg-cyan-500/10'
                                  : 'hover:bg-cyan-50'
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 transition-colors ${
                                selectedVideo?.id === video.id ? 'bg-cyan-500' : 'bg-gray-300 group-hover:bg-cyan-300'
                              }`} />
                              <span className={`text-xs leading-relaxed ${
                                selectedVideo?.id === video.id ? 'text-gray-900 font-medium' : 'text-gray-600'
                              }`}>
                                {video.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isLastKnot && (
                      <div className="flex gap-4" style={{ height: isExpanded && knot.videos.length === 0 ? '8px' : '0' }}>
                        <div className="flex flex-col items-center flex-shrink-0" style={{ width: '24px' }}>
                          {!isExpanded && <div className="w-px bg-cyan-400" style={{ height: '16px' }} />}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {(!currentLoop?.knots || currentLoop.knots.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-200 flex items-center justify-center mb-3">
                    <div className="w-4 h-4 rounded-full bg-cyan-400" />
                  </div>
                  <p className="text-sm text-gray-500">No knots yet</p>
                  <p className="text-xs text-gray-400 mt-1">Add playlists to your loop</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-9">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {selectedVideo && <VideoPlayer videoId={selectedVideo.video_id} />}

              <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                  Title 1: {selectedVideo?.title || 'Select a video'}
                </h1>

                <div className="border-b border-gray-200 mb-6">
                  <div className="flex gap-8">
                    {['overview', 'notes', 'qna', 'announcements', 'reviews'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 px-1 font-medium capitalize transition-colors ${
                          activeTab === tab
                            ? 'text-cyan-500 border-b-2 border-cyan-500'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    {activeTab === 'overview' && (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          Are you looking to master Data Science, Machine Learning (ML), Deep Learning (DL)
                          and Natural Language Processing (NLP) from the ground up? This comprehensive course
                          is designed to take you on a journey from understanding the basics to mastering
                          advanced concepts, all while providing practical insights and hands-on experience.
                        </p>
                        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">What You'll Learn:</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li>Foundational Concepts: Start with the basics of ML and NLP, including algorithms,
                          models, and data structures. Understand the core principles that drive machine learning
                          and natural language processing.</li>
                          <li>Advanced Topics: Dive deeper into advanced topics such as deep learning,
                          reinforcement learning, and transformer models. Learn how to apply these concepts to
                          build more complex and powerful models.</li>
                          <li>Practical Applications: Gain practical experience by working on real-world projects
                          and case studies. Apply your knowledge to solve problems in various domains, including
                          healthcare, finance, and e-commerce.</li>
                          <li>Mathematical Foundations: Develop a strong mathematical foundation by learning the
                          math behind ML and NLP algorithms. Understand concepts such as linear algebra, calculus,
                          and probability theory.</li>
                        </ul>
                      </div>
                    )}
                    {activeTab === 'notes' && (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          Are you looking to master Data Science, Machine Learning (ML), Deep Learning (DL)
                          and Natural Language Processing (NLP) from the ground up? This comprehensive course
                          is designed to take you on a journey from understanding the basics to mastering
                          advanced concepts, all while providing practical insights and hands-on experience.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="col-span-1">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
                        <button className="text-cyan-500 hover:text-cyan-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Are you looking to master Data Science, Machine Learning (ML), Deep Learning (DL)
                        and Natural Language Processing (NLP) from the ground up? This comprehensive course
                        is designed to take you on a journey from understanding the basics to mastering
                        advanced concepts, all while providing practical insights and hands-on experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
