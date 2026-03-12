import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { BsCodeSlash, BsPlayFill, BsBuilding, BsChevronDown } from 'react-icons/bs';
import axios from 'axios';

const COMPANYS = [
  { id: 'google', name: 'Google', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'amazon', name: 'Amazon', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'microsoft', name: 'Microsoft', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  { id: 'meta', name: 'Meta', color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  { id: 'netflix', name: 'Netflix', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { id: 'apple', name: 'Apple', color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/30' },
  { id: 'linkedin', name: 'LinkedIn', color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
  { id: 'uber', name: 'Uber', color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
  { id: 'twitter', name: 'Twitter/X', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
  { id: 'adobe', name: 'Adobe', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  { id: 'flipkart', name: 'Flipkart', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  { id: 'other', name: '🌐 Other', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
];

// We keep LANGUAGES since it's just meta-data
const LANGUAGES = {
  javascript: { name: 'JavaScript', version: '18.15.0', ex: 'js', defaultCode: 'function solve() {\n  \n}' },
  python: { name: 'Python', version: '3.10.0', ex: 'py', defaultCode: 'def solve():\n  pass' },
  java: { name: 'Java', version: '15.0.2', ex: 'java', defaultCode: 'public class Main {\n  public static void main(String[] args) {\n    \n  }\n}' },
  cpp: { name: 'C++', version: '10.2.0', ex: 'cpp', defaultCode: '#include <iostream>\n\nint main() {\n  return 0;\n}' }
};

function CodingPractice() {
  const [selectedCompany, setSelectedCompany] = useState('google');
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Fetch questions from DB whenever company changes
  React.useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
  const res = await axios.get(`https://jobprep-backend-9rmp.onrender.com/api/questions?company=${selectedCompany}`, {
    withCredentials: true
  });
        const fetchedQuestions = res.data.questions || [];
        setQuestions(fetchedQuestions);
        
        // Reset defaults
        setSelectedQuestionIdx(0);
        if (fetchedQuestions.length > 0) {
          setCode(fetchedQuestions[0].snippets[selectedLanguage] || LANGUAGES[selectedLanguage].defaultCode);
        } else {
          setCode(LANGUAGES[selectedLanguage].defaultCode);
        }
        setOutput('');
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [selectedCompany, selectedLanguage]);

  const currentQuestion = questions[selectedQuestionIdx];

  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
  };

  const handleQuestionChange = (idx) => {
    setSelectedQuestionIdx(idx);
    setCode(questions[idx]?.snippets[selectedLanguage] || LANGUAGES[selectedLanguage].defaultCode);
    setOutput('');
  };

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    setCode(currentQuestion?.snippets[langId] || LANGUAGES[langId].defaultCode);
    setDropdownOpen(false);
  };

  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('Compiling and executing...\n');

    try {
      const response = await axios.post('http://localhost:8000/api/questions/run', {
        language: selectedLanguage,
        code: code,
        filename: `main.${LANGUAGES[selectedLanguage].ex}`
      });

      const { output, error } = response.data;
      setOutput(output || 'Code executed with no output.');

    } catch (err) {
      setOutput(`Error executing code: ${err.message || 'Unknown server error.'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans relative overflow-hidden'>
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Navbar />

      <div className='flex-1 px-4 sm:px-6 py-12 relative z-10 flex flex-col'>
        <div className='max-w-7xl mx-auto w-full flex-1 flex flex-col'>
          
          <div className='mb-8 text-center'>
            <h1 className='text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent inline-flex items-center gap-4'>
              <BsCodeSlash /> DSA Practice Lab
            </h1>
            <p className='text-slate-400 mt-4 text-sm md:text-base font-medium max-w-2xl mx-auto'>
              Sharpen your algorithmic skills with company-specific coding challenges. Prepare for the technical hurdles of your AI interview.
            </p>
          </div>

          {/* Company Selector */}
          <div className='flex flex-wrap items-center justify-center gap-4 mb-8'>
            {COMPANYS.map(company => (
              <button
                key={company.id}
                onClick={() => handleCompanyChange(company.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border ${
                  selectedCompany === company.id 
                    ? `bg-slate-800 border-slate-600 shadow-xl ${company.color}`
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                }`}
              >
                <BsBuilding /> {company.name}
              </button>
            ))}
          </div>

          <div className='flex flex-col lg:flex-row gap-6 flex-1 min-h-[60vh]'>
            
            {/* Left Panel: Questions & Description */}
            <div className='w-full lg:w-1/3 flex flex-col gap-6'>
              
              {/* Question List */}
              <div className='bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl'>
                 <h3 className='text-lg font-bold text-slate-200 mb-4'>Questions</h3>
                 <div className='space-y-3'>
                   {loadingQuestions ? (
                     <div className='p-4 text-center text-slate-400 animate-pulse'>Loading questions...</div>
                   ) : questions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuestionChange(idx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                          selectedQuestionIdx === idx
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-inner'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
                        }`}
                      >
                         <span className='font-medium truncate pr-4'>{q.title}</span>
                         <span className={`text-xs px-2 py-1 rounded-md bg-opacity-20 shrink-0 ${
                           q.difficulty === 'Easy' ? 'bg-green-500 text-green-400' :
                           q.difficulty === 'Medium' ? 'bg-yellow-500 text-yellow-400' :
                           'bg-red-500 text-red-400'
                         }`}>
                           {q.difficulty}
                         </span>
                      </button>
                   ))}
                   {!loadingQuestions && questions.length === 0 && (
                     <div className='p-4 text-center text-slate-500 border border-dashed border-slate-700 rounded-xl'>
                       No questions available for this company yet.
                     </div>
                   )}
                 </div>
              </div>

              {/* Description Box */}
              {currentQuestion && (
                <div className='bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl flex-1 flex flex-col'>
                   <div className='mb-4'>
                     <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                           currentQuestion.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                           currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                           'bg-red-500/20 text-red-400'
                         }`}>
                        {currentQuestion.difficulty}
                     </span>
                     <h2 className='text-2xl font-bold text-slate-100 mt-4'>{currentQuestion.title}</h2>
                   </div>
                   <p className='text-slate-300 leading-relaxed font-medium text-sm sm:text-base flex-1'>
                     {currentQuestion.description}
                   </p>
                </div>
              )}

            </div>

            {/* Right Panel: Editor Area */}
            <div className='flex-1 flex flex-col gap-6'>
               <div className='bg-slate-900 border border-slate-700/50 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl relative'>
                  <div className='bg-slate-800/80 border-b border-slate-700/50 px-6 py-3 flex items-center justify-between'>
                       <div className='relative'>
                         <button 
                           onClick={() => setDropdownOpen(!dropdownOpen)}
                           className='flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md border border-slate-600 transition-colors'>
                            {LANGUAGES[selectedLanguage].name} <BsChevronDown size={12} />
                         </button>

                         {dropdownOpen && (
                           <div className='absolute top-full left-0 mt-2 w-32 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 overflow-hidden'>
                              {Object.entries(LANGUAGES).map(([key, lang]) => (
                                <button
                                  key={key}
                                  onClick={() => handleLanguageChange(key)}
                                  className='w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors uppercase tracking-wider font-semibold'
                                >
                                  {lang.name}
                                </button>
                              ))}
                           </div>
                         )}
                       </div>
                    <button 
                      onClick={runCode}
                      disabled={isRunning}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
                        isRunning 
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed border-slate-600'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400'
                      }`}>
                      {isRunning ? (
                         <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin"></span>
                      ) : <BsPlayFill size={16} />} 
                      {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                    className='w-full flex-1 bg-transparent p-6 text-slate-300 font-mono text-sm sm:text-base outline-none resize-none custom-scrollbar leading-relaxed'
                  />
               </div>

               {/* Output Console */}
               <div className='h-48 bg-[#0a0f1c] border border-slate-700/50 rounded-3xl shadow-xl flex flex-col overflow-hidden'>
                 <div className='bg-slate-800/50 px-6 py-2 border-b border-slate-700/50'>
                   <span className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Console Output</span>
                 </div>
                 <div className='p-6 flex-1 overflow-auto custom-scrollbar font-mono text-sm'>
                   {output ? (
                     <pre className={`whitespace-pre-wrap ${output.includes('Error') || output.includes('Exception') ? 'text-rose-400' : 'text-emerald-400'}`}>
                       {output}
                     </pre>
                   ) : (
                     <span className='text-slate-600'>// Run your code to see the output here...</span>
                   )}
                 </div>
               </div>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CodingPractice;
