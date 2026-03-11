import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'
function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })

                setInterviews(result.data)

            } catch (error) {
                console.log(error)
            }

        }

        getMyInterviews()

    }, [])


    return (
        <div className='min-h-screen bg-slate-900 text-slate-200 py-10 font-sans relative overflow-hidden' >
            
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className='relative z-10 w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

                <div className='mb-12 w-full flex items-start gap-5 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3.5 rounded-2xl bg-slate-800/80 backdrop-blur-md shadow-lg border border-slate-700/50 hover:bg-slate-700 hover:border-slate-600 transition-all duration-300'>
                        <FaArrowLeft className='text-emerald-400' size={18} />
                    </button>

                    <div>
                        <h1 className='text-3xl md:text-4xl font-bold flex-nowrap bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
                            Interview History
                        </h1>
                        <p className='text-slate-400 mt-2 text-sm md:text-base font-medium'>
                            Track your past interviews and performance reports
                        </p>
                    </div>
                </div>

                {interviews.length === 0 ?
                    <div className='bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-12 rounded-[2rem] shadow-2xl text-center'>
                        <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-600">
                           <span className="text-3xl text-slate-400">📝</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">No Interviews Yet</h3>
                        <p className='text-slate-400 text-lg'>
                            Start your first AI mock interview to see your history here.
                        </p>
                        <button
                          onClick={() => navigate("/interview")}
                          className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-900/40 hover:opacity-90 transition-all">
                          Start an Interview
                        </button>
                    </div>
                :
                    <div className='grid gap-6'>
                        {interviews.map((item, index) => (
                            <div key={index}
                             onClick={()=>navigate(`/report/${item._id}`)}
                             className='group bg-slate-800/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300 cursor-pointer border border-slate-700/50 hover:border-emerald-500/30 relative overflow-hidden'>
                                
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>

                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10'>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-700/50 flex flex-col items-center justify-center border border-slate-600 shrink-0">
                                           <span className="text-xs font-bold text-slate-400">
                                              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short' })}
                                           </span>
                                           <span className="text-lg font-bold text-emerald-400 leading-none">
                                              {new Date(item.createdAt).getDate()}
                                           </span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                                                {item.role}
                                            </h3>
                                            <p className="text-slate-400 text-sm mt-1.5 font-medium flex items-center gap-2">
                                                <span className="bg-slate-700/50 px-2.5 py-1 rounded-md border border-slate-600/50">{item.experience}</span>
                                                <span className="bg-slate-700/50 px-2.5 py-1 rounded-md border border-slate-600/50">{item.mode}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-slate-700/50'>

                                        {/* SCORE */}
                                        <div className="text-left md:text-right">
                                            <p className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                                {item.finalScore || 0}<span className="text-sm font-semibold text-slate-500">/10</span>
                                            </p>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                                                Overall Score
                                            </p>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <div className="flex items-center">
                                          <span
                                              className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm ${item.status === "completed"
                                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                                  }`}
                                          >
                                              {item.status}
                                          </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default InterviewHistory
