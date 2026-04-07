'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { users as mockUsers } from '../../lib/mockData';
import { SignupData } from '../CreatorSignup';

interface ProfileDetailsStepProps {
  data: SignupData;
  updateData: (data: Partial<SignupData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ProfileDetailsStep({
  data,
  updateData,
  onNext,
  onBack,
}: ProfileDetailsStepProps) {
  const [name, setName] = useState(data.name);
  const [headline, setHeadline] = useState(data.headline);
  const [biography, setBiography] = useState(data.biography);
  const [website, setWebsite] = useState(data.website);
  const [linkedin, setLinkedin] = useState(data.linkedin);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Mock implementation - no need to load profile data
      setLoadingData(false);
    } catch (err) {
      console.error('Error loading profile data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleNext = async () => {
    setError('');
    setLoading(true);

    try {
      updateData({ name, headline, biography, website, linkedin });
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

      <div className="max-w-4xl mx-auto">
        <div className="flex gap-8">
          <div className="w-48 bg-sky-50 p-6 rounded-lg">
            <div className="text-center mb-6">
              <div className="w-32 h-32 rounded-full bg-sky-200 mx-auto mb-4 flex items-center justify-center">
                <User className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="font-semibold text-brand-blue mb-1">{name || 'Your Name'}</h3>
            </div>

            <nav className="space-y-2 text-sm">
              <div className="text-slate-600">View Public Profile</div>
              <div className="text-brand-blue font-medium">Edit Profile</div>
              <div className="text-slate-600">Photo</div>
              <div className="text-slate-600">Notification</div>
              <div className="text-slate-600">Goals and Loops</div>
            </nav>
          </div>

          <div className="flex-1">
            <h3 className="text-3xl font-semibold text-brand-blue mb-8">Edit Profile</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-700 mb-4">Basics</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Headline</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Biography</label>
                    <textarea
                      value={biography}
                      onChange={(e) => setBiography(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-700 mb-4">Socials</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-between pt-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
