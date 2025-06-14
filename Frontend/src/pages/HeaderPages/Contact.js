// src/pages/Contact.jsx
import React from 'react';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function Contact() {
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
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        @media (max-width: 600px) {
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
        .member-card {
          background: #faf8f6;
          padding: 24px 16px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          text-align: center;
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
      `}</style>

      <div className="card">
        {/* Support & Availability */}
        <div className="section">
          <h2>Support &amp; Availability</h2>
          <p className="email-line">
            <FaEnvelope /> support@wellspring.ai
          </p>
          <p><strong>Hours:</strong> Mon–Fri, 9 AM–6 PM (BST)</p>
        </div>

        {/* The Minds Behind Wellspring */}
        <div className="section">
          <h2>The Minds Behind Wellspring</h2>
          <p className="blockquote">
            Built by a small team who believe everyone deserves accessible, data-driven support.
          </p>
        </div>

        {/* Team Contacts */}
        <div className="section">
          <h2>Team Contacts</h2>
          <div className="team-grid">
            <div className="member-card">
              <h3>Mustakim Billah</h3>
              <a href="mailto:mbillah.cse.sust20@gmail.com">
                <FaEnvelope /> mbillah.cse.sust20@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/mustakim-billah-nafees/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin /> LinkedIn
              </a>
              <a href="https://github.com/MBillahsust" target="_blank" rel="noopener noreferrer">
                <FaGithub /> GitHub
              </a>
            </div>
            <div className="member-card">
              <h3>Sanjoy Das</h3>
              <a href="mailto:sanjoydasjoy2022@gmail.com">
                <FaEnvelope /> sanjoydasjoy2022@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/sanjoy-das-ba774a22a/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin /> LinkedIn
              </a>
              <a href="https://github.com/sanjoydasjoy" target="_blank" rel="noopener noreferrer">
                <FaGithub /> GitHub
              </a>
            </div>
            <div className="member-card">
              <h3>Arfatul Islam Asif</h3>
              <a href="mailto:aiasif@gmail.com">
                <FaEnvelope /> aiasif@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/arfatul-islam-asif-169116279/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin /> LinkedIn
              </a>
              <a href="https://github.com/ArfatulAsif" target="_blank" rel="noopener noreferrer">
                <FaGithub /> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer">
          <strong>Wellspring</strong> is an AI-powered platform that supports your mental wellness by helping you track your routine, mood, and activities and by offering insights through psychological assessments based on standardized medical tools. While it provides initial guidance for self-aware individuals, it isn’t a doctor and doesn’t replace professional advice—it’s always best to consult a qualified psychologist or physician without hesitation.
        </div>
      </div>
    </div>
  );
}
