import { supabase } from '../lib/supabase';
import { Tables} from '../lib/database.types';

type Cart = Tables<'Cart'>;
type Product = Tables<'Product'>;

interface productId{
    id_product: number; 
}

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

/**
 * 
 */
export const getCarts = async(user_id: number): Promise<Cart[]> =>{
    const date = new Date();
    date.setDate(date.getDate()-31);
    const {data, error} = await supabase
    .from('Cart')
    .select()
    .lt('created_at', date);

    if(error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
    return data
}

/**
 * 
 */
export const getProductIdInCart = async(cart_id:number): Promise<productId[]> =>{
    const {data, error} = await supabase
    .from('Contain')
    .select('id_product')
    .eq('id_cart',cart_id)

    if(error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
    
    return data;

}