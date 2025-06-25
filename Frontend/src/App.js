import './App.css';
import Header from './pages/HeaderPages/Header';
import Footer from "./pages/FooterPages/Footer";
import Layout from './IndexPage';
import Counsellor from './pages/CommunityPages/Counsellor';
import CounsellorBotChat from './pages/AICounselorPages/CounsellorBotChat';
import AICounselor from './pages/AICounselorPages/AICounselor';
import Routine from './pages/AICounselorPages/Routine';
import Games from './pages/GamesPages/Games';
import FlappyBird from './pages/GamesPages/FlappyBird';
import MemoryMatch from './pages/GamesPages/MemoryMatch';

import MentalHealthAssessments from './Components/Assesment';
import ResearchDevelopment from './pages/HeaderPages/ResearchDevelopment';
import AnxietyAssessment from './pages/AssessmentPages/AnxietyAssessment';
import DepressionScreening from './pages/AssessmentPages/DepressionScreening';
import StressEvaluation from './pages/AssessmentPages/StressEvaluation';
import SocialAnxiety from './pages/AssessmentPages/Social_Anxiety';
import PanicDisorder from './pages/AssessmentPages/Panic_Disorder';
import ADHDAssesment from './pages/AssessmentPages/ADHD_Assesment';
import OCDAssesment from './pages/AssessmentPages/OCD_Assesment';
import PTSDAssesment from './pages/AssessmentPages/PTSD_Assesment';

import Conditions from './pages/HeaderPages/Conditions';
import Resources from './pages/HeaderPages/Resources';
import Contact from './pages/HeaderPages/Contact';
import About from './pages/HeaderPages/About';
import HotlinePage from './pages/HeaderPages/HotlinePage';
import ScaleSurvey from './pages/HeaderPages/ScaleSurvey'; 
import TechSurvey from './pages/HeaderPages/TechSurvey';
import TechSurvey2 from './pages/HeaderPages/TechSurvey2';
import TechSurvey3 from './pages/HeaderPages/TechSurvey3';
import TechSurvey4 from './pages/HeaderPages/TechSurvey4';
import TechSurvey5 from './pages/HeaderPages/TechSurvey5';
import LifestyleSurvey from './pages/HeaderPages/LifestyleSurvey';

import Login from './pages/HeaderPages/Login'
import Signup from './pages/HeaderPages/SignUp'

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
import UserDashboard from './pages/UserDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastify-custom.css';
import Community from './pages/CommunityPages/Community';
import GiveFeedback from './pages/CommunityPages/GiveFeedback';
import { useLocation } from 'react-router-dom';
import WordRecall from './pages/GamesPages/WordRecall';
import SequenceSimon from './pages/GamesPages/SequenceSimon';
import Suduku from './pages/GamesPages/suduku';


function App() {

  const location = useLocation();

  const hideFooterRoutes = [
    '/counsellor-bot',
    '/TechSurvey',
    '/TechSurvey2',
    '/TechSurvey3',
    '/TechSurvey4',
    '/TechSurvey5'
  ];
   const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      <UserContextProvider>
        <Header />
        <ScrollToTop />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/flappy-bird" element={<FlappyBird />} />
            <Route path="/games/memory-match" element={<MemoryMatch />} />
            <Route path="/games/word-recall" element={<WordRecall />} />
            <Route path="/games/sequence-simon" element={<SequenceSimon />} />
            <Route path="/games/sudoku" element={<Suduku />} />
            

            <Route path='/counsellors' element={<Counsellor />} />
            <Route path="/counsellor-bot" element={<CounsellorBotChat />} />

            <Route path='/assessment' element={<MentalHealthAssessments />} />
            <Route path='/anxiety-assessment' element={<AnxietyAssessment />} />
            <Route path='/depression-screening' element={<DepressionScreening />} />
            <Route path='/stress-evaluation' element={<StressEvaluation />} />
            <Route path='/social_anxiety_gauge' element={<SocialAnxiety />} />
            <Route path='/panic_monitor' element={<PanicDisorder />} />
            <Route path='/adhd_clarity_check' element={<ADHDAssesment />} />
            <Route path='/ocd_check' element={<OCDAssesment />} />
            <Route path='/ptsd_clarity_check' element={<PTSDAssesment />} />

            <Route path='/conditions' element={<Conditions />} />
            <Route path='/resources' element={<Resources />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/userguide' element={<About />} />
            <Route path='/hotlines' element={<HotlinePage />} />
            <Route path='/research-development' element={<ResearchDevelopment />} />
            <Route path="/ScaleSurvey" element={<ScaleSurvey />} />
            <Route path="/TechSurvey" element={<TechSurvey />} />
            <Route path="/TechSurvey2" element={<TechSurvey2 />} />
            <Route path="/TechSurvey3" element={<TechSurvey3 />} />
            <Route path="/TechSurvey4" element={<TechSurvey4 />} />
            <Route path="/TechSurvey5" element={<TechSurvey5 />} />
            <Route path="/LifestyleSurvey" element={<LifestyleSurvey />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

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

            <Route path="/ai-counselor" element={<AICounselor />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/give-feedback" element={<GiveFeedback />} />
          </Routes>
        </div>
        {!shouldHideFooter && <Footer />}
      </UserContextProvider>
    </div>
  );
}

export default App;
