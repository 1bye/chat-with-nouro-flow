import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.SUPABASE_DB_URL;
const supabaseKey = process.env.SUPABASE_DB_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error("Not found supabase credentials")
}

export const client = createClient(supabaseUrl, supabaseKey)