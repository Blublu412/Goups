import { supabase } from '../lib/supabase';
import { Tables} from '../lib/database.types';

type Cart = Tables<'Cart'>;
type Product = Tables<'Product'>;

interface productId{
    id_product: number; 
}

/**
 * Fonction qui crée un panier
 * @param user_id l'id du compte connecté
 * @returns l'id du panier qui vient d'être crée
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
 * Focntion qui permet d'obtenir tout les panier de moins de 1mois d'un compte
 * @param user_id l'id du compte connecté
 * @returns une liste de panier
 */
export const getCarts = async(user_id: number): Promise<Cart[]> =>{
    const date = new Date();
    date.setDate(date.getDate()-31);
    const {data, error} = await supabase
    .from('Cart')
    .select('*')
    .lt('created_at', date);

    if(error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
    return data
}

/**
 * Fonction qui permet d'obtenir les id des produits dans un panier
 * @param cart_id l'id du panier
 * @returns une liste de nombre qui sont des id de produits 
 */
export const getProductsIdInCart = async(cart_id:number): Promise<productId[]> =>{
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