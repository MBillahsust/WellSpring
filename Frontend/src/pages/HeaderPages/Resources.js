import React, { useState, useEffect } from 'react';
import { BookOpen, Phone, Search, Youtube } from "lucide-react";
import { motion } from 'framer-motion';

const resources = [
  {
    category: "Articles",
    items: [
      { title: "Building Resilience", description: "Learn strategies to bounce back from life's challenges.", url: "https://care-clinics.com/building-resilience-how-to-bounce-back-from-lifes-challenges" },
      { title: "Mindfulness Techniques", description: "Discover practical mindfulness exercises for daily life.", url: "https://www.calm.com/blog/mindfulness-exercises" },
      { title: "Improving Sleep Habits", description: "Tips for better sleep and improved mental health.", url: "https://namica.org/blog/better-sleep-to-maintain-mental-health/" },
      { title: "Understanding Depression", description: "An overview of depression symptoms, causes, and treatment options.", url: "https://www.verywellmind.com/anxiety-disorders-4157261" },
      { title: "The Power of Positive Thinking", description: "How positive thinking can improve your mental health.", url: "https://www.bettersleep.com/blog/how-positive-thinking-can-improve-your-mental-health" },
      { title: "Cognitive Behavioral Therapy (CBT)", description: "Introduction to CBT techniques for managing mental health issues.", url: "https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral" },
      { title: "Healthy Eating and Mental Health", description: "Explore the link between nutrition and mental well-being.", url: "https://www.healthline.com/nutrition/mental-health-and-diet" },
      { title: "The Benefits of Physical Activity for Mental Health", description: "Learn how exercise can help alleviate anxiety and depression.", url: "https://www.mind.org.uk/information-support/tips-for-everyday-living/physical-activity-sport-and-exercise/" },
{ title: "16 Simple Ways to Relieve Stress and Anxiety", description: "Learn a variety of self-care strategies—exercise, mindfulness, nutrition—to alleviate stress and anxiety.", url: "https://www.healthline.com/nutrition/16-ways-relieve-stress-anxiety" },
{ title: "Mindfulness Exercises", description: "Explore guided imagery, breathing drills, and other practices to calm your mind and reduce stress.", url: "https://www.mayoclinic.org/healthy-lifestyle/consumer-health/in-depth/mindfulness-exercises/art-20046356" },
{ title: "Lifestyle Changes for Depression", description: "Holistic tips—meditation, sleep hygiene, breathing exercises—to support your depression care plan.", url: "https://www.healthline.com/health/depression/lifestyle-changes-overview" },
{ title: "How to Look After Your Mental Health Using Mindfulness", description: "Why MBCT and MBSR work, plus daily mindfulness tips for stress, anxiety, and depression.", url: "https://www.mentalhealth.org.uk/explore-mental-health/publications/how-look-after-your-mental-health-using-mindfulness" },
{ title: "Can a Healthy Gut Help Manage Your Anxiety?", description: "The gut-brain connection: dietary strategies to balance your microbiome and reduce anxiety.", url: "https://www.healthline.com/health/digestive-health/mental-health-gut-health" },
{ title: "Mindfulness for Your Health", description: "NIH insights on how mindfulness practice can lower anxiety, improve sleep, and reduce blood pressure.", url: "https://newsinhealth.nih.gov/2021/06/mindfulness-your-health" },
{ title: "Mental Health Basics: Types, Diagnosis, Treatment", description: "An overview of common disorders—anxiety, depression, PTSD—and how therapy helps.", url: "https://www.healthline.com/health/mental-health" },
{ title: "Starting a Mindfulness Practice: Practical Tips", description: "Step-by-step guide to build a daily mindfulness routine for resilience and calm.", url: "https://www.uchealth.com/en/media-room/articles/starting-a-mindfulness-practice-practical-tips-from-meriden-mcgraw-ms-mph" },
{ title: "Job Search Depression: Causes, Symptoms, Tips", description: "Avoid burnout during job hunting with structured days and self-care routines.", url: "https://www.healthline.com/health/depression/job-search-depression" },
{ title: "Mindfulness Meditation: Research-Proven Stress Relief", description: "APA review of 200+ studies showing how meditation lowers stress.", url: "https://www.apa.org/topics/mindfulness/meditation" },
{ title: "How ‘Holding Space’ Can Help Reduce Anxiety and Stress", description: "Radical self-care: holding space for yourself and others to ease loneliness.", url: "https://www.healthline.com/health-news/holding-space-meaning-boost-mental-health" },
{ title: "Stress Management: Meditation, Relaxation, Health Benefits", description: "Expert techniques—exercise, guided relaxation—to lower daily stress.", url: "https://my.clevelandclinic.org/health/treatments/6409-stress-management-and-emotional-health" },
{ title: "My Pandemic Resilience Journey", description: "A personal story of coping strategies and help-seeking during COVID-19.", url: "https://www.healthline.com/nutrition/mental-health-pandemic-story" },
{ title: "Mindfulness, Stress & Work Engagement", description: "Study showing mindfulness predicts lower stress and better focus at work.", url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.724126/full" },
{ title: "Recognize Emotional Distress: 5 Tips to Cope", description: "Steps—acceptance, self-talk, journaling—to manage acute emotional distress.", url: "https://www.healthline.com/health/mental-health/emotional-distress" },
{ title: "Managing Stress | Mental Health – CDC", description: "Official CDC guidance on daily healthy habits to cope with stress.", url: "https://www.cdc.gov/mental-health/living-with/index.html" },
{ title: "Can Yogurt Bacteria Improve Your Mental Health?", description: "New research on Lactobacillus in fermented foods reducing depression.", url: "https://www.healthline.com/health-news/yogurt-may-help-reduce-depression" },
{ title: "Ecotherapy: Types, Benefits, DIY Tips", description: "Forest bathing and outdoor activities as therapeutic tools.", url: "https://www.healthline.com/health/mental-health/ecotherapy" },
{ title: "6 Effective Ways to Clear Your Mind", description: "Practical tips—journaling, mini-meditations, social connection—to stop rumination.", url: "https://www.verywellmind.com/how-can-i-clear-my-mind-3144602" },
{ title: "How to Be Mindful if You Hate Meditating", description: "Alternative mindfulness tactics for skeptics and busy beginners.", url: "https://time.com/6249527/how-to-be-mindful-hate-meditating/" },
// Append these 20 new entries to your existing `Articles.items` array:

{ title: "One Conversation With Friends Per Day Helps Mental Health", description: "Study reveals daily social interaction significantly reduces anxiety and depression.", url: "https://www.verywellmind.com/future-of-mental-health-care-5199120" },
{ title: "The Connection Between Cleanliness and Mental Health", description: "How decluttering can decrease stress and improve focus.", url: "https://www.verywellmind.com/how-mental-health-and-cleaning-are-connected-5097496" },
{ title: "The Youth Mental Health Crisis Needs Our Attention", description: "Exploration of the mental health impact on children post-pandemic.", url: "https://www.healthline.com/health-news/the-youth-mental-health-crisis-needs-our-attention" },
{ title: "Mental Health Benefits of Exercise: For Depression and More", description: "Regular physical activity boosts mental health, cognition, and self-confidence.", url: "https://www.healthline.com/health/depression/exercise" },
{ title: "How Improving Your Mental Health Helps Physical Health", description: "Strong correlation between mental wellness and overall physical health.", url: "https://www.healthline.com/health-news/how-improving-your-mental-health-will-help-your-overall-physical-health" },
{ title: "How Your Environment Affects Your Mental Health", description: "Impact of light, noise, air quality, and surroundings on mood and stress.", url: "https://www.verywellmind.com/how-your-environment-affects-your-mental-health-5093687" },
{ title: "Diet and Mental Health: Can What You Eat Affect How You Feel?", description: "Whole foods linked to improved mood and life satisfaction.", url: "https://www.healthline.com/nutrition/diet-and-mental-health-can-what-you-eat-affect-how-you-feel" },
{ title: "The Importance of Mental Health for Well-Being", description: "Overview of mental health’s role in emotional, social, and psychological functioning.", url: "https://www.verywellmind.com/the-importance-of-mental-health-for-wellbeing-5207938" },
{ title: "How We Can Change the Stigma Around Mental Health", description: "Steps to reduce public, self, and institutional stigma.", url: "https://www.healthline.com/health/mental-health/mental-health-stigma-examples" },
{ title: "A Mind Reading for 2025: Gen Z Mental Health Trends", description: "New survey data highlights mental health challenges and needs of Gen Z.", url: "https://www.verywellmind.com/mind-reading-2025-trends-8762268" },
{ title: "Why It’s Time to Shift Focus to Mental Health in the Black Community", description: "Culturally-aware insights on barriers and progress in Black mental health care.", url: "https://www.healthline.com/health/mental-health/mental-health-in-the-black-community" },
{ title: "What Mental Health Actually Means", description: "Defines mental health and its key components and contributors.", url: "https://www.verywellmind.com/what-is-mental-health-2330755" },
{ title: "The Importance of Mental Fitness", description: "Practices for maintaining mental agility and emotional well-being.", url: "https://www.healthline.com/health/depression/mental-fitness" },
{ title: "How Social Isolation Can Damage Your Mental Health", description: "Loneliness and isolation can increase anxiety, depression, and emotional dysregulation.", url: "https://www.verywellmind.com/the-impact-of-social-isolation-on-mental-health-7185458" },
{ title: "Recognizing & Treating a Nervous (Mental) Breakdown", description: "Signs, symptoms, causes, and tips for recovery.", url: "https://www.healthline.com/health/mental-health/nervous-breakdown" },
{ title: "Social Support Contributes to Psychological Health", description: "Having friends/family to rely on bolsters mental resilience.", url: "https://www.verywellmind.com/social-support-for-psychological-health-4119970" },
{ title: "Types of Therapy: A to Z List of Your Options", description: "Overview of CBT, DBT, ACT, psychodynamic, family therapy, and more.", url: "https://www.verywellmind.com/types-of-therapy-8402567" },
{ title: "Filling Your Mental Health Toolbox With Dr. Rachel Goldman", description: "Simple, daily self-care practices reinforcing mental wellness.", url: "https://www.verywellmind.com/filling-your-mental-health-toolbox-with-dr-rachel-goldman-5199795" },
{ title: "5 Self-Care Mistakes That Leave You Emotionally Exhausted", description: "Common pitfalls in self-care—how to avoid overreacting, sabotage, and burnout.", url: "https://www.verywellmind.com/why-your-self-care-routine-isnt-working-7368113" },
{ title: "Best Online Bipolar Disorder Support Groups", description: "Curated list of reputable peer-support platforms for the bipolar community.", url: "https://www.verywellmind.com/best-online-bipolar-disorder-support-groups-4802211" }


    ]
  },
  {
    category: "YouTube Videos",
    items: [
      { title: "Understanding Anxiety", url: "https://youtu.be/9mPwQTiMSj8?si=1vEjy6qleWvqt_yB", description: "A comprehensive guide to understanding anxiety." },
      { title: "Coping with Depression", url: "https://youtu.be/lQhpetkwWnM?si=hpRGymJT_CEVg5WY", description: "Learn practical strategies for managing depression." },
      { title: "Mindfulness for Anxiety", url: "https://youtu.be/v-w-vSvi-24?si=gf9fvvOLUI43wgVP", description: "An introductory session on mindfulness techniques to manage anxiety." },
      { title: "We All Have Mental Health", url: "http://www.youtube.com/watch?v=DxIDKZHW3-E", description: "Anna Freud explores why mental health matters for everyone." },
      { title: "Physical and Mental Health", url: "http://www.youtube.com/watch?v=EKEWk4oWmjY", description: "Psych Hub discusses the link between physical and mental well-being." },
      { title: "Talking Mental Health", url: "http://www.youtube.com/watch?v=nCrjevx3-Js", description: "Anna Freud emphasizes open conversations about mental health." },
      { title: "Why Students Need Mental Health Days", url: "http://www.youtube.com/watch?v=3k_wxTkYN50", description: "Hailey Hardcastle on why schools should support mental health breaks." },
      { title: "5 Ways to Help Someone Struggling", url: "http://www.youtube.com/watch?v=wIUcc8g17wg", description: "BBC Ideas offers practical tips to support those with mental health challenges." },
      { title: "The Science of Anxiety & Fear", url: "https://www.youtube.com/watch?v=a-ddVEYaEL8", description: "AsapSCIENCE breaks down the biology of anxiety and fear responses." },
      { title: "How to Deal with Depression & Anxiety", url: "https://www.youtube.com/watch?v=ZSt9tm3RoUU", description: "Kati Morton, a licensed therapist, shares coping strategies." },
      { title: "Mental Health: Crash Course Psychology #28", url: "https://www.youtube.com/watch?v=wuhJ-GkRRQc", description: "Crash Course overview of mental health disorders and treatments." },
      { title: "The Power of Vulnerability", url: "https://www.youtube.com/watch?v=iCvmsMzlF7o", description: "Brené Brown on embracing vulnerability to foster connection." },
      { title: "How to Make Stress Your Friend", url: "https://www.youtube.com/watch?v=RcGyVTAoXEU", description: "Kelly McGonigal reframes stress as a positive force." },
      { title: "Depression, The Secret We Share", url: "https://www.youtube.com/watch?v=n0wH-3gAeRM", description: "Andrew Solomon's personal account of battling depression." },
      { title: "What Makes a Good Life?", url: "https://www.youtube.com/watch?v=8KkKuTCFvzI", description: "Robert Waldinger on insights from the Harvard Study of Adult Development." },
      { title: "My Story of Overcoming Anxiety & Depression", url: "https://www.youtube.com/watch?v=La9oLLoI5Rc", description: "Kati Morton shares her journey to mental well-being." },
      { title: "How to Train Your Brain to Be Happy", url: "https://www.youtube.com/watch?v=s9N-S3MBaHw", description: "Dr. Caroline Leaf on rewiring your mind for positivity." },
      { title: "7 Types of Self-Care Activities", url: "https://www.youtube.com/watch?v=dIGkXqy8o1A", description: "Psych2Go presents simple self-care practices." },
      { title: "The Importance of Mental Health Awareness", url: "https://www.youtube.com/watch?v=3wTkFIpW2Gw", description: "TEDx Talk on breaking stigma and promoting awareness." },
      { title: "Breathing Techniques for Anxiety Relief", url: "https://www.youtube.com/watch?v=aX7jnVXXG5E", description: "Easy breathwork exercises to calm your mind." },
      { title: "How to Build Self-Esteem", url: "https://www.youtube.com/watch?v=N-RPiowRboQ", description: "Tips and exercises to boost confidence and self-worth." },
      { title: "Gratitude: The Short Film", url: "https://www.youtube.com/watch?v=gXDMoiEkyuQ", description: "A short film on cultivating gratitude for well-being." },
      { title: "The Surprising Habits of Original Thinkers", url: "https://www.youtube.com/watch?v=fxbCHn6gE3U", description: "Adam Grant on nurturing creativity and originality." },
      { title: "The Happy Secret to Better Work", url: "https://www.youtube.com/watch?v=fLJsdqxnZb0", description: "Shawn Achor on positive psychology at work." },
      { title: "How to Stop Screwing Yourself Over", url: "https://www.youtube.com/watch?v=Lp7E973zozc", description: "Mel Robbins' strategies to break negative habits." },
      { title: "Inside the Mind of a Master Procrastinator", url: "https://www.youtube.com/watch?v=arj7oStGLkU", description: "Tim Urban's comedic take on beating procrastination." },
      { title: "The Art of Being Yourself", url: "https://www.youtube.com/watch?v=veEQQ-N9xWU", description: "Caroline McHugh on authenticity and self-acceptance." },
      { title: "Your Body Language May Shape Who You Are", url: "https://www.youtube.com/watch?v=Ks-_Mh1hMc", description: "Amy Cuddy on power posing and confidence." },
      // Append these 20 new video entries to your existing YouTube “items” array:

{ title: "This Could Be Why You’re Depressed or Anxious — Johann Hari (TED)", url: "https://www.youtube.com/watch?v=MB5IX-np5fE", description: "Johann Hari explores societal contributors to depression and anxiety, backed by scientific evidence." },
{ title: "5 Proven Strategies to Boost Your Mental Health Today", url: "https://www.youtube.com/watch?v=vGgDIPMyP2g", description: "Short, actionable tips—like mindful breathing and screen-time reduction—by Therapy in a Nutshell." },
{ title: "Battling Depression, Anxiety, and the Mental Health Stigma (TEDx)", url: "https://www.youtube.com/watch?v=ZEkL258MRwA", description: "Personal stories and stigma-busting insights from mental health advocates." },
{ title: "Learning to Live with Clinical Depression — Angelica Galluzzo", url: "https://www.youtube.com/watch?v=Izy1TgMe-tI", description: "A candid, first-hand account of daily life with chronic depression." },
{ title: "3 Mental Wellness Tips — Psych Hub", url: "https://www.youtube.com/watch?v=SBJ19oO8WDc", description: "Expert Matt Morrison shares practical ways to support mental well-being." },
{ title: "How to Make Anxiety Your Friend — David H. Rosmarin (TED)", url: "https://www.youtube.com/watch?v=cTnPqgL8ZPs", description: "Reframes anxiety, offering four actionable steps to harness its power." },
{ title: "5 Habits That BOOST Your Mental Health", url: "https://www.youtube.com/watch?v=yci8v0vP15o", description: "Science-based daily habits to strengthen mental well-being." },
{ title: "Are Your Coping Mechanisms Healthy? — Andrew Miki (TED)", url: "https://www.youtube.com/watch?v=XTlDS7ju_28", description: "A psychologist examines how to identify and shift unhealthy coping habits." },
{ title: "6 Mental Health Tips for Stress and Anxiety", url: "https://www.youtube.com/watch?v=DEGbZQ3pIFM", description: "Simple yet effective coping strategies for stress relief." },
{ title: "How to Do Laundry When You're Depressed — KC Davis (TEDx)", url: "https://www.youtube.com/watch?v=M1O_MjMRkPg", description: "A humorous-yet-real take on accomplishing everyday tasks during depression." },
{ title: "Top Tips for Stress-Free Mental Health Documentation", url: "https://www.youtube.com/watch?v=z2gXO50kWC4", description: "Essential advice from a therapist on maintaining good self-care documentation." },
{ title: "How Leaders Can Help Battle Anxiety and Depression", url: "https://www.youtube.com/watch?v=BGv1PfCSIyU", description: "Steve Arveschoug discusses mental health support strategies in the workplace." },
{ title: "Mental Health Tips For Physical Therapists", url: "https://www.youtube.com/watch?v=hYJanMHbkIk", description: "Guidance on balancing mental health while caring for others." },
{ title: "How to Recognize Perfectly Hidden Depression — Margaret Rutherford (TEDx)", url: "https://www.youtube.com/watch?v=lXZ5Bo5lafA", description: "Help recognizing subtle signs of depression in yourself and others." },
{ title: "Powerful Coping Skills for Anxiety (Short)", url: "https://www.youtube.com/watch?v=IRMBjOdcOOA", description: "Condensed, practical anxiety-management tools shared by a licensed therapist." },
{ title: "Why You Should Talk About Your Anxiety at Work — Adam Whybrew", url: "https://www.youtube.com/watch?v=4FT5RYuifwE", description: "Encouraging open dialogue about mental health in professional environments." },
{ title: "My Honest Advice for Managing Your Mental Health (7 Hacks)", url: "https://www.youtube.com/watch?v=7Pk9u6PXvvE", description: "A content creator outlines seven realistic daily mental health habits." },
{ title: "Feed Your Mental Health — Drew Ramsey (TEDxCharlottesville)", url: "https://www.youtube.com/watch?v=BbLFsQubdtw", description: "Drew Ramsey highlights the role of nutrition in mental health." },
{ title: "Therapists Share Their Stress Relief and Self-Care Tips", url: "https://www.youtube.com/watch?v=PiWVZtURDTY", description: "Licensed professionals discuss evidence-based self-care strategies." },
{ title: "The Surprisingly Dramatic Role of Nutrition in Mental Health — Julia Rucklidge (TEDxChristchurch)", url: "https://www.youtube.com/watch?v=3dqXHHCc5lA", description: "Julia Rucklidge explores the powerful impact of nutrition on mental well-being." }

    ]
  },
  {
    category: "Books",
    items: [
      { title: "The Body Keeps the Score", description: "Brain, Mind, and Body in the Healing of Trauma by Bessel van der Kolk M.D.", url: "https://www.goodreads.com/book/show/18693771-the-body-keeps-the-score" },
      { title: "Feeling Good: The New Mood Therapy", description: "By David D. Burns, M.D. – Classic cognitive therapy techniques.", url: "https://www.goodreads.com/book/show/46510.Feeling_Good" },
      { title: "Mind Over Mood", description: "Change How You Feel by Changing the Way You Think by Dennis Greenberger & Christine Padesky.", url: "https://www.goodreads.com/book/show/664981.Mind_Over_Mood" },
      { title: "Lost Connections", description: "Uncovering the Real Causes of Depression by Johann Hari.", url: "https://www.goodreads.com/book/show/35500919-lost-connections" },
      { title: "The Happiness Trap", description: "How to Stop Struggling and Start Living by Russ Harris.", url: "https://www.goodreads.com/book/show/9172054-the-happiness-trap" },
      { title: "The Anxiety and Phobia Workbook", description: "Practical exercises for anxiety relief by Edmund Bourne.", url: "https://www.goodreads.com/book/show/269423.The_Anxiety_and_Phobia_Workbook" },
      { title: "Daring Greatly", description: "How the Courage to Be Vulnerable Transforms by Brené Brown.", url: "https://www.goodreads.com/book/show/13530930-daring-greatly" },
      { title: "Man's Search for Meaning", description: "Viktor E. Frankl’s classic on finding purpose.", url: "https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning" },
      { title: "Emotional Intelligence", description: "Why It Can Matter More Than IQ by Daniel Goleman.", url: "https://www.goodreads.com/book/show/26329.Emotional_Intelligence" },
        { title: "Getting Past Your Past", description: "Explains EMDR therapy and how to heal from traumatic memories.", url: "https://www.goodreads.com/book/show/799600.Getting_Past_Your_Past" },
  { title: "Waking the Tiger: Healing Trauma", description: "A somatic approach to trauma recovery, emphasizing body-based healing.", url: "https://en.wikipedia.org/wiki/Waking_the_Tiger" },
  { title: "Full Catastrophe Living", description: "Foundational guide to Mindfulness-Based Stress Reduction (MBSR).", url: "https://en.wikipedia.org/wiki/Full_Catastrophe_Living" },
  { title: "Unfuck Your Brain", description: "Science-backed strategies to manage anxiety, depression, and stress.", url: "https://www.goodreads.com/book/show/34817659-unf*ck-your-brain" },
  { title: "The Soul of Shame", description: "Explores how shame shapes identity—and how to heal through connection.", url: "https://www.goodreads.com/book/show/26370318-the-soul-of-shame" },
  { title: "Try Softer", description: "Gentle, relationship-focused methods for overcoming anxiety and burnout.", url: "https://www.goodreads.com/book/show/42923885-try-softer" },
  { title: "Me, Myself, and Us", description: "Personality insights and their impact on emotional well-being.", url: "https://www.goodreads.com/book/show/13498980-me-myself-and-us" },
  { title: "The Four Agreements", description: "A transformative guide to personal freedom through self-understanding.", url: "https://www.goodreads.com/book/show/6596.The_Four_Agreements" },
  { title: "The Upward Spiral", description: "Neuroscience approach to systematically lift mood and reduce depression.", url: "https://www.goodreads.com/book/show/17261895-the-upward-spiral" },
  { title: "Feeling Great", description: "Advanced CBT techniques to build lasting joy and preempt depression relapse.", url: "https://www.goodreads.com/book/show/29822541-feeling-great" },
  { title: "This Is Depression", description: "Compassionate yet practical guide clarifying what depression really is.", url: "https://www.goodreads.com/book/show/57565888-this-is-depression" },
  { title: "Maybe You Should Talk to Someone", description: "Insightful memoir and therapy dispatches offering deep emotional clarity.", url: "https://www.goodreads.com/book/show/37993652-maybe-you-should-talk-to-someone" },
  { title: "Your Happiness Toolkit", description: "Integrates CBT, mindfulness, and acceptance for daily emotional resilience.", url: "https://www.goodreads.com/book/show/56287025-your-happiness-toolkit" },
  { title: "101 Ways to Be Less Stressed", description: "Short, structured strategies to calm your mind and body.", url: "https://www.goodreads.com/book/show/58409917-101-ways-to-be-less-stressed" },
  { title: "Grief Works", description: "Warm, psychologically-informed guidance for processing grief.", url: "https://www.goodreads.com/book/show/53950298-grief-works" },
  { title: "Post Traumatic Slave Syndrome", description: "Explores multigenerational trauma and paths toward healing communities.", url: "https://www.goodreads.com/book/show/15440618-post-traumatic-slave-syndrome" },
  { title: "The Unapologetic Guide to Black Mental Health", description: "Tools for navigating mental health within and outside the Black community.", url: "https://www.goodreads.com/book/show/24592622-the-unapologetic-guide-to-black-mental-health" },
  { title: "My Grandmother’s Hands", description: "Somatic exploration of racialized trauma and collective healing.", url: "https://www.goodreads.com/book/show/43092310-my-grandmother-s-hands" },
  { title: "Drama Free", description: "Essential guide to boundary setting and healthy relationships.", url: "https://www.goodreads.com/book/show/40582417-drama-free" },
  { title: "Set Boundaries, Find Peace", description: "Practical framework for establishing emotional safety in relationships.", url: "https://www.goodreads.com/book/show/41180053-set-boundaries-find-peace" }

    ]
  }
];

const getCategoryIcon = (category) => {
  switch (category) {
    case "Articles": return <BookOpen className="icon" />;
    case "Hotlines": return <Phone className="icon" />;
    case "YouTube Videos": return <Youtube className="icon" />;
    case "Books": return <BookOpen className="icon" />;
    default: return null;
  }
};

const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );
  useEffect(() => {
    const handleThemeChange = () => setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);
  return isDarkMode;
};

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("Articles");
  const [searchTerm, setSearchTerm] = useState("");
  const isDarkMode = useTheme();

  const containerStyle = { padding: '20px' };
  const headingStyle = { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: isDarkMode ? '#fff' : '#000' };
  const buttonStyle = (category) => ({ margin: '0 10px', padding: '10px 20px', cursor: 'pointer', background: activeTab === category ? '#007bff' : '#f0f0f0', color: activeTab === category ? '#fff' : '#000', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center' });
  const cardStyle = { backgroundColor: isDarkMode ? '#333' : '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '300px' };
  const titleStyle = { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: isDarkMode ? '#fff' : '#000' };
  const descriptionStyle = { marginBottom: '15px', color: isDarkMode ? '#ddd' : '#333' };
  const linkStyle = { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' };

  const filteredItems = resources.find(r => r.category === activeTab)?.items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={containerStyle}>
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} style={headingStyle}>
        Mental Health Resources
      </motion.h1>
      <motion.div style={{ display: 'flex', marginBottom: '20px' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {resources.map((res, i) => (
          <motion.button key={res.category} onClick={() => setActiveTab(res.category)} style={buttonStyle(res.category)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
            {getCategoryIcon(res.category)}<span style={{ marginLeft: '8px' }}>{res.category}</span>
          </motion.button>
        ))}
      </motion.div>
      <motion.div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <label htmlFor="searchInput"><Search className="icon" style={{ marginRight: '8px', color: isDarkMode ? '#fff' : '#000' }} /></label>
        <input id="searchInput" type="text" placeholder="Search resources..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
      </motion.div>
      {filteredItems.length > 0 ? (
        <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          {filteredItems.map((item, idx) => (
            <motion.div key={idx} style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <h3 style={titleStyle}>{item.title}</h3>
              <p style={descriptionStyle}>{item.description}</p>
              {item.url && <motion.a href={item.url} target="_blank" rel="noopener noreferrer" style={linkStyle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{activeTab === "YouTube Videos" ? "Watch Video" : "Read More"}</motion.a>}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ color: isDarkMode ? '#ddd' : '#333' }}>
          No resources found matching your search.
        </motion.p>
      )}
    </motion.div>
  );
}