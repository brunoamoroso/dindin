import { supabaseClient } from "./supabaseClient"

export async function getCoinCoversURL(coinCode: string){
    try{
        const supabase = supabaseClient();
        const {data, error} = await supabase.storage.from("dindin-bucket").createSignedUrl(`/assets/coin-covers/${coinCode}.png`, 60);

        if(error){
            throw error;
        }
        
        return data;
    }catch(err){
        console.log(err);
    }
}