import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://hytqudnepysviczrsmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5dHF1ZG5lcHlzdmljenJzbW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTk4NDAsImV4cCI6MjA5MDYzNTg0MH0.YYzN6L1IPaupozuxAoRBBPl0cAKvUV1WqKd_F3KTSzI';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
