import React from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer';
import CallToAction from '../components/CallToAction';
import ChatBot from '../components/ChatBot/ChatBot';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <CallToAction />
      <Footer />
      <ChatBot />
    </>
  );
};

export default MainLayout;
