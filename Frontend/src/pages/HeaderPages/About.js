import React from 'react';


const AboutPage = () => {
  const pageStyle = {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: "'Arial', sans-serif",
    backgroundColor: '#f0f4f8',
    borderRadius: '12px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '40px',
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    position: 'relative',
  };

  const underlineStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '5px',
    background: '#3498db',
    borderRadius: '3px',
    bottom: '-10px',
  };

  const sectionStyle = {
    marginBottom: '30px',
    padding: '25px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  };

  const paragraphStyle = {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#34495e',
  };



  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>
        WellSpring: Your AI-Powered Mental Health Companion
        <div style={underlineStyle}></div>
      </h1>

      <section style={sectionStyle}>
        <p style={paragraphStyle}>
          WellSpring is a revolutionary web-based platform dedicated to providing personalized mental health support. Using advanced AI technology, we offer tailored tips, scenario-based advice, and a wealth of resources to individuals struggling with various mental health conditions.
        </p>
      </section>

      <section style={sectionStyle}>
        <p style={paragraphStyle}>
          Our platform fosters a supportive community, empowering users to connect, share experiences, and learn effective coping strategies. With WellSpring, individuals can access personalized assistance, cultivate resilience, and embark on a journey toward improved mental well-being.
        </p>
      </section>

      
    </div>
  );
};

export default AboutPage;


