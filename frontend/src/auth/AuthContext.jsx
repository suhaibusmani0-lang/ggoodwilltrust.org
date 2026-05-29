import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Apna supabase connection

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Pehle check karega ki koi user login hai ya nahi
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Agar user login ya logout karta hai, toh ye update ho jayega
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {/* Jab tak check chal raha hai tab tak white screen rahegi, phir app load hoga */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);