import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores que você pegou lá no painel do Supabase
const supabaseUrl = 'https://jijtdlnczwjmloywoknp.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_hlDX43bSBNzaCWC5Rh47Wg_K5afj-NS';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);