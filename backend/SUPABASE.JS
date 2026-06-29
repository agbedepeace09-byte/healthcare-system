require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 1. Pull the secrets from the hidden .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// 2. Safety check to make sure the .env file is actually working
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Check your backend .env file.");
  process.exit(1);
}

// 3. Initialize the connection
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;