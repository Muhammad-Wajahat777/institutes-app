// Initializing;
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://jtaholowzfoikxhdytvm.supabase.co";
const supabaseKey = "sb_publishable_E9YiopoR8JGyEzmlibnCNQ_fAw8tcKU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;