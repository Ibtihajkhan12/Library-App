import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dznchgtmbxajefptehuh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bmNoZ3RtYnhhamVmcHRlaHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTM3ODEsImV4cCI6MjA2MzIyOTc4MX0.dEFomvWDLnqqDXXhhlMacLbbjF4oTu9LRNaybkJxTYs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)