import { useState } from 'react';
import Hero from './components/Hero';
import StepsSection from './components/StepsSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import FeaturesSection from './components/FeaturesSection';
import CoursifySection from './components/CoursifySection';
import FAQSection from './components/FAQSection';
import WaitlistModal from './components/WaitlistModal';
import CreatorSignup from './components/CreatorSignup';
import CreatorProfile from './components/CreatorProfile';
import Footer from './components/Footer';
import KnotDivider from './components/KnotDivider';

function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleShowProfile = () => {
    setIsSignupOpen(false);
    setShowProfile(true);
  };

  const handleLogout = () => {
    setShowProfile(false);
  };

  if (showProfile) {
    return <CreatorProfile onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero
        onJoinWaitlist={() => setIsWaitlistOpen(true)}
        onCreateLoop={() => setIsSignupOpen(true)}
      />
      <KnotDivider />
      <ProblemSection />
      <KnotDivider />
      <SolutionSection />
      <KnotDivider />
      <FeaturesSection />
      <KnotDivider />
      <StepsSection />
      <KnotDivider />
      <CoursifySection />
      <KnotDivider />
      <FAQSection />
      <Footer />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      {isSignupOpen && <CreatorSignup onClose={() => setIsSignupOpen(false)} onSuccess={handleShowProfile} />}
    </div>
  );
}

export default App;
