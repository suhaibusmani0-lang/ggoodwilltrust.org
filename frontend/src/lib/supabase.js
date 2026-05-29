import { createClient } from '@supabase/supabase-js'

// Ye aapka URL hai
const supabaseUrl = 'https://kicklktvmjhgwyeewvym.supabase.co'

// Yahan single quotes (' ') ke andar wo copy ki hui lambi key paste kar dein
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpY2tsa3R2bWpoZ3d5ZWV3dnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzAzODksImV4cCI6MjA5NTQ0NjM4OX0.cAUntSFC_6tXeiDmpjCGdb8Qrpgg1HKkHliB9szk7ps' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)