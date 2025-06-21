// src/pages/Contact.jsx
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

const teamMembers = [
  {
    name: "Mustakim Billah",
    email: "mbillah.cse.sust20@gmail.com",
    linkedin: "https://www.linkedin.com/in/mustakim-billah-nafees/",
    github: "https://github.com/MBillahsust"
  },
  {
    name: "Arfatul Islam Asif",
    email: "Contact_me_via_linkedin",
    linkedin: "https://www.linkedin.com/in/arfatul-islam-asif-169116279/",
    github: "https://github.com/ArfatulAsif"
  },
  {
    name: "Sanjoy Das",
    email: "sanjoydasjoy2022@gmail.com",
    linkedin: "https://www.linkedin.com/in/sanjoy-das-ba774a22a/",
    github: "https://github.com/sanjoydasjoy"
  }
];

export default function Contact() {
  const [displayedMembers, setDisplayedMembers] = useState([...teamMembers]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % teamMembers.length);
      
      // Rotate the array for circular swapping
      setDisplayedMembers(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 2000); // Rotate every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getGridColumns = () => {
    if (isMobile) {
      // For mobile, show only one card at a time (swapping content)
      return '1fr';
    }
    // For desktop, show all three cards
    return 'repeat(3, 1fr)';
  };

  return (
    <div style={{
      background: '#f7f9fc',
      padding: '60px 16px',
      minHeight: '100vh'
    }}>
      <style>{`
        .card {
          background: #fff;
          max-width: 65vw;
          min-width: 320px;
          margin: 0 auto;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        }
        .section {
          margin-bottom: 32px;
        }
        .section h2 {
          font-size: 1.5rem;
          margin-bottom: 12px;
          color: #007bff;
        }
        .email-line {
          display: flex;
          align-items: center;
          font-size: 1rem;
        }
        .email-line svg {
          margin-right: 8px;
          color: #007bff;
        }
        .blockquote {
          font-style: italic;
          color: #555;
          margin: 0;
        }
        .team-grid {
          display: grid;
          grid-template-columns: ${getGridColumns()};
          gap: 24px;
          margin-top: 24px;
          min-height: ${isMobile ? '300px' : 'auto'};
        }
        .member-card {
          background: #faf8f6;
          padding: 24px 16px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          text-align: center;
          transition: all 0.5s ease;
          ${isMobile ? 'opacity: 0; transform: translateY(20px);' : ''}
        }
        .member-card.active {
          opacity: 1;
          transform: translateY(0);
          ${!isMobile ? 'transform: scale(1.05); box-shadow: 0 4px 16px rgba(0,0,0,0.1);' : ''}
        }
        .member-card h3 {
          margin-bottom: 8px;
          font-size: 1.25rem;
          color: #222;
        }
        .member-card a {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #007bff;
          text-decoration: none;
          margin-bottom: 4px;
          font-size: 0.95rem;
        }
        .member-card a svg {
          margin-right: 8px;
        }
        .member-card a:hover {
          text-decoration: underline;
        }
        .disclaimer {
          margin-top: 48px;
          font-size: 0.875rem;
          color: #666;
          text-align: center;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .card {
            max-width: 90vw;
            padding: 24px;
          }
          .team-grid {
            grid-template-columns: 1fr;
            justify-items: center;
          }
          .member-card {
            width: 100%;
            max-width: 300px;
            margin-bottom: 0;
            position: absolute;
          }
        }

        @media (max-width: 480px) {
          .section h2 {
            font-size: 1.3rem;
          }
          .member-card {
            padding: 16px 12px;
          }
          .member-card h3 {
            font-size: 1.1rem;
          }
          .member-card a {
            font-size: 0.85rem;
          }
        }
      `}</style>

      <div className="card">
        {/* Support & Availability */}
        <div className="section">
          <h2>Support &amp; Availability</h2>
          <p className="email-line">
            <FaEnvelope /> contact us via our emails or linkedin.
          </p>
        </div>

        {/* The Minds Behind Wellspring */}
        <div className="section">
          <h2>The Minds Behind Wellspring</h2>
          <p className="blockquote">
            Built by a small team of 3, who believe everyone deserves accessible, data-driven support. From SUST CSE.
          </p>
        </div>

        {/* Team Contacts */}
        <div className="section">
          <h2>Team Contacts</h2>
          <div className="team-grid">
            {displayedMembers.map((member, index) => (
              <div 
                key={`${member.name}-${index}`}
                className={`member-card ${index === 0 ? 'active' : ''}`}
                style={{
                  ...(isMobile && {
                    zIndex: teamMembers.length - index,
                    transitionDelay: `${index * 0.1}s`
                  })
                }}
              >
                <h3>{member.name}</h3>
                <a href={`mailto:${member.email.includes('@') ? member.email : ''}`}>
                  <FaEnvelope /> {member.email}
                </a>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin /> LinkedIn
                </a>
                <a href={member.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub /> GitHub
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer">
          <strong>Wellspring</strong> is an AI-powered platform that supports your mental wellness by helping you track your routine, mood, and activities and by offering insights through psychological assessments based on standardized medical tools. While it provides initial guidance for self-aware individuals, it isn't a doctor and doesn't replace professional advice—it's always best to consult a qualified psychologist or physician without hesitation.
        </div>
      </div>
    </div>
  );
}