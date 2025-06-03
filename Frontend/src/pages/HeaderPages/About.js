import React from 'react';
import developer1Image from './developer1.jpg';
import developer2Image from './developer2.jpg';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

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

  const developerSectionHeadingStyle = {
    fontSize: '28px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
  };

  const developerSectionParagraphStyle = {
    ...paragraphStyle,
    textAlign: 'center',
    marginBottom: '30px',
  };

  const developerCardStyle = {
    textAlign: 'center',
  };

  const developerImageStyle = {
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
  };

  const developerNameStyle = {
    fontSize: '22px',
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: '10px',
  };

  const developerDetailsStyle = {
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#34495e',
  };

  const socialLinksStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  };

  const socialLinkStyle = {
    marginRight: '15px',
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

      <section style={sectionStyle}>
        <h2 style={developerSectionHeadingStyle}>The Minds Behind WellSpring</h2>
        <p style={developerSectionParagraphStyle}>
          Passionate individuals dedicated to making a difference in mental health.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={developerCardStyle}>
            <img src={developer1Image} alt="Developer 1" style={developerImageStyle} />
            <h3 style={developerNameStyle}>Mustakim Billah</h3>
            <p style={developerDetailsStyle}>
              Lead Developer <br />
              <strong>mbillah.cse.sust20@gmail.com</strong>
              <br />
              <strong> CSE,SUST</strong>
            </p>

            <div style={socialLinksStyle}>
              <a href="https://github.com/MBillahsust" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                <FaGithub size={24} /> 
              </a>
              <a href="https://www.linkedin.com/in/mustakim-billah-nafees/" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                <FaLinkedin size={24} /> 
              </a>
            </div>
          </div>

          <div style={developerCardStyle}>
            <img src={developer2Image} alt="Developer 2" style={developerImageStyle} />
            <h3 style={developerNameStyle}>Sanjoy Das</h3>
            <p style={developerDetailsStyle}>
              Lead Developer 
              <br />
              <strong>sanjoy.cse.sust20@gmail.com</strong> <br />
              <strong>CSE,SUST </strong>
            </p>

            <div style={socialLinksStyle}>
              <a href="https://github.com/sanjoydasjoy" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                <FaGithub size={24} /> 
              </a>
              <a href="https://www.linkedin.com/in/sanjoy-das-ba774a22a/" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                <FaLinkedin size={24} /> 
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;


