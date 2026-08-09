import { supabase } from '../lib/supabase';
import { Tables} from '../lib/database.types';

type Cart = Tables<'Cart'>;

/**
 * 
 */
export const createCart = async(user_id: number) : Promise<number>=>{
    const {data, error} = await supabase
    .from('Cart')
    .insert({user_id: user_id})
    .select('id')
    .single();

    if(error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
    return data.id;
};