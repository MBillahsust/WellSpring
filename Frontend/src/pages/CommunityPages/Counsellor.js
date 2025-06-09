import React, { useState } from 'react';
import { motion } from 'framer-motion';

function PhoneIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function Counsellor() {
  const [selectedCity, setSelectedCity] = useState('All');

  const majorCities = [
    'All', 'Dhaka', 'Chittagong', 'Khulna', 'Sylhet', 'Rajshahi', 'Rangpur', 'Barisal', 'Mymensingh', 'Comilla', 'Narayanganj', 'Gazipur',
    
    'Bogra', 'Dinajpur', 'Joypurhat', 'Naogaon', 'Natore', 'Nawabganj', 'Pabna', 'Sirajganj', 
    'Thakurgaon', 'Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cox\'s Bazar', 'Cumilla', 'Feni', 
    'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati', 'Faridpur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 
    'Manikganj', 'Munshiganj', 'Narail', 'Rajbari', 'Shariatpur', 'Tangail', 'Bagerhat', 'Chuadanga', 'Jashore', 
    'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira', 'Jamalpur', 'Mymensingh', 
    'Netrokona',   
    'Sherpur', 'Barguna', 'Barisal', 'Bhola', 'Jhalakathi', 'Patuakhali', 'Pirojpur', 'Habiganj', 
    'Moulvibazar', 'Sunamganj', 'Sylhet'
  ];

  const filteredProfiles = selectedCity === 'All' 
    ? profiles 
    : profiles.filter(profile => profile.city === selectedCity);

  return (
    <section className="py-10 px-4 md:px-10 bg-gradient-to-br from-blue-50 to-white min-h-screen font-sans">
      <motion.h2 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-900 drop-shadow-lg"
      >
        Our Psychiatrists
      </motion.h2>

      <div className="flex justify-center mb-8">
        <select 
          value={selectedCity} 
          onChange={e => setSelectedCity(e.target.value)}
          className="px-4 py-2 rounded-lg border border-blue-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none text-blue-900 bg-white"
        >
          {majorCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProfiles.map((profile, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            className="rounded-2xl bg-white shadow-lg p-6 border border-blue-100 transition-all duration-300 hover:shadow-2xl"
          >
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-1">{profile.name}</h3>
              <p className="text-blue-600 font-medium mb-1">{profile.title}</p>
              <p className="text-gray-600 text-sm mb-1">{profile.position}</p>
              <p className="text-gray-500 text-xs mb-1">{profile.teaches}</p>
              <p className="text-blue-500 text-sm flex items-center mb-1">
                <MapPinIcon className="inline-block mr-1 text-blue-400" />
                {profile.city}
              </p>
              {profile.phone && (
                <p className="text-blue-500 text-sm flex items-center mb-1">
                  <PhoneIcon className="inline-block mr-1 text-blue-400" />
                  {profile.phone}
                </p>
              )}
            </div>
            <Collapsible>
              <CollapsibleTrigger>
                <Button variant="outline" className="mt-4 px-4 py-2 border border-blue-400 text-blue-700 rounded-lg hover:bg-blue-50 transition-all">
                  <ChevronDownIcon className="inline-block mr-1" />
                  View Chambers
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3">
                  {profile.chambers.map((chamber, idx) => (
                    <div key={idx} className="flex items-center text-gray-700 text-sm mb-2">
                      <MapPinIcon className="inline-block mr-1 text-blue-400" />
                      <span>{chamber}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const profiles = [
  {
    name: "Prof. Dr. Md. Rezaul Karim",
    title: "MBBS, FCPS (Psychiatry), MS (USA)",
    position: "Psychiatry (Brain, Mental Diseases, Drug Addiction) Specialist",
    teaches: "Former Professor & Head, Psychiatry, Sylhet MAG Osmani Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Zindabazar Point, Sylhet", "Osmani Medical College Campus, Sylhet"],
    phone: "+8801712345678"
  },
  {
    name: "Prof. Dr. Gopi Kanta Roy",
    title: "MBBS, FCPS (Psychiatry), WHO Fellow (India)",
    position: "Psychiatry (Mental Diseases, Depression, Drug Addiction) Specialist",
    teaches: "Professor (Ex), Psychiatry, Jalalabad Ragib-Rabeya Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Amborkhana Point, Sylhet"],
    phone: "+8801912345678"
  },
  {
    name: "Dr. Siddhartha Paul",
    title: "MBBS, M.Phil (Psychiatry)",
    position: "Psychiatry (Brain, Mental Diseases, Drug Addiction) Specialist",
    teaches: "Associate Professor, Psychiatry, North East Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Chowhatta, Sylhet", "North East Medical College Campus, Sylhet"],
    phone: "+8801320932211"
  },
  {
    name: "Dr. RKS Royel",
    title: "MBBS, BCS (Health), M.Phil (Psychiatry)",
    position: "Psychiatry (Brain, Mind, Depression, Drug Addiction) Specialist",
    teaches: "Assistant Professor & Head, Psychiatry, Sylhet MAG Osmani Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Bondor Bazar, Sylhet", "Osmani Medical College Campus, Sylhet"],
    phone: "+8801843829102"
  },
  {
    name: "Dr. Susmita Roy",
    title: "MBBS, M.Phil (Psychiatry)",
    position: "Brain, Mental & Drug Addiction Specialist",
    teaches: "Associate Professor, Psychiatry, Jalalabad Ragib-Rabeya Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Uposhohor, Sylhet"],
    phone: "+8801320932211"
  },
  {
    name: "Dr. Ahmad Riad Chowdhury",
    title: "MBBS, M.Phil (Psychiatry)",
    position: "Psychiatry (Mental Diseases, Headache, Drug Addiction) Specialist",
    teaches: "Assistant Professor, Psychiatry, Sylhet MAG Osmani Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Mirzajangal, Sylhet", "Osmani Medical College Campus, Sylhet"],
    phone: "+8801843829102"
  },
  {
    name: "Dr. Mohammad Humayun Kabir",
    title: "MBBS (SSMC), MD (Psychiatry, BSMMU), Trained in Sexual Medicine (South Asian Society of Sexual Medicine)",
    position: "Psychiatry (Brain, Mind, Medicine & Sex and Drug Addiction Specialist)",
    teaches: "Former Resident Doctor, Psychiatry, Consultant: Shahjalal Mental Health & Research Center, Akhalia, Sylhet, Former Psychiatrist (MD Resident), Dept. of Psychiatry, Sylhet MAG Osmani College Hospital",
    city: "Sylhet",
    chambers: ["Akhalia, Sylhet", "Shahjalal Mental Health & Research Center, Sylhet"],
    phone: "+8801672930123"
  },
  {
    name: "Prof. Dr. Md. Shafiqur Rahman",
    title: "MBBS, M.Phil (Psychiatry)",
    position: "Psychiatry (Brain, Mental Diseases, Drug Addiction) Specialist",
    teaches: "Professor & Head, Psychiatry, Sylhet Womens Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Shibgong, Sylhet", "Sylhet Womens Medical College Campus, Sylhet"],
    phone: "+8801521389023" 
  },
  {
    name: "Dr. Shamsul Haque Chowdhury",
    title: "MBBS, M.Phil (Psychiatry)",
    position: "Psychiatry (Brain, Mental Diseases, Drug Addiction) Specialist",
    teaches: "Assistant Professor (Ex), Psychiatry, Sylhet MAG Osmani Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Subhanighat, Sylhet", "Osmani Medical College Campus, Sylhet"],
    phone: "+8801311923012"
  },
  {
    name: "Dr. Rezwana Habiba",
    title: "MBBS, BCS (Health), MD (Psychiatry)",
    position: "Mental Diseases, Sexual Health, Parenting Specialist & Psychotherapist",
    teaches: "Consultant, Psychiatry, Sylhet MAG Osmani Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Kumarpara, Sylhet", "Osmani Medical College Campus, Sylhet"],
    phone: "+8801982310987"
  },
  {
    name: "Prof. Dr. Dipendra Narayan Das",
    title: "MBBS (CU), M.Phil (Psychiatry)",
    position: "Psychiatry (Brain, Mind, Depression, Drug Addiction) Specialist",
    teaches: "Professor & Head, Psychiatry, Parkview Medical College & Hospital, Sylhet",
    city: "Sylhet",
    chambers: ["Menonbagh, Sylhet", "Parkview Medical College Campus, Sylhet"],
    phone: "+8801784396499"
  },
  {
    name: "Dr. Md. Abdullah Sayed",
    title: "MBBS, MD (Psychiatry)",
    position: "Psychiatry (Brain, Mind, Mental Diseases, Depression) Specialist",
    teaches: "Assistant Professor, Psychiatry, North East Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Uttara Model Town, Sylhet", "North East Medical College Campus, Sylhet"],
    phone: "+8801450612851"
  },
  {
    name: "Dr. Md. Enayet Karim",
    title: "MBBS, M.Phil (Psychiatry)",
    position: "Psychiatry (Brain, Mind, Depression, Drug Addiction) Specialist",
    teaches: "Assistant Professor, Psychiatry, Jalalabad Ragib-Rabeya Medical College & Hospital",
    city: "Sylhet", 
    chambers: ["Modina Market, Sylhet"],
    phone: "+8801825461388"
  },
  {
    name: "Dr. Md. Shafiul Islam",
    title: "MBBS, PGT (Medicine), M.Phil (Psychiatry)",
    position: "Psychiatry (Brain, Mental Diseases, Drug Addiction) Specialist",
    teaches: "Associate Professor & Head, Psychiatry, Jalalabad Ragib-Rabeya Medical College & Hospital",
    city: "Sylhet",
    chambers: ["Keranigonj, Sylhet"],
    phone: "+8801515768392"
  },
  {
    name: "Dr. Ayesha Rahman",
    title: "MBBS, FCPS (Psychiatry)",
    position: "Child & Adolescent Psychiatrist",
    teaches: "Teaches at Dhaka Medical College",
    city: "Dhaka",
    chambers: ["Dhanmondi, Dhaka", "Gulshan, Dhaka"],
    phone: "+8801977433953"
  },
  {
    name: "Dr. Farhan Ahmed",
    title: "MBBS, MD (Psychiatry)",
    position: "Addiction Psychiatrist",
    teaches: "Teaches at Chittagong Medical College",
    city: "Chittagong",
    chambers: ["Agrabad, Chittagong", "GEC Circle, Chittagong"],
    phone: "+8801855678577"
  },
  {
    name: "Prof. Brig. Gen. Dr. Kumrul Hasan",
    title: "MBBS, MCPS, MPHIL (Psychiatry), MMEd, Fellow Child Psychiatry (Pakistan), MACP (USA), FRCP (UK)",
    position: "Psychiatry, Brain, Drug Addiction, Sex Specialist & Neuro Psychiatrist, Adviser Specialist",
    teaches: "Psychiatry",
    city: "Dhaka",
    chambers: ["Combined Military Hospital, Dhaka"],
    phone: "+8801722568931"
  },
  {
    name: "Dr. Redwana Hossain",
    title: "MBBS, BCS (Health), MD (Psychiatry)",
    position: "Psychiatry, Drug Addiction, Dementia & Female Psychosexual Disorder Specialist",
    teaches: "Assistant Professor, Psychiatry, Shaheed Suhrawardy Medical College & Hospital",
    city: "Dhaka",
    chambers: ["Shaheed Suhrawardy Medical College & Hospital"],
    phone: "+8801933746102"
  },
  {
    name: "Prof. Dr. Nahid Mahjabin Morshed",
    title: "MBBS, MSc (DU), M.Phil (Psychiatry), Fellow (WPA, Australia)",
    position: "Mental Diseases, Brain & Drug Addiction Specialist, Professor, Child & Adolescent Psychiatry, Chairman",
    teaches: "Department of Psychiatry, Bangabandhu Sheikh Mujib Medical University Hospital",
    city: "Dhaka",
    chambers: ["Bangabandhu Sheikh Mujib Medical University Hospital"],
    phone: "+8801755239841"
  },
  {
    name: "Dr. Mekhala Sarkar",
    title: "MBBS, FCPS (Psychiatry), Fellow WPA (Turkey), International Fellow, American Psychiatric Association (USA)",
    position: "Mental Health Specialist & Psychiatrist, Associate Professor",
    teaches: "Psychiatry, National Institute of Mental Health & Hospital",
    city: "Dhaka", 
    chambers: ["National Institute of Mental Health & Hospital"],
    phone: "+8801922653014"
  },
  {
    name: "Prof. Dr. M. A. Mohit Kamal",
    title: "MBBS, MPhil (Psychiatry), PhD (Psychiatry), FWPA (USA), CME-WCP",
    position: "Psychiatry (Mental Diseases) Specialist & Psychotherapist, Director & Professor",
    teaches: "Psychiatry, National Institute of Mental Health & Hospital",
    city: "Dhaka", 
    chambers: ["National Institute of Mental Health & Hospital"],
    phone: "+8801633890721"
  },
  {
    name: "Prof. Dr. Jhunu Shamsun Nahar",
    title: "MBBS, FCPS (Psychiatry), International Fellow of American Psychiatric Association (USA)",
    position: "Psychiatrist & Psychotherapist, Ex. Professor & Chairman",
    teaches: "Psychiatry, Bangabandhu Sheikh Mujib Medical University Hospital",
    city: "Dhaka",
    chambers: ["Bangabandhu Sheikh Mujib Medical University Hospital"],
    phone: "+8801744932106"
  },
  {
    name: "Prof. Dr. Md. Shah Alam",
    title: "MBBS, FCPS (Psychiatry)",
    position: "Mental Diseases, Drug Addiction, Sexual Health Specialist & Psychotherapist, Former Professor & Head",
    teaches: "Psychotherapy, National Institute of Mental Health & Hospital",
    city: "Dhaka", 
    chambers: ["National Institute of Mental Health & Hospital"],
    phone: "+8801302856193"
  },
  {
    name: "Brig. Gen. Prof. Dr. Md. Azizul Islam",
    title: "MBBS, FCPS (PSY), FRCP (UK), FACP (USA)",
    position: "Mental Diseases, Drug Addiction & Psychiatry Specialist, Professor & Head",
    teaches: "Psychiatry, Armed Forces Medical College, Dhaka",
    city: "Dhaka",
    chambers: ["Armed Forces Medical College, Dhaka"],
    phone: "+8801966201354"
  },
  {
    name: "Prof. Dr. Md. Mohsin Ali Shah",
    title: "MBBS, M.Phil (Psychiatry), MD (Psychiatry)",
    position: "Mental Diseases, Drug Addiction, Sex Medicine & Psychiatry Specialist, Professor",
    teaches: "Psychiatry, Bangabandhu Sheikh Mujib Medical University Hospital",
    city: "Dhaka",
    chambers: ["Bangabandhu Sheikh Mujib Medical University Hospital"],
    phone: "+8801733049281"
  },
  {
    name: "Prof. Md. Waziul Alam Chowdhury",
    title: "MBBS, FCPS (Psychiatry), MACP (USA), WHO Fellowship (India)",
    position: "Psychiatry & Mental Health Specialist, Professor & Director",
    teaches: "Psychiatry, National Institute of Mental Health & Hospital",
    city: "Dhaka", 
    chambers: ["National Institute of Mental Health & Hospital"],
    phone: "+8801811537902" 
  },
  {
    name: "Prof. Dr. Md. Golam Rabbani",
    title: "MBBS, FCPS (Psychiatry)",
    position: "Mental Diseases, Brain & Drug Addiction Specialist, Former Professor & Head",
    teaches: "Psychiatry, National Institute of Mental Health & Hospital",
    city: "Dhaka", 
    chambers: ["National Institute of Mental Health & Hospital"],
    phone: "+8801766352189"
  },
  {
    name: "Dr. Raisul Islam Parag",
    title: "MBBS (DMC), MD (Psychiatry)",
    position: "Psychiatry (Mental Diseases, Depression, Sexual Problem) Specialist, Registrar",
    teaches: "Psychiatry, Dhaka Medical College & Hospital",
    city: "Dhaka",
    chambers: ["Dhaka Medical College & Hospital"],
    phone: "+8801944820173"
  },
  {
    name: "Dr. Nasim Jahan",
    title: "MBBS, MCPS, FCPS (Psychiatry)",
    position: "Mental Diseases, Brain Disorder & Drug Addiction Specialist, Assistant Professor",
    teaches: "Psychiatry, Birdem General Hospital & Ibrahim Medical College",
    city: "Dhaka", 
    chambers: ["Birdem General Hospital & Ibrahim Medical College"],
    phone: "+8801533927401" 
  },
  {
    name: "Prof. Dr. Nilufer Akhter Jahan",
    title: "MBBS, M.Phil (Psychiatry), MD (Psychiatry)",
    position: "Psychiatry (Mental Diseases, Drug Addiction, Brain Disorder) Specialist, Professor",
    teaches: "Geriatric & Organic Psychiatry, National Institute of Mental Health & Hospital",
    city: "Dhaka", 
    chambers: ["National Institute of Mental Health & Hospital"],
    phone: "+8801318439206"
  },
  {
    name: "Prof. Dr. Md. Abdus Salam",
    title: "MBBS, DPM (DU), MCPS (Psychiatry)",
    position: "Psychiatry (Brain, Mind, Depression, Drug Addiction) Specialist & Psychotherapist, Former Professor",
    teaches: "Psychiatry, Bangabandhu Sheikh Mujib Medical University Hospital",
    city: "Dhaka",
    chambers: ["Bangabandhu Sheikh Mujib Medical University Hospital"],
    phone: "+8801833652140" 
  }
];

function ChevronDownIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Collapsible({ children, className }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${className} ${isOpen ? 'open' : ''}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
}

function CollapsibleTrigger({ children, asChild, isOpen, setIsOpen }) {
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {children}
    </div>
  );
}

function CollapsibleContent({ children, isOpen }) {
  return isOpen ? <div>{children}</div> : null;
}

function Button({ children, variant, className, ...props }) {
  return (
    <button className={`${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}





