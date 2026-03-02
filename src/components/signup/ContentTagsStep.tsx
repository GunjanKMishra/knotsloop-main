'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SignupData } from '../CreatorSignup';

interface ContentTagsStepProps {
  data: SignupData;
  updateData: (data: Partial<SignupData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface PrimaryDiscipline {
  id: string;
  name: string;
  major_branch_id: string;
}

const CONTENT_DOMAIN_OPTIONS = [
  'Tutorial',
  'Lectures',
  'Workshops',
  'Case Studies',
  'Demonstration',
  'Readings',
  'Reviews',
];

export default function ContentTagsStep({
  data,
  updateData,
  onNext,
  onBack,
}: ContentTagsStepProps) {
  const [disciplines, setDisciplines] = useState<PrimaryDiscipline[]>([]);
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState<string[]>([]);
  const [autoSelectedIds, setAutoSelectedIds] = useState<string[]>([]);
  const [selectedContentDomains, setSelectedContentDomains] = useState<string[]>([]);
  const [sectionSearch, setSectionSearch] = useState('');
  const [domainSearch, setDomainSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDisciplines, setLoadingDisciplines] = useState(true);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  useEffect(() => {
    loadDisciplinesAndAutoPopulate();
  }, []);

  const analyzeChannelWithAI = async (channelUrl: string): Promise<string[]> => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/analyze-channel`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze channel');
      }

      const result = await response.json();
      return result.suggestedDisciplines || [];
    } catch (error) {
      console.error('AI analysis failed:', error);
      return [];
    }
  };

  const matchDisciplinesToChannel = (channelDescription: string, channelName: string, disciplines: PrimaryDiscipline[]): string[] => {
    const text = `${channelName} ${channelDescription}`.toLowerCase();
    const matches: string[] = [];

    const keywords: { [key: string]: string[] } = {
      'Arts': ['art', 'music', 'dance', 'painting', 'drawing', 'design', 'creative', 'performance', 'theater', 'drama'],
      'History': ['history', 'historical', 'ancient', 'medieval', 'war', 'civilization'],
      'Languages & Literature': ['language', 'literature', 'writing', 'poetry', 'linguistics', 'grammar', 'reading'],
      'Philosophy': ['philosophy', 'philosophical', 'ethics', 'logic', 'metaphysics', 'morality'],
      'Religion': ['religion', 'religious', 'theology', 'spiritual', 'bible', 'faith'],
      'Anthropology': ['anthropology', 'culture', 'society', 'archaeology', 'human evolution'],
      'Economics': ['economics', 'economy', 'finance', 'trading', 'business', 'market', 'investment'],
      'Geography': ['geography', 'maps', 'countries', 'places', 'travel', 'world'],
      'Political Science': ['politics', 'political', 'government', 'policy', 'democracy', 'election'],
      'Psychology': ['psychology', 'mental health', 'behavior', 'cognitive', 'therapy', 'mindfulness'],
      'Sociology': ['sociology', 'social', 'community', 'demographics'],
      'Physical Sciences': ['physics', 'chemistry', 'astronomy', 'space', 'quantum', 'molecules', 'atoms'],
      'Life Sciences': ['biology', 'life science', 'nature', 'animals', 'plants', 'ecology', 'genetics', 'evolution'],
      'Mathematics': ['math', 'mathematics', 'calculus', 'algebra', 'geometry', 'statistics'],
      'Computer Science': ['programming', 'coding', 'software', 'computer', 'tech', 'algorithm', 'data science', 'ai', 'machine learning', 'web development'],
      'Logic': ['logic', 'reasoning', 'critical thinking'],
      'Engineering': ['engineering', 'mechanical', 'electrical', 'robotics', 'construction', 'automation'],
      'Medicine & Health': ['medicine', 'health', 'medical', 'healthcare', 'fitness', 'nutrition', 'wellness', 'doctor', 'nursing'],
      'Business': ['business', 'entrepreneurship', 'startup', 'management', 'marketing', 'sales'],
      'Education': ['education', 'teaching', 'learning', 'tutorial', 'course', 'training', 'student'],
      'Law': ['law', 'legal', 'court', 'justice', 'attorney', 'rights'],
    };

    disciplines.forEach(discipline => {
      const disciplineKeywords = keywords[discipline.name] || [];
      const hasMatch = disciplineKeywords.some(keyword => text.includes(keyword));
      if (hasMatch) {
        matches.push(discipline.id);
      }
    });

    return matches;
  };

  const loadDisciplinesAndAutoPopulate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: disciplinesData, error: disciplinesError } = await supabase
        .from('primary_disciplines')
        .select('*')
        .order('name');

      if (disciplinesError) throw disciplinesError;

      const disciplinesList = disciplinesData || [];
      setDisciplines(disciplinesList);

      // Load previously saved selections
      const { data: savedDisciplines } = await supabase
        .from('creator_disciplines')
        .select('primary_discipline_id, is_platform_assigned')
        .eq('creator_id', user.id);

      const { data: savedDomains } = await supabase
        .from('content_domains')
        .select('domain_type')
        .eq('creator_id', user.id);

      if (savedDisciplines && savedDisciplines.length > 0) {
        const disciplineIds = savedDisciplines.map(d => d.primary_discipline_id);
        const autoIds = savedDisciplines
          .filter(d => d.is_platform_assigned)
          .map(d => d.primary_discipline_id);

        setSelectedDisciplineIds(disciplineIds);
        setAutoSelectedIds(autoIds);
      } else {
        // Only auto-populate if no saved selections exist
        const { data: channelData } = await supabase
          .from('creator_channels')
          .select('channel_name, channel_description, channel_url')
          .eq('creator_id', user.id)
          .maybeSingle();

        if (channelData && disciplinesList.length > 0) {
          let autoMatched: string[] = [];

          // Try AI analysis first if channel URL is available
          if (channelData.channel_url) {
            setAiAnalyzing(true);
            const aiSuggestedNames = await analyzeChannelWithAI(channelData.channel_url);
            setAiAnalyzing(false);

            if (aiSuggestedNames.length > 0) {
              // Map AI-suggested discipline names to IDs
              autoMatched = disciplinesList
                .filter(d => aiSuggestedNames.includes(d.name))
                .map(d => d.id);
            }
          }

          // Fall back to keyword matching if AI didn't return results
          if (autoMatched.length === 0) {
            autoMatched = matchDisciplinesToChannel(
              channelData.channel_description || '',
              channelData.channel_name || '',
              disciplinesList
            );
          }

          setAutoSelectedIds(autoMatched);
          setSelectedDisciplineIds(autoMatched);
        }
      }

      if (savedDomains && savedDomains.length > 0) {
        setSelectedContentDomains(savedDomains.map(d => d.domain_type));
      }
    } catch (err) {
      console.error('Error loading disciplines:', err);
    } finally {
      setLoadingDisciplines(false);
    }
  };

  const toggleDiscipline = (disciplineId: string) => {
    setSelectedDisciplineIds(prev =>
      prev.includes(disciplineId) ? prev.filter(id => id !== disciplineId) : [...prev, disciplineId]
    );
  };

  const toggleContentDomain = (domain: string) => {
    setSelectedContentDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const filteredDisciplines = disciplines.filter(d =>
    d.name.toLowerCase().includes(sectionSearch.toLowerCase())
  );

  const filteredDomains = CONTENT_DOMAIN_OPTIONS.filter(d =>
    d.toLowerCase().includes(domainSearch.toLowerCase())
  );

  const handleNext = async () => {
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      if (selectedDisciplineIds.length === 0 && selectedContentDomains.length === 0) {
        throw new Error('Please select at least one section or content domain');
      }

      // Delete existing records before inserting new ones
      await supabase
        .from('creator_disciplines')
        .delete()
        .eq('creator_id', user.id);

      await supabase
        .from('content_domains')
        .delete()
        .eq('creator_id', user.id);

      if (selectedDisciplineIds.length > 0) {
        const disciplineRecords = selectedDisciplineIds.map((disciplineId, index) => ({
          creator_id: user.id,
          primary_discipline_id: disciplineId,
          is_platform_assigned: autoSelectedIds.includes(disciplineId),
          display_order: index,
        }));

        const { error: disciplineError } = await supabase
          .from('creator_disciplines')
          .insert(disciplineRecords);

        if (disciplineError) throw disciplineError;
      }

      if (selectedContentDomains.length > 0) {
        const domainRecords = selectedContentDomains.map(domain => ({
          creator_id: user.id,
          domain_type: domain,
        }));

        const { error: domainError } = await supabase
          .from('content_domains')
          .insert(domainRecords);

        if (domainError) throw domainError;
      }

      updateData({});
      onNext();
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
        <h3 className="text-3xl font-semibold text-brand-blue text-center mb-8">
          Content Tags
        </h3>

        {loadingDisciplines ? (
          <div className="text-center py-12">
            <div className="text-slate-600">
              {aiAnalyzing ? 'Analyzing your channel content with AI...' : 'Loading disciplines...'}
            </div>
            {aiAnalyzing && (
              <p className="text-xs text-slate-500 mt-2">
                This may take a few moments as we analyze your video titles
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            <div className="bg-sky-50 rounded-lg p-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-700">
                      Section Selection
                    </h4>
                    <span className="text-sm text-slate-500">
                      {selectedDisciplineIds.length} selected
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Choose your main sections of channel
                  </p>
                  {autoSelectedIds.length > 0 && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-700 font-medium">
                        ✓ AI-powered suggestions applied
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {autoSelectedIds.length} {autoSelectedIds.length === 1 ? 'discipline' : 'disciplines'} selected based on analysis of your channel's video titles and content. You can adjust these selections.
                      </p>
                    </div>
                  )}
                  {selectedDisciplineIds.length > 0 && (
                    <div className="mb-4 p-4 bg-white border-2 border-brand-blue rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-semibold text-brand-blue">Selected Disciplines</h5>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {selectedDisciplineIds.length} selected
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {disciplines
                          .filter(d => selectedDisciplineIds.includes(d.id))
                          .map(discipline => {
                            const isAutoSelected = autoSelectedIds.includes(discipline.id);
                            return (
                              <div
                                key={discipline.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white rounded-lg text-sm group"
                              >
                                <span className="font-medium">{discipline.name}</span>
                                {isAutoSelected && (
                                  <span className="px-1.5 py-0.5 bg-white bg-opacity-20 rounded text-xs">
                                    Auto
                                  </span>
                                )}
                                <button
                                  onClick={() => toggleDiscipline(discipline.id)}
                                  className="ml-1 p-0.5 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                                  title="Remove"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  <input
                    type="text"
                    value={sectionSearch}
                    onChange={(e) => setSectionSearch(e.target.value)}
                    placeholder="Search or type section..."
                    className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none mb-4"
                  />
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {filteredDisciplines.map(discipline => {
                      const isSelected = selectedDisciplineIds.includes(discipline.id);
                      const isAutoSelected = autoSelectedIds.includes(discipline.id);

                      return (
                        <button
                          key={discipline.id}
                          onClick={() => toggleDiscipline(discipline.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                            isSelected
                              ? 'bg-brand-blue text-white'
                              : 'bg-sky-200 text-slate-600 hover:bg-sky-300'
                          }`}
                        >
                          {discipline.name}
                          {isAutoSelected && (
                            <span className="ml-2 px-1.5 py-0.5 bg-white bg-opacity-20 rounded text-xs">
                              Auto
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 rounded-lg p-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-700">
                      Content Domain
                    </h4>
                    <span className="text-sm text-slate-500">
                      {selectedContentDomains.length} selected
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    What type of content do you create?
                  </p>
                  {selectedContentDomains.length > 0 && (
                    <div className="mb-4 p-4 bg-white border-2 border-brand-blue rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-semibold text-brand-blue">Selected Content Types</h5>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {selectedContentDomains.length} selected
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedContentDomains.map(domain => (
                          <div
                            key={domain}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white rounded-lg text-sm group"
                          >
                            <span className="font-medium">{domain}</span>
                            <button
                              onClick={() => toggleContentDomain(domain)}
                              className="ml-1 p-0.5 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <input
                    type="text"
                    value={domainSearch}
                    onChange={(e) => setDomainSearch(e.target.value)}
                    placeholder="Search or type domain..."
                    className="w-full px-4 py-3 rounded-lg bg-sky-100 border-none focus:ring-2 focus:ring-brand-blue outline-none mb-4"
                  />
                  <div className="flex flex-wrap gap-2">
                    {filteredDomains.map(domain => (
                      <button
                        key={domain}
                        onClick={() => toggleContentDomain(domain)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedContentDomains.includes(domain)
                            ? 'bg-brand-blue text-white'
                            : 'bg-sky-200 text-slate-600 hover:bg-sky-300'
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
          <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
          <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
