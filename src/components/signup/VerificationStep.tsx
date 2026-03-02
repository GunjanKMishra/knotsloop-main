'use client';

import { useState, useEffect } from 'react';
import { User, Youtube, Tag, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SignupData } from '../CreatorSignup';

interface VerificationStepProps {
  data: SignupData;
  onBack: () => void;
  onComplete: () => void;
}

export default function VerificationStep({
  data,
  onBack,
  onComplete,
}: VerificationStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [contentDomains, setContentDomains] = useState<string[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    loadContentTags();
  }, []);

  const loadContentTags = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: disciplinesData } = await supabase
        .from('creator_disciplines')
        .select('primary_discipline_id, primary_disciplines(name)')
        .eq('creator_id', user.id);

      const { data: domainsData } = await supabase
        .from('content_domains')
        .select('domain_type')
        .eq('creator_id', user.id);

      if (disciplinesData) {
        const disciplineNames = disciplinesData
          .map((d: any) => d.primary_disciplines?.name)
          .filter(Boolean);
        setDisciplines(disciplineNames);
      }

      if (domainsData) {
        setContentDomains(domainsData.map(d => d.domain_type));
      }
    } catch (err) {
      console.error('Error loading content tags:', err);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { error: updateError } = await supabase
        .from('creator_profiles')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-blue mb-2">KNOTLOOP</h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-3xl font-semibold text-brand-blue text-center mb-4">
          Review Your Information
        </h3>
        <p className="text-center text-slate-600 mb-8">
          Please verify all details before continuing to create your first loop
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-sky-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-700 mb-3">Profile Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">Name:</span>
                    <span className="ml-2 text-slate-700 font-medium">
                      {data.name || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>
                    <span className="ml-2 text-slate-700 font-medium">{data.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Headline:</span>
                    <span className="ml-2 text-slate-700 font-medium">
                      {data.headline || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">User Type:</span>
                    <span className="ml-2 text-slate-700 font-medium capitalize">
                      {data.userType}
                    </span>
                  </div>
                </div>
                {data.biography && (
                  <div className="mt-2 text-sm">
                    <span className="text-slate-500">Biography:</span>
                    <p className="ml-2 text-slate-700">{data.biography}</p>
                  </div>
                )}
              </div>
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-sky-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-700 mb-3">Channel Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">Channel Name:</span>
                    <span className="ml-2 text-slate-700 font-medium">
                      {data.channelName || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Channel URL:</span>
                    <span className="ml-2 text-slate-700 font-medium truncate block">
                      {data.channelUrl || 'Not provided'}
                    </span>
                  </div>
                </div>
                {data.channelDescription && (
                  <div className="mt-2 text-sm">
                    <span className="text-slate-500">Description:</span>
                    <p className="ml-2 text-slate-700">{data.channelDescription}</p>
                  </div>
                )}
                {data.subdomain && (
                  <div className="mt-2 text-sm">
                    <span className="text-slate-500">Subdomain:</span>
                    <span className="ml-2 text-slate-700 font-medium">{data.subdomain}.knotloop.com</span>
                  </div>
                )}
              </div>
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-sky-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-700 mb-3">Content Tags</h4>
                {loadingTags ? (
                  <div className="text-sm text-slate-500">Loading tags...</div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-500">Content Domain:</span>
                      <div className="ml-2 mt-1">
                        {contentDomains.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {contentDomains.map(domain => (
                              <span key={domain} className="inline-block px-2 py-1 bg-brand-blue text-white rounded text-xs font-medium">
                                {domain}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-700 font-medium">Not provided</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Content Section:</span>
                      <div className="ml-2 mt-1">
                        {disciplines.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {disciplines.map(discipline => (
                              <span key={discipline} className="inline-block px-2 py-1 bg-brand-blue text-white rounded text-xs font-medium">
                                {discipline}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-700 font-medium">Not provided</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Privacy:</span>
                      <span className="ml-2 text-slate-700 font-medium">
                        {data.makePrivate ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <Check className="w-6 h-6 text-green-600" />
            </div>
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
            onClick={handleComplete}
            disabled={loading}
            className="px-8 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Completing...' : 'Complete & Create Loop'}
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
          <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
          <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
          <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
        </div>
      </div>
    </div>
  );
}
