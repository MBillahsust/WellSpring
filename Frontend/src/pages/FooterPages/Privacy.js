// src/pages/Privacy.jsx
import React from 'react';

export default function Privacy() {
  return (
    <div style={{
      background: '#f7f9fc',
      padding: '60px 16px',
      minHeight: '100vh'
    }}>
      <div style={{
        background: '#fff',
        maxWidth: '65vw',
        minWidth: '320px',
        margin: '0 auto',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        color: '#333',
        lineHeight: 1.6
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '24px',
          textAlign: 'center',
          borderBottom: '3px solid #007bff',
          paddingBottom: '8px'
        }}>
          Privacy Policy
        </h1>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            Introduction
          </h2>
          <p>
            At Wellspring, we take your privacy seriously. This policy explains
            what information we collect, why we collect it, and how we protect it.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            1. Information We Collect
          </h2>
          <ul style={{ paddingLeft: '1.2em' }}>
            <li>
              <strong>Profile Data:</strong> name and email (only if you provide it via Contact form or sign-up. If you don't want to use real email or name, you can use dummy profile data to open accounts. Our sole goal is to offer you a plartform that actually helps, nothing else.).
            </li>
            <li>
              <strong>Assessment & Mood Data:</strong> responses to self-assessments, mood logs, and activity entries.
            </li>
            <li>
              <strong>Chat History:</strong> We don't save chat History. After your conversations with the AI counselor, everything gets automatically deleted.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            2. How We Use Your Data
          </h2>
          <ul style={{ paddingLeft: '1.2em' }}>
            <li>To power personalized AI guidance based on your inputs.</li>
            <li>To improve and debug our service.</li>
            <li>To improve our research goals (only if you provide).</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            3. Data Sharing
          </h2>
          <p>
            We do <strong>not</strong> sell your personal data. We may share
            anonymized, aggregated insights for research, and we use trusted
            third-party services (auth, analytics) that comply with strict
            privacy standards.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            4. Security
          </h2>
          <p>
            All data is stored in encrypted databases (MongoDB Atlas). All
            communications use HTTPS/TLS. We follow best practices to protect
            your information from unauthorized access.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            5. Your Rights
          </h2>
          <p>
            You can request export or deletion of your personal data at any time
            by contacting us.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            6. Changes to This Policy
          </h2>
          <p>
            We may update this policy as we add features or to comply with new
            regulations. We’ll post a notice here and update the “Last Updated”
            date when changes occur.
          </p>
        </section>

        <div style={{
          marginTop: '32px',
          fontSize: '0.875rem',
          color: '#666',
          textAlign: 'center'
        }}>
          <strong>Last Updated:</strong> June 14, 2025
        </div>

        <div style={{
          marginTop: '48px',
          fontSize: '0.875rem',
          color: '#666',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          <strong>Wellspring</strong> is an AI-powered platform that supports your
          mental wellness by helping you track your routine, mood, and activities
          and by offering insights through psychological assessments based on
          standardized medical tools. While it provides initial guidance for
          self-aware individuals, it isn’t a doctor and doesn’t replace
          professional advice—it’s always best to consult a qualified
          psychologist or physician without hesitation.
        </div>
      </div>
    </div>
  );
}
