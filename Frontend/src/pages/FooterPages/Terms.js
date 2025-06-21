// src/pages/Terms.jsx
import React from 'react';

export default function Terms() {
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
          Terms of Service
        </h1>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Wellspring, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please discontinue use immediately.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            2. Use of Service
          </h2>
          <ul style={{ paddingLeft: '1.2em' }}>
            <li>You must be at least 18 years old to use Wellspring.</li>
            <li>Do not share confidential personal data about others.</li>
            <li>Use the AI counselor for personal well-being—do not post disallowed content.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            3. Intellectual Property
          </h2>
          <p>
            All content, design, and software powering Wellspring are the property of their respective owners. You may not reproduce or distribute without permission.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            4. Disclaimers
          </h2>
          <p style={{ textTransform: 'uppercase', fontWeight: '600' }}>
            THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” WELLSPRING DOES NOT GUARANTEE MEDICAL ACCURACY OR OUTCOMES. ALWAYS SEEK PROFESSIONAL HELP FOR DIAGNOSIS AND TREATMENT.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            5. Limitation of Liability
          </h2>
          <p>
            IN NO EVENT SHALL WELLSPRING OR ITS PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            6. Governing Law
          </h2>
          <p>
            These Terms are governed by the laws of Bangladesh, and any disputes arising under these
            Terms shall be subject to the exclusive jurisdiction of the courts of Bangladesh.
          </p>

        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            7. Changes to Terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use after any changes indicates your acceptance of the new terms.
          </p>
        </section>

        <div style={{
          marginTop: '48px',
          fontSize: '0.875rem',
          color: '#666',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          <strong>Wellspring</strong> is an AI-powered platform that supports your mental wellness by helping you track your routine, mood, and activities and by offering insights through psychological assessments based on standardized medical tools. While it provides initial guidance for self-aware individuals, it isn’t a doctor and doesn’t replace professional advice—it’s always best to consult a qualified psychologist or physician without hesitation.
        </div>
      </div>
    </div>
  );
}
