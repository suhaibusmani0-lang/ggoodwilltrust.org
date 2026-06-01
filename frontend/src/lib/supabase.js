import { createClient } from '@supabase/supabase-js'

// Ye aapka URL hai
const supabaseUrl = 'https://nupyxvsumptrtiufmnuw.supabase.co'

// Yahan single quotes (' ') ke andar wo copy ki hui lambi key paste kar dein
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cHl4dnN1bXB0cnRpdWZtbnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTg2ODQsImV4cCI6MjA5MTc3NDY4NH0.vA0T1Ah9qHLcCSk-cEGnI5_UIsrn5JAHABM0IhFtq28' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)