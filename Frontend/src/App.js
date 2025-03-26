import './App.css';
import Header from './pages/HeaderPages/Header';
import Footer from "./pages/FooterPages/Footer";
import Layout from './IndexPage';
import Counsellor from './pages/CommunityPages/Counsellor';
import CounsellorBotChat from './pages/CommunityPages/CounsellorBotChat';

import MentalHealthAssessments from './Components/Assesment';
import ResearchDevelopment from './pages/HeaderPages/ResearchDevelopment';
import AnxietyAssessment from './pages/AssessmentPages/AnxietyAssessment';
import DepressionScreening from './pages/AssessmentPages/DepressionScreening';
import StressEvaluation from './pages/AssessmentPages/StressEvaluation';
import Social_Anxiety from './pages/AssessmentPages/Social_Anxiety';
import Panic_Disorder from './pages/AssessmentPages/Panic_Disorder';
import ADHD_Assesment from './pages/AssessmentPages/ADHD_Assesment';
import OCD_Assesment from './pages/AssessmentPages/OCD_Assesment';
import PTSD_Assesment from './pages/AssessmentPages/PTSD_Assesment';

import Conditions from './pages/HeaderPages/Conditions';
import Resources from './pages/HeaderPages/Resources';
import Contact from './pages/HeaderPages/Contact';
import About from './pages/HeaderPages/About';
import HotlinePage from './pages/HeaderPages/HotlinePage';
import ScaleSurvey from './pages/HeaderPages/ScaleSurvey'; 
import TechSurvey from './pages/HeaderPages/TechSurvey';
import LifestyleSurvey from './pages/HeaderPages/LifestyleSurvey';

import Login from './pages/HeaderPages/Login'
import Signup from './pages/HeaderPages/SignUp'
import Dashboard from './pages/HeaderPages/Dashboard'

import MoodTracking from './pages/KeyFeaturePages/MoodTracking';
import ActivityLogging from './pages/KeyFeaturePages/ActivityLogging';
import PersonalizedGuidance from './pages/KeyFeaturePages/PersonalizedGuidance';

import Anxiety from './pages/ConditionPages/Anxiety';
import Depression from './pages/ConditionPages/Depression';
import Bipolar from './pages/ConditionPages/Bipolar';
import OCD from './pages/ConditionPages/OCD';
import PTSD from './pages/ConditionPages/PTSD';
import ED from './pages/ConditionPages/ED';
import ADHD from './pages/ConditionPages/ADHD';
import Schizophrenia from './pages/ConditionPages/Schizophrenia';


import Privacy from './pages/FooterPages/Privacy';
import Terms from './pages/FooterPages/Terms';


import { Route, Routes } from "react-router-dom";
import { UserContextProvider } from './UserContext';
import ScrollToTop from './Components/ScrollToTop';

import './index.css';

import TechUsage from './pages/HeaderPages/TechUsage';
import LifestylePsychosocial from './pages/HeaderPages/LifestylePsychosocial';
import MentalHealthScales from './pages/HeaderPages/MentalHealthScales';

function App() {
  return (
    <div className="app-container">
      <UserContextProvider>
        <Header />
        <ScrollToTop />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Layout />} />

            <Route path='/counsellors' element={<Counsellor />} />
            <Route path="/counsellor-bot" element={<CounsellorBotChat />} />

            <Route path='/assessment' element={<MentalHealthAssessments />} />
            <Route path='/anxiety-assessment' element={<AnxietyAssessment />} />
            <Route path='/depression-screening' element={<DepressionScreening />} />
            <Route path='/stress-evaluation' element={<StressEvaluation />} />
            <Route path='/social_anxiety_gauge' element={<Social_Anxiety />} />
            <Route path='/panic_monitor' element={<Panic_Disorder />} />
            <Route path='/adhd_clarity_check' element={<ADHD_Assesment />} />
            <Route path='/ocd_check' element={<OCD_Assesment />} />
            <Route path='/ptsd_clarity_check' element={<PTSD_Assesment />} />

            <Route path='/conditions' element={<Conditions />} />
            <Route path='/resources' element={<Resources />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/about' element={<About />} />
            <Route path='/hotlines' element={<HotlinePage />} />
            <Route path='/research-development' element={<ResearchDevelopment />} />
            <Route path="/ScaleSurvey" element={<ScaleSurvey />} /> {/* adjust path if needed */}
            <Route path="/TechSurvey" element={<TechSurvey />} /> {/* adjust path if needed */}
            <Route path="/LifestyleSurvey" element={<LifestyleSurvey />} /> {/* adjust path if needed */}

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/conditions/anxiety" element={<Anxiety />} />
            <Route path="/conditions/depression" element={<Depression />} />
            <Route path="/conditions/bipolar-disorder" element={<Bipolar />} />
            <Route path="/conditions/ocd" element={<OCD />} />
            <Route path="/conditions/ptsd" element={<PTSD />} />
            <Route path="/conditions/eating-disorders" element={<ED />} />
            <Route path="/conditions/adhd" element={<ADHD />} />
            <Route path="/conditions/schizophrenia" element={<Schizophrenia />} />

            <Route path="/mood-tracking" element={<MoodTracking />} />
            <Route path="/activity-logging" element={<ActivityLogging />} />
            <Route path="/personalized-guidance" element={<PersonalizedGuidance />} />

            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/research/tech-usage" element={<TechUsage />} />
            <Route path="/research/lifestyle-psychosocial" element={<LifestylePsychosocial />} />
            <Route path="/research/mental-health-scales" element={<MentalHealthScales />} />
          </Routes>
        </div>
        <Footer />
      </UserContextProvider>
    </div>
  );
}

export default App;
