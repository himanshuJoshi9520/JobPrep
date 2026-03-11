import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer'
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, userName } = interviewData;
  const [questions, setQuestions] = useState(interviewData.questions || []);
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");


  const videoRef = useRef(null);
  const userVideoRef = useRef(null);
  const streamRef = useRef(null);

  const currentQuestion = questions[currentIndex];


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      utterance.rate = 0.92;     
      utterance.pitch = 1.05;    
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic()
        videoRef.current?.play();
      };


      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);



        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };


      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };


  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }

    }

    runIntro()


  }, [selectedVoice, isIntroPhase, currentIndex])



  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0;
        }
        return prev - 1

      })
    }, 1000);

    return () => clearInterval(timer)

  }, [isIntroPhase, currentIndex])

  useEffect(() => {
  if (!isIntroPhase && currentQuestion) {
    setTimeLeft(currentQuestion.timeLimit || 60);
  }
}, [currentIndex]);


  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;

  }, []);


  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch { }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };


  const submitAnswer = async (isSkippedArg = false) => {
    const isSkipped = isSkippedArg === true;
    if (isSubmitting) return;
    stopMic()
    setIsSubmitting(true)

    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer: isSkipped ? "" : answer,
        isSkipped,
        timeTaken:
          currentQuestion.timeLimit - timeLeft,
      } , {withCredentials:true})

      setFeedback(result.data.feedback);
      
      if (result.data.nextQuestion) {
        setQuestions(prev => {
          const newQs = [...prev];
          // avoid duplicates if same index
          if (newQs.length === currentIndex + 1) {
             newQs.push(result.data.nextQuestion);
          }
          return newQs;
        });
      }

      if (result.data.isFinished) {
         // wait for feedback speech, then finish
         await speakText(result.data.feedback);
         await speakText("Thank you for your time. The interview is now complete.");
         finishInterview();
         return;
      } else {
         speakText(result.data.feedback);
      }
      
      setIsSubmitting(false)
    } catch (error) {
console.log(error)
setIsSubmitting(false)
    }
  }

  const handleNext =async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
       // shouldn't happen unless AI failed to generate next question but didn't set isFinished
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);

   
  }

  const finishInterview = async () => {
    stopMic()
    setIsMicOn(false)
    try {
      const result = await axios.post(ServerUrl+ "/api/interview/finish" , { interviewId} , {withCredentials:true})

      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }


   useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer()
    }
  }, [timeLeft]);

  useEffect(() => {
    // Start Candidate Webcam
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };
    enableCamera();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      // Stop Camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className='min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans'>
      <div className='w-full max-w-6xl min-h-[85vh] bg-slate-800/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-700/50 flex flex-col lg:flex-row overflow-hidden relative'>
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Video & Info Sidebar */}
        <div className='w-full lg:w-[35%] bg-slate-800/50 flex flex-col items-center p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 z-10'>
          
          <div className='w-full max-w-sm rounded-[1.5rem] overflow-hidden shadow-2xl relative group bg-black'>
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto aspect-[4/3] object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            />
            {isAIPlaying && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Speaking
              </div>
            )}
             <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-sm font-medium border border-white/10">
               AI Interviewer
             </div>
          </div>

          {/* Subtitle / Speech Bubble */}
          <div className={`w-full max-w-sm transition-all duration-300 ${subtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className='bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-4 shadow-lg relative'>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-700/50 border-t border-l border-slate-600/50 transform rotate-45"></div>
              <p className='text-slate-200 text-sm sm:text-base font-medium text-center leading-relaxed relative z-10'>"{subtitle || "..."}"</p>
            </div>
          </div>

          {/* Status & Timer Panel */}
          <div className='w-full max-w-sm bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-xl p-6 space-y-5 flex-1'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-slate-400 uppercase tracking-wider'>
                Session Status
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isAIPlaying ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                {isAIPlaying ? "Active" : "Listening"}
              </span>
            </div>

            <div className="h-px bg-slate-700/50"></div>

            <div className='flex justify-center'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className="h-px bg-slate-700/50"></div>

            <div className='flex flex-col items-center justify-center text-center space-y-1'>
                <span className='text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
                  {currentIndex + 1}
                </span>
                <span className='text-xs font-medium text-slate-400 uppercase tracking-widest'>Question</span>
            </div>
          </div>
        </div>

        {/* Main Interaction Section */}
        <div className='flex-1 flex flex-col p-6 sm:p-8 md:p-10 relative z-10 lg:pl-12'>
          <div className="flex justify-between items-center mb-8">
            <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
              {userName}'s Interview
            </h2>
            <button
               onClick={finishInterview}
               className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border border-slate-600 hover:bg-rose-500/20 hover:border-rose-500/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm"
            >
              End Interview Early
            </button>
          </div>

          {!isIntroPhase && (
          <div className='relative mb-8 bg-slate-800/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-700/50 shadow-xl'>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                 <span className="text-emerald-400 font-bold text-sm">Q{currentIndex + 1}</span>
               </div>
               <p className='text-sm font-medium text-slate-400 uppercase tracking-wider'>
                 Evaluating Fit
               </p>
            </div>
            <div className='text-lg sm:text-xl font-semibold text-slate-200 leading-relaxed font-sans'>{currentQuestion?.question}</div>
          </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 mb-6 flex-1 min-h-0">
             {/* Candidate Webcam View */}
             <div className="w-full lg:w-1/3 rounded-3xl overflow-hidden border border-slate-700/50 shadow-xl relative bg-black flex-shrink-0 order-2 lg:order-1 lg:max-h-64 h-48 lg:h-auto">
               <video
                 ref={userVideoRef}
                 autoPlay
                 playsInline
                 muted
                 className="w-full h-full object-cover transform scale-x-[-1] opacity-90"
               />
               
               <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none"></div>

               {isMicOn && !isSubmitting && !isIntroPhase && !feedback && (
                  <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/30 backdrop-blur-sm border border-emerald-500/40 animate-pulse">
                     <FaMicrophone className="text-emerald-300" size={14} />
                  </div>
               )}

               <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-sm font-medium border border-white/10 flex items-center gap-2">
                 You
                 {!isMicOn && <FaMicrophoneSlash className="text-rose-400" size={14} />}
               </div>
             </div>

             {/* Answer Textarea */}
             <div className="flex-1 flex flex-col relative order-1 lg:order-2 h-64 lg:h-auto">
                <textarea
                  placeholder="Your answer will appear here as you speak..."
                  onChange={(e) => setAnswer(e.target.value)}
                  value={answer}
                  readOnly={!isMicOn || isSubmitting || !!feedback}
                  className="w-full h-full bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl resize-none outline-none border border-slate-700/50 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-slate-200 text-lg sm:text-xl font-medium placeholder-slate-500 shadow-inner group custom-scrollbar"
                />
             </div>
          </div>

         {/* Actions */}
         {!feedback ? ( 
          <div className='flex items-center gap-4 mt-auto'>
            <motion.button
              onClick={toggleMic}
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center rounded-2xl shadow-xl transition-colors duration-300 border ${isMicOn ? 'bg-slate-700 border-slate-600 text-emerald-400 hover:bg-slate-600' : 'bg-rose-500/20 border-rose-500/30 text-rose-400 hover:bg-rose-500/30'}`}>
              {isMicOn ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24}/>}
            </motion.button>

            <motion.button
              onClick={() => submitAnswer(true)}
              disabled={isSubmitting || isIntroPhase}
              whileTap={{ scale: 0.95 }}
              className='flex-1 shrink-0 bg-slate-800/80 backdrop-blur-md border border-slate-600/50 text-slate-300 py-4 sm:py-5 rounded-2xl hover:bg-slate-700 hover:text-white transition-all font-semibold text-sm sm:text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'>
              Skip Question
            </motion.button>

            <motion.button
              onClick={() => submitAnswer(false)}
              disabled={isSubmitting || !answer.trim() || isIntroPhase}
              whileTap={{ scale: 0.95 }}
              className='flex-[2] shrink-0 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-4 sm:py-5 rounded-2xl shadow-lg shadow-emerald-900/40 hover:opacity-90 hover:shadow-emerald-900/60 transition-all font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400/30 whitespace-nowrap overflow-hidden text-ellipsis px-2'>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"></span>
                  Analyzing...
                </span>
              ) : "Submit Answer"}
            </motion.button>
          </div>
         ) : (
            <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className='mt-auto bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl shadow-xl overflow-hidden'>
              
              <div className="p-6 sm:p-8">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                     <span className="text-teal-400 font-bold text-sm">!</span>
                   </div>
                   <h3 className="text-lg font-bold text-slate-200">AI Feedback</h3>
                 </div>
                 <p className='text-slate-300 font-medium leading-relaxed text-lg'>{feedback}</p>
              </div>

              {(currentIndex + 1 < questions.length) && (
                <div className="bg-slate-900/50 p-4 sm:p-6 border-t border-slate-700/50">
                  <button
                    onClick={handleNext}
                    className='w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-3 font-semibold text-lg border border-slate-600 hover:border-slate-500'>
                    Continue to Next Question <BsArrowRight size={20}/>
                  </button>
                </div>
              )}

            </motion.div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Step2Interview
