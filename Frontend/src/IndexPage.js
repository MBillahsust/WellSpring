import React, { useRef } from 'react';

import { Outlet } from "react-router-dom"
import KeyFeatures from "./Components/KeyFeatures";
import BigCard from './Components/Personalized';
import Community from './Components/Community';
import Assesment from './Components/Assesment';
import Spacer from './Components/Spacer';

import './App.css';


export default function Layout() {

  const keyFeaturesRef = useRef(null);

  const handleScrollToContent = () => {
    if (keyFeaturesRef.current) {
      keyFeaturesRef.current.scrollIntoView({ behavior: 'smooth' }); 
    }
  };

  return (
    <div className="layout-container">
      <main>
        <BigCard onGetStartedClick={handleScrollToContent} />
        <div ref={keyFeaturesRef}>
          <KeyFeatures />
        </div>
        <Assesment />
        <Community />
        <Spacer height="50px" />
        <Outlet />
      </main>
    </div>
  );
}