import React, { useState } from 'react';
import { Lock, Loader2, Mail, Key, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please enter both email and password!");
            return;
        }

        setLoading(true);

        try {
            // Supabase backend se login check kar rahe hain
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            toast.success("Login Successful! Welcome to Admin Panel.");
            navigate('/admin'); // Login hote hi dashboard par bhej dega

        } catch (error) {
            console.error("Login Error:", error.message);
            toast.error("Invalid Email or Password!");
        } finally {
            setLoading(false);
        }
    };

    // --- Framer Motion Animations ---
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="relative min-h-screen bg-[#0a0f1c] flex items-center justify-center px-4 font-sans selection:bg-blue-500/30 overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="relative z-10 w-full max-w-md"
            >
                {/* Glassmorphic Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                            <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/30 relative z-10">
                                <ShieldCheck className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-slate-400 text-sm">Sign in to manage G Goodwill Trust</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        
                        {/* Email Input */}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Admin Email"
                                className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all placeholder:text-slate-600 text-white text-sm"
                            />
                        </div>
                        
                        {/* Password Input */}
                        <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all placeholder:text-slate-600 text-white text-sm"
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="group w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:hover:translate-y-0 text-sm"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
                            ) : (
                                <>Secure Login <Lock className="w-4 h-4" /></>
                            )}
                        </button>

                    </form>
                </div>
                
                {/* Footer Note */}
                <p className="text-center text-slate-600 text-xs mt-6">
                    Restricted Access. Authorized personnel only.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;