import { supabaseClient } from "./supabaseClient"

export async function getCoinCoversURL(coinImg: string): Promise<string | undefined>{
    try{
        const supabase = supabaseClient();
        const {data, error} = await supabase.storage.from("dindin-bucket").createSignedUrl(`/assets/coin-covers/${coinImg}.png`, 60);

        if(error){
            throw error;
        }
        
        return data.signedUrl;
    }catch(err){
        console.error(err);
    }
}