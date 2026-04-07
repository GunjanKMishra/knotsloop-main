'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { auth as mockAuth } from '../../lib/mockData';
import { SignupData } from '../CreatorSignup';

interface SignupStepProps {
  data: SignupData;
  updateData: (data: Partial<SignupData>) => void;
  onNext: () => void;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SignupStep({ data, updateData, onNext, onClose, onSuccess }: SignupStepProps) {
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const handleEmailChange = async (newEmail: string) => {
    setEmail(newEmail);

    if (!newEmail || !newEmail.includes('@')) {
      setIsSignIn(true);
      return;
    }

    setCheckingEmail(true);

    try {
      const existingUser = await mockAuth.getCurrentUser();
      if (existingUser && existingUser.email === newEmail) {
        setIsSignIn(false);
      } else {
        setIsSignIn(true);
      }
    } catch {
      setIsSignIn(true);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSignIn = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const user = await mockAuth.signIn(email, password);
      updateData({ email });
      onNext();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and privacy policy');
      return;
    }

    setLoading(true);

    try {
      const user = await mockAuth.signUp(email, password, email);
      updateData({ email, password });
      onNext();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sky-50 rounded-lg p-8">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg overflow-hidden">
          <button
            onClick={() => updateData({ userType: 'creator' })}
            className={`px-8 py-2 font-medium transition-colors ${
              data.userType === 'creator'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-200 text-slate-600'
            }`}
          >
            Creator
          </button>
          <button
            onClick={() => updateData({ userType: 'student' })}
            className={`px-8 py-2 font-medium transition-colors ${
              data.userType === 'student'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-200 text-slate-600'
            }`}
          >
            Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8">
        <h3 className="text-2xl font-semibold text-brand-blue text-center mb-6">
          {isSignIn ? 'Sign In' : 'Create Your Account'}
        </h3>

        <div className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-sky-50 border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none placeholder-slate-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-sky-50 border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none placeholder-slate-500"
          />
          {!isSignIn && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-sky-50 border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none placeholder-slate-500"
            />
          )}
        </div>

        {!isSignIn && (
          <div className="flex items-start gap-2 mb-6">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-slate-600">
              I accept all{' '}
              <a href="#" className="text-brand-blue underline">
                terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-brand-blue underline">
                Privacy Policy
              </a>
            </label>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={isSignIn ? handleSignIn : handleSignup}
          disabled={loading || checkingEmail}
          className="w-full py-3 bg-brand-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? (isSignIn ? 'SIGNING IN...' : 'SIGNING UP...') : checkingEmail ? 'CHECKING...' : (isSignIn ? 'LOG IN' : 'SIGN UP')}
        </button>

        <div className="text-center text-slate-500 mb-4">OR</div>

        <div className="flex justify-center gap-4 mb-6">
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <span className="text-2xl">G</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <span className="text-2xl">f</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <span className="text-2xl">𝕏</span>
          </button>
        </div>

        <div className="text-center text-sm text-slate-600">
          {isSignIn ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setIsSignIn(false);
                  setPassword('');
                }}
                className="text-brand-blue font-medium hover:underline"
              >
                Sign up now.
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsSignIn(true);
                  setConfirmPassword('');
                  setAcceptTerms(false);
                }}
                className="text-brand-blue font-medium hover:underline"
              >
                Sign in now.
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
