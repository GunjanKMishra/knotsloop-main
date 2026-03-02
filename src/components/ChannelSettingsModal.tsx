'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChannelSettingsModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface SettingsData {
  channelName: string;
  channelUrl: string;
  channelDescription: string;
  channelLogoUrl: string;
  name: string;
  headline: string;
  biography: string;
  website: string;
  linkedin: string;
  subdomain: string;
  customDomain: string;
  photoUrl: string;
}

const CONTENT_TYPES = ['Tutorial', 'Lectures', 'Workshops', 'Case Studies', 'Demonstration', 'Readings', 'Reviews'];

export default function ChannelSettingsModal({ onClose, onSuccess }: ChannelSettingsModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [settings, setSettings] = useState<SettingsData>({
    channelName: '',
    channelUrl: '',
    channelDescription: '',
    channelLogoUrl: '',
    name: '',
    headline: '',
    biography: '',
    website: '',
    linkedin: '',
    subdomain: '',
    customDomain: '',
    photoUrl: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

      const { data: contentDomainsData } = await supabase
        .from('content_domains')
        .select('domain_type')
        .eq('creator_id', user.id);

      if (contentDomainsData) {
        setSelectedContentTypes(contentDomainsData.map(cd => cd.domain_type));
      }

      if (profileData) {
        setSettings({
          channelName: channelData?.channel_name || '',
          channelUrl: channelData?.channel_url || '',
          channelDescription: channelData?.channel_description || '',
          channelLogoUrl: channelData?.channel_logo_url || '',
          name: profileData.name || '',
          headline: profileData.headline || '',
          biography: profileData.biography || '',
          website: profileData.website || '',
          linkedin: profileData.linkedin || '',
          subdomain: profileData.subdomain || '',
          customDomain: '',
          photoUrl: profileData.photo_url || '',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('creator_profiles')
        .update({
          name: settings.name,
          headline: settings.headline,
          biography: settings.biography,
          website: settings.website,
          linkedin: settings.linkedin,
          subdomain: settings.subdomain,
          photo_url: settings.photoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      await supabase
        .from('creator_channels')
        .update({
          channel_name: settings.channelName,
          channel_url: settings.channelUrl,
          channel_description: settings.channelDescription,
          channel_logo_url: settings.channelLogoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('creator_id', user.id);

      await supabase
        .from('content_domains')
        .delete()
        .eq('creator_id', user.id);

      if (selectedContentTypes.length > 0) {
        await supabase
          .from('content_domains')
          .insert(
            selectedContentTypes.map(type => ({
              creator_id: user.id,
              domain_type: type,
            }))
          );
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleContentType = (type: string) => {
    setSelectedContentTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-blue">Channel Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  value={settings.photoUrl}
                  onChange={(e) => setSettings({ ...settings, photoUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500">Enter a URL for your profile photo</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  value={settings.headline}
                  onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                  placeholder="e.g., Philosophy Educator & Content Creator"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Biography
                </label>
                <textarea
                  value={settings.biography}
                  onChange={(e) => setSettings({ ...settings, biography: e.target.value })}
                  placeholder="Tell us about yourself and your teaching philosophy"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subdomain
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.subdomain}
                    onChange={(e) => setSettings({ ...settings, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    placeholder="yourname"
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                  />
                  <span className="text-slate-600 whitespace-nowrap">.knotloop.com</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Your unique subdomain on KnotLoop</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Domain (Optional)
                </label>
                <input
                  type="text"
                  value={settings.customDomain}
                  onChange={(e) => setSettings({ ...settings, customDomain: e.target.value.toLowerCase() })}
                  placeholder="www.yourdomain.com"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500">Connect your own domain (requires DNS configuration)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={settings.website}
                  onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                  placeholder="https://your-website.com"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Channel Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Channel Logo URL
                </label>
                <input
                  type="url"
                  value={settings.channelLogoUrl}
                  onChange={(e) => setSettings({ ...settings, channelLogoUrl: e.target.value })}
                  placeholder="https://example.com/logo.jpg"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500">Enter a URL for your channel logo</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={settings.channelName}
                  onChange={(e) => setSettings({ ...settings, channelName: e.target.value })}
                  placeholder="Your YouTube channel name"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Channel URL
                </label>
                <input
                  type="url"
                  value={settings.channelUrl}
                  onChange={(e) => setSettings({ ...settings, channelUrl: e.target.value })}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Channel Description
                </label>
                <textarea
                  value={settings.channelDescription}
                  onChange={(e) => setSettings({ ...settings, channelDescription: e.target.value })}
                  placeholder="Describe your channel and content"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:outline-none text-slate-900 resize-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Content Types</h3>
            <p className="text-sm text-slate-600 mb-4">Select the types of content you create</p>
            <div className="grid grid-cols-2 gap-3">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleContentType(type)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedContentTypes.includes(type)
                      ? 'border-brand-blue bg-brand-blue text-white'
                      : 'border-gray-200 bg-white text-slate-700 hover:border-brand-blue hover:bg-brand-blue hover:bg-opacity-5'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 bg-gray-200 text-slate-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
