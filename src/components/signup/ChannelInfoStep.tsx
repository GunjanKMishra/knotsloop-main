'use client';

import { useState, useEffect } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SignupData } from '../CreatorSignup';

interface ChannelInfoStepProps {
  data: SignupData;
  updateData: (data: Partial<SignupData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Channel {
  id: string;
  channel_name: string;
  channel_url: string;
  channel_description: string;
}

export default function ChannelInfoStep({
  data,
  updateData,
  onNext,
  onBack,
}: ChannelInfoStepProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [channelName, setChannelName] = useState(data.channelName);
  const [channelUrl, setChannelUrl] = useState(data.channelUrl);
  const [channelDescription, setChannelDescription] = useState(data.channelDescription);
  const [subdomain, setSubdomain] = useState(data.subdomain);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubdomainExpanded, setIsSubdomainExpanded] = useState(false);

  useEffect(() => {
    loadChannelData();
  }, []);

  const loadChannelData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoadingData(false);
        return;
      }

      const { data: channelsData } = await supabase
        .from('creator_channels')
        .select('id, channel_name, channel_url, channel_description')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: true });

      const { data: profileData } = await supabase
        .from('creator_profiles')
        .select('subdomain')
        .eq('id', user.id)
        .maybeSingle();

      if (channelsData && channelsData.length > 0) {
        setChannels(channelsData);
        const firstChannel = channelsData[0];
        setSelectedChannelId(firstChannel.id);
        setChannelName(firstChannel.channel_name || '');
        setChannelUrl(firstChannel.channel_url || '');
        setChannelDescription(firstChannel.channel_description || '');

        updateData({
          channelName: firstChannel.channel_name || '',
          channelUrl: firstChannel.channel_url || '',
          channelDescription: firstChannel.channel_description || '',
        });
      }

      if (profileData) {
        setSubdomain(profileData.subdomain || '');
        updateData({ subdomain: profileData.subdomain || '' });
      }
    } catch (err) {
      console.error('Error loading channel data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const selectChannel = (channel: Channel) => {
    setSelectedChannelId(channel.id);
    setChannelName(channel.channel_name || '');
    setChannelUrl(channel.channel_url || '');
    setChannelDescription(channel.channel_description || '');

    updateData({
      channelName: channel.channel_name || '',
      channelUrl: channel.channel_url || '',
      channelDescription: channel.channel_description || '',
    });
  };

  const addNewChannel = () => {
    setSelectedChannelId(null);
    setChannelName('');
    setChannelUrl('');
    setChannelDescription('');
  };

  const deleteChannel = async (channelId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this channel?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('creator_channels')
        .delete()
        .eq('id', channelId);

      if (deleteError) throw deleteError;

      const updatedChannels = channels.filter(c => c.id !== channelId);
      setChannels(updatedChannels);

      if (selectedChannelId === channelId) {
        if (updatedChannels.length > 0) {
          selectChannel(updatedChannels[0]);
        } else {
          addNewChannel();
        }
      }
    } catch (err) {
      console.error('Error deleting channel:', err);
      setError('Failed to delete channel');
    }
  };

  const saveCurrentChannel = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (selectedChannelId) {
      const { error: updateError } = await supabase
        .from('creator_channels')
        .update({
          channel_name: channelName,
          channel_url: channelUrl,
          channel_description: channelDescription,
        })
        .eq('id', selectedChannelId);

      if (updateError) throw updateError;
    } else {
      const { data: newChannel, error: insertError } = await supabase
        .from('creator_channels')
        .insert({
          creator_id: user.id,
          channel_name: channelName,
          channel_url: channelUrl,
          channel_description: channelDescription,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (newChannel) {
        setChannels([...channels, newChannel]);
        setSelectedChannelId(newChannel.id);
      }
    }
  };

  const handleNext = async () => {
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      if (channels.length === 0 && !channelName) {
        throw new Error('Please add at least one channel');
      }

      if (channelName) {
        await saveCurrentChannel();
      }

      const { error: updateError } = await supabase
        .from('creator_profiles')
        .update({
          subdomain,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      updateData({ channelName, channelUrl, channelDescription, subdomain });
      onNext();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-8 text-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-blue mb-2">KNOTLOOP</h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-3xl font-semibold text-brand-blue text-center mb-8">
          Welcome Creator
        </h3>

        <div className="bg-sky-50 rounded-lg p-8 mb-6 relative">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-slate-700">
                  Channel's Information
                </h4>
              </div>

              {channels.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm text-slate-600 mb-2">
                    Your Channels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {channels.map(channel => (
                      <div
                        key={channel.id}
                        onClick={() => selectChannel(channel)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                          selectedChannelId === channel.id
                            ? 'bg-brand-blue text-white'
                            : 'bg-white text-slate-700 hover:bg-sky-100'
                        }`}
                      >
                        <span className="text-sm font-medium">{channel.channel_name}</span>
                        <button
                          onClick={(e) => deleteChannel(channel.id, e)}
                          className={`p-1 rounded hover:bg-red-500 hover:text-white transition-colors ${
                            selectedChannelId === channel.id ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-2">
                        Channel Name
                      </label>
                      <input
                        type="text"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder="Enter channel name"
                        className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-2">
                        Channel URL
                      </label>
                      <input
                        type="url"
                        value={channelUrl}
                        onChange={(e) => setChannelUrl(e.target.value)}
                        placeholder="https://youtube.com/@yourchannel"
                        className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-2">
                        Channel Description
                      </label>
                      <textarea
                        value={channelDescription}
                        onChange={(e) => setChannelDescription(e.target.value)}
                        rows={4}
                        placeholder="Describe your channel content..."
                        className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                      />
                    </div>
                  </div>
                  <div className="w-32 flex flex-col items-center gap-2">
                    <div className="w-32 h-32 rounded-full bg-brand-blue flex items-center justify-center cursor-pointer hover:bg-opacity-90 transition-colors">
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <span className="text-xs text-slate-600 text-center">Channel Logo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={addNewChannel}
            className="absolute bottom-6 right-6 w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all hover:scale-110 shadow-lg"
            title="Add Another Channel"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-sky-50 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-slate-700 mb-4">Knotloop Subdomain</h4>
              {isSubdomainExpanded && (
                <div className="space-y-3 mt-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">
                      Choose your unique subdomain
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="yourname"
                        className="flex-1 px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none"
                      />
                      <span className="text-slate-600">.knotloop.com</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      This will be your unique URL for your learning content
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubdomainExpanded(false)}
                    className="px-4 py-2 bg-brand-blue text-white rounded text-sm hover:bg-opacity-90 transition-colors"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSubdomainExpanded(!isSubdomainExpanded)}
              className="px-4 py-1 border border-slate-300 text-slate-600 rounded text-sm hover:bg-white transition-colors"
            >
              {isSubdomainExpanded ? 'Hide' : 'Edit'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between mb-8">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className="px-8 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Next'}
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
