import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({path: ".env.local"});

export function supabaseClient(): SupabaseClient{
    return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
}