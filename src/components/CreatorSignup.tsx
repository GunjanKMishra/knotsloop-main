import { useState } from 'react';
import SignupStep from './signup/SignupStep';
import ProfileDetailsStep from './signup/ProfileDetailsStep';
import ChannelInfoStep from './signup/ChannelInfoStep';
import ContentTagsStep from './signup/ContentTagsStep';
import VerificationStep from './signup/VerificationStep';

interface CreatorSignupProps {
  onClose: () => void;
  onSuccess: () => void;
}

export interface SignupData {
  email: string;
  password: string;
  userType: 'creator' | 'student';
  name: string;
  headline: string;
  biography: string;
  website: string;
  linkedin: string;
  photoUrl: string;
  channelName: string;
  channelUrl: string;
  channelDescription: string;
  channelLogoUrl: string;
  subdomain: string;
  contentDomain: string;
  contentSection: string;
  makePrivate: boolean;
}

export default function CreatorSignup({ onClose, onSuccess }: CreatorSignupProps) {
  const [expandedStep, setExpandedStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    userType: 'creator',
    name: '',
    headline: '',
    biography: '',
    website: '',
    linkedin: '',
    photoUrl: '',
    channelName: '',
    channelUrl: '',
    channelDescription: '',
    channelLogoUrl: '',
    subdomain: '',
    contentDomain: '',
    contentSection: '',
    makePrivate: false,
  });

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    if (step < 5) {
      setExpandedStep(step + 1);
    }
  };

  const nextStep = () => {
    completeStep(expandedStep);
  };

  const prevStep = () => setExpandedStep(prev => Math.max(prev - 1, 1));

  const toggleStep = (step: number) => {
    if (step === 1 || completedSteps.includes(step - 1)) {
      setExpandedStep(expandedStep === step ? 0 : step);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            {/* Step 1: Sign Up / Sign In */}
            <div className="mb-6">
              <div
                className={`flex items-center justify-between p-6 rounded-lg cursor-pointer transition-colors ${
                  expandedStep === 1 ? 'bg-sky-50' : 'bg-gray-50'
                }`}
                onClick={() => toggleStep(1)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    completedSteps.includes(1) ? 'bg-green-500' : 'bg-brand-blue'
                  }`}>
                    {completedSteps.includes(1) ? '✓' : '1'}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Sign Up / Sign In</h3>
                </div>
                {completedSteps.includes(1) && expandedStep !== 1 && (
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Edit
                  </button>
                )}
              </div>
              {expandedStep === 1 && (
                <div className="mt-4">
                  <SignupStep
                    data={signupData}
                    updateData={updateSignupData}
                    onNext={nextStep}
                    onClose={onClose}
                    onSuccess={onSuccess}
                  />
                </div>
              )}
            </div>

            {/* Step 2: Creator's Information */}
            <div className="mb-6">
              <div
                className={`flex items-center justify-between p-6 rounded-lg ${
                  completedSteps.includes(1) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                } transition-colors ${
                  expandedStep === 2 ? 'bg-sky-50' : 'bg-gray-50'
                }`}
                onClick={() => toggleStep(2)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    completedSteps.includes(2) ? 'bg-green-500' : 'bg-brand-blue'
                  }`}>
                    {completedSteps.includes(2) ? '✓' : '2'}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Creator's Information</h3>
                </div>
                {completedSteps.includes(2) && expandedStep !== 2 && (
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Edit
                  </button>
                )}
              </div>
              {expandedStep === 2 && (
                <div className="mt-4">
                  <ProfileDetailsStep
                    data={signupData}
                    updateData={updateSignupData}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                </div>
              )}
            </div>

            {/* Step 3: Channel Information */}
            <div className="mb-6">
              <div
                className={`flex items-center justify-between p-6 rounded-lg ${
                  completedSteps.includes(2) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                } transition-colors ${
                  expandedStep === 3 ? 'bg-sky-50' : 'bg-gray-50'
                }`}
                onClick={() => toggleStep(3)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    completedSteps.includes(3) ? 'bg-green-500' : 'bg-brand-blue'
                  }`}>
                    {completedSteps.includes(3) ? '✓' : '3'}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Channel Information</h3>
                </div>
                {completedSteps.includes(3) && expandedStep !== 3 && (
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Edit
                  </button>
                )}
              </div>
              {expandedStep === 3 && (
                <div className="mt-4">
                  <ChannelInfoStep
                    data={signupData}
                    updateData={updateSignupData}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                </div>
              )}
            </div>

            {/* Step 4: Content Tags */}
            <div className="mb-6">
              <div
                className={`flex items-center justify-between p-6 rounded-lg ${
                  completedSteps.includes(3) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                } transition-colors ${
                  expandedStep === 4 ? 'bg-sky-50' : 'bg-gray-50'
                }`}
                onClick={() => toggleStep(4)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    completedSteps.includes(4) ? 'bg-green-500' : 'bg-brand-blue'
                  }`}>
                    {completedSteps.includes(4) ? '✓' : '4'}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Content Tags</h3>
                </div>
                {completedSteps.includes(4) && expandedStep !== 4 && (
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Edit
                  </button>
                )}
              </div>
              {expandedStep === 4 && (
                <div className="mt-4">
                  <ContentTagsStep
                    data={signupData}
                    updateData={updateSignupData}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                </div>
              )}
            </div>

            {/* Step 5: Verification */}
            <div className="mb-6">
              <div
                className={`flex items-center justify-between p-6 rounded-lg ${
                  completedSteps.includes(4) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                } transition-colors ${
                  expandedStep === 5 ? 'bg-sky-50' : 'bg-gray-50'
                }`}
                onClick={() => toggleStep(5)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    completedSteps.includes(5) ? 'bg-green-500' : 'bg-brand-blue'
                  }`}>
                    {completedSteps.includes(5) ? '✓' : '5'}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Verification</h3>
                </div>
              </div>
              {expandedStep === 5 && (
                <div className="mt-4">
                  <VerificationStep
                    data={signupData}
                    onBack={prevStep}
                    onComplete={onSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
