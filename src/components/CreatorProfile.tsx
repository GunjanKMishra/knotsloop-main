'use client';

import { useEffect, useState } from 'react';
import { LogOut, Settings, Users, Video, BookOpen, Edit2, ExternalLink, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CreatorDashboard from './CreatorDashboard';
import ChannelSettingsModal from './ChannelSettingsModal';
import LoopsPage from './LoopsPage';

interface CreatorProfileProps {
  onLogout: () => void;
}

interface ProfileData {
  name: string;
  headline: string;
  email: string;
  subdomain: string;
  biography: string;
  website: string;
  linkedin: string;
}

interface ChannelData {
  channel_name: string;
  channel_url: string;
  channel_description: string;
}

interface LoopData {
  id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function CreatorProfile({ onLogout }: CreatorProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loopCount, setLoopCount] = useState(0);
  const [loops, setLoops] = useState<LoopData[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingLoopId, setEditingLoopId] = useState<string | null>(null);
  const [showLoopsPage, setShowLoopsPage] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        onLogout();
        return;
      }

      const { data: profileData } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const { data: channelData } = await supabase
        .from('creator_channels')
        .select('*')
        .eq('creator_id', user.id)
        .maybeSingle();

      const { data: loopsData, count } = await supabase
        .from('loops')
        .select('id, title, status, created_at, updated_at')
        .eq('creator_profile_id', user.id)
        .order('updated_at', { ascending: false });

      setLoopCount(count || 0);
      setLoops(loopsData || []);

      if (profileData) {
        setProfile({
          name: profileData.name || '',
          headline: profileData.headline || '',
          email: user.email || '',
          subdomain: profileData.subdomain || '',
          biography: profileData.biography || '',
          website: profileData.website || '',
          linkedin: profileData.linkedin || '',
        });
      }

      if (channelData) {
        setChannel({
          channel_name: channelData.channel_name || '',
          channel_url: channelData.channel_url || '',
          channel_description: channelData.channel_description || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-brand-blue text-xl">Loading...</div>
      </div>
    );
  }

  if (showLoopsPage) {
    return <LoopsPage onBack={() => setShowLoopsPage(false)} />;
  }

  if (showDashboard || editingLoopId) {
    return (
      <CreatorDashboard
        onClose={() => {
          setShowDashboard(false);
          setEditingLoopId(null);
        }}
        onLoopCreated={() => {
          loadProfile();
          setEditingLoopId(null);
        }}
        initialLoopId={editingLoopId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-blue tracking-wider">KNOTLOOP</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-slate-600 hover:text-brand-blue transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-brand-blue transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-brand-blue flex items-center justify-center text-white text-3xl font-bold">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {profile?.name || 'Creator'}
                </h1>
                <p className="text-lg text-slate-600 mb-3">{profile?.headline}</p>
                <p className="text-slate-500">{profile?.email}</p>
                {profile?.subdomain && (
                  <a
                    href={`https://${profile.subdomain}.knotloop.com`}
                    className="text-brand-blue hover:underline mt-2 inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.subdomain}.knotloop.com
                  </a>
                )}
              </div>
            </div>
          </div>

          {profile?.biography && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Biography</h3>
              <p className="text-slate-600">{profile.biography}</p>
            </div>
          )}

          <div className="flex gap-4">
            {profile?.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue hover:underline text-sm"
              >
                Website
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue hover:underline text-sm"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {channel && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Video className="w-6 h-6 text-brand-blue" />
              Channel Information
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-slate-600 font-medium">Channel Name:</span>
                <span className="ml-2 text-slate-900">{channel.channel_name}</span>
              </div>
              <div>
                <span className="text-slate-600 font-medium">Channel URL:</span>
                <a
                  href={channel.channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-brand-blue hover:underline"
                >
                  {channel.channel_url}
                </a>
              </div>
              {channel.channel_description && (
                <div>
                  <span className="text-slate-600 font-medium">Description:</span>
                  <p className="mt-1 text-slate-900">{channel.channel_description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <BookOpen className="w-12 h-12 text-brand-blue mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{loopCount}</h3>
            <p className="text-slate-600">Loops Created</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Users className="w-12 h-12 text-brand-blue mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">0</h3>
            <p className="text-slate-600">Students</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Video className="w-12 h-12 text-brand-blue mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">0</h3>
            <p className="text-slate-600">Videos</p>
          </div>
        </div>

        {loops.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-brand-blue" />
              Your Loops
            </h2>
            <div className="space-y-3">
              {loops.map((loop) => (
                <div
                  key={loop.id}
                  onClick={() => setShowLoopsPage(true)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {loop.title || 'Untitled Loop'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        loop.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-slate-700'
                      }`}>
                        {loop.status}
                      </span>
                      <span>
                        Updated: {new Date(loop.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLoopId(loop.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    {profile?.subdomain && (
                      <a
                        href={`https://${profile.subdomain}.knotloop.com/loop/${loop.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-slate-600 hover:text-brand-blue transition-colors"
                        title="View Loop"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setShowDashboard(true)}
            className="px-8 py-3 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
          >
            {loopCount === 0 ? 'Create Your First Loop' : 'Create Next Loop'}
          </button>
          {loopCount > 0 && (
            <button
              onClick={() => setShowLoopsPage(true)}
              className="px-8 py-3 bg-white text-brand-blue border-2 border-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-colors font-medium flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View Loops
            </button>
          )}
        </div>
      </div>

      {showSettings && (
        <ChannelSettingsModal
          onClose={() => setShowSettings(false)}
          onSuccess={() => {
            setShowSettings(false);
            loadProfile();
          }}
        />
      )}
    </div>
  );
}
