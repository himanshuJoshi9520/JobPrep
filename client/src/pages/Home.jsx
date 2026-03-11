import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';


const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(40px)" }} className="h-full w-full relative">
        {children}
      </div>
    </motion.div>
  );
};

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans relative overflow-hidden'>
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar />

      <div className='flex-1 px-6 py-20 relative z-10'>
        <div className='max-w-6xl mx-auto'>

          <div className='flex justify-center mb-8'>
            <div className='bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-emerald-400 text-sm px-5 py-2.5 rounded-full flex items-center gap-3 shadow-lg'>
              <HiSparkles size={18} className="text-emerald-400 animate-pulse" />
              <span className="font-medium tracking-wide">AI Powered Smart Interview Platform</span>
            </div>
          </div>

          <div className='text-center mb-28'>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-5xl md:text-7xl font-bold leading-tight max-w-4xl mx-auto text-slate-100'>
              Practice Interviews with
              <br className="hidden md:block" />
              <span className='relative inline-block mt-4 md:mt-2'>
                <span className='bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-2 rounded-full shadow-lg shadow-emerald-500/10 relative z-10'>
                  AI Intelligence
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='text-slate-400 mt-8 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed'>
              Role-based mock interviews with smart follow-ups,
              adaptive difficulty and real-time performance evaluation.
            </motion.p>

            <div className='flex flex-wrap justify-center gap-5 mt-12'>
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/interview")
                }}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold px-10 py-4 rounded-full shadow-xl shadow-emerald-900/40 hover:shadow-emerald-900/60 transition-all'>
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/history")
                }}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-slate-300 font-semibold px-10 py-4 rounded-full hover:bg-slate-700 hover:text-white transition-all shadow-lg'>
                View History
              </motion.button>
            </div>
          </div>

          <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'>
            {
              [
                {
                  icon: <BsRobot size={24} />,
                  step: "STEP 1",
                  title: "Role & Experience Selection",
                  desc: "AI adjusts difficulty based on selected job role."
                },
                {
                  icon: <BsMic size={24} />,
                  step: "STEP 2",
                  title: "Smart Voice Interview",
                  desc: "Dynamic follow-up questions based on your answers."
                },
                {
                  icon: <BsClock size={24} />,
                  step: "STEP 3",
                  title: "Timer Based Simulation",
                  desc: "Real interview pressure with time tracking."
                }
              ].map((item, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 + index * 0.2 }}
                  whileHover={{ rotate: 0, scale: 1.06 }}

                  className={`
        relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 
        hover:border-emerald-500/50 p-10 w-80 max-w-[90%] shadow-xl hover:shadow-2xl hover:shadow-emerald-900/20 
        transition-all duration-300 rounded-[2rem]
        ${index === 0 ? "rotate-[-4deg]" : ""}
        ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-2xl" : ""}
        ${index === 2 ? "rotate-[-3deg]" : ""}
      `}>

                  <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 border box-border border-emerald-500/50 text-emerald-400 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40'>
                    {item.icon}</div>
                  <div className='pt-10 text-center'>
                    <div className='text-xs text-emerald-500 font-bold mb-3 tracking-widest uppercase'>{item.step}</div>
                    <h3 className='font-bold mb-3 text-xl text-slate-100'>{item.title}</h3>
                    <p className='text-sm text-slate-400 leading-relaxed font-medium'>{item.desc}</p>
                  </div>


                </motion.div>
              ))
            }
          </div>


          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-5xl font-bold text-center mb-20 text-slate-100'>
              Advanced AI{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Capabilities</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={20} />,
                    title: "AI Answer Evaluation",
                    desc: "Scores communication, technical accuracy and confidence."
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Resume Based Interview",
                    desc: "Project-specific questions based on uploaded resume."
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Downloadable PDF Report",
                    desc: "Detailed strengths, weaknesses and improvement insights."
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={20} />,
                    title: "History & Analytics",
                    desc: "Track progress with performance graphs and topic analysis."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <TiltCard
                      className='bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-900/20 hover:border-emerald-500/30 transition-shadow group overflow-visible relative h-full cursor-pointer'
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>

                      <div className='flex flex-col md:flex-row items-center gap-10 relative z-10'>
                        <div className='w-full md:w-1/2 flex justify-center'>
                          <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-64 drop-shadow-2xl scale-95 group-hover:scale-105 transition-transform duration-500' />
                        </div>

                        <div className='w-full md:w-1/2'>
                          <div className='bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner shadow-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6'>
                            {item.icon}
                          </div>
                          <h3 className='font-bold mb-4 text-2xl text-slate-100'>{item.title}</h3>
                          <p className='text-slate-400 text-base leading-relaxed font-medium'>{item.desc}</p>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))
              }
            </div>


          </div>

          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-5xl font-bold text-center mb-20 text-slate-100'>
              Multiple Interview{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Modes</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                [
                  {
                    img: hrImg,
                    title: "HR Interview Mode",
                    desc: "Behavioral and communication based evaluation."
                  },
                  {
                    img: techImg,
                    title: "Technical Mode",
                    desc: "Deep technical questioning based on selected role."
                  },

                  {
                    img: confidenceImg,
                    title: "Confidence Detection",
                    desc: "Basic tone and voice analysis insights."
                  },
                  {
                    img: creditImg,
                    title: "Credits System",
                    desc: "Unlock premium interview sessions easily."
                  }
                ].map((mode, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all group">

                    <div className='flex items-center justify-between gap-6'>
                      <div className="w-1/2">
                        <h3 className="font-bold text-2xl mb-3 text-slate-100">
                          {mode.title}
                        </h3>

                        <p className="text-slate-400 text-base leading-relaxed font-medium">
                          {mode.desc}
                        </p>
                      </div>

                      {/* RIGHT IMAGE */}
                      <div className="w-1/2 flex justify-end">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-28 h-28 object-contain"
                        />
                      </div>



                    </div>


                  </motion.div>
                ))
              }
            </div>


          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

        <Footer/>

    </div>
  )
}

export default Home
