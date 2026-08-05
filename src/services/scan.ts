import { supabase } from '../lib/supabase';
import { Tables, TablesInsert, TablesUpdate} from '../lib/database.types';

// Extraction rapide de tes types pour un code plus lisible
type Product = Tables<'Product'>;
type Cart = Tables<'Cart'>;

/**
 * Fonction qui recupère un produit par son code EAN dans la base de donnée
 * eanCode: number
 * return une liste de produit
 */
export const getByEAN = async (eanCode : number) : Promise <Product[]> => {
    const { data, error } = await supabase
    .from('Product')
    .select('*')
    .eq('EAN', eanCode);


    if(error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }

    return data ?? []
};

/**
 * 
 */
export const addProductToCart = async (productId :number, cartId: number) : Promise<void> =>{
    const {data, error} = await supabase
    .from('Contain')
    .insert([
        {id_cart: cartId, id_product: productId}
    ]);

    if(error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
};

/**
 * 
 */
export const addproductToDB = async (newProduct: TablesInsert<'Product'>) : Promise<number> =>{
    const {data, error}= await supabase
    .from('Product')
    .insert([newProduct])
    .select('id')
    .single();

    if(error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
    return data.id
};

/**
 * 
 */
export const updateProduct = async ( product_id: number, updateProduct:TablesUpdate<'Product'>) : Promise<void>=>{
    const {data : updatedData, error}= await supabase
    .from('Product')
    .update(updateProduct)
    .eq('id', product_id)
    .select();

    if(error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }

    if (updatedData && updatedData.length > 0) {
        const result = updatedData[0];
        
        const isNameUpdated = result.name === updateProduct.name;
        const isPriceUpdated = result.price === updateProduct.price;

        if (isNameUpdated && isPriceUpdated) {
            console.log("Mise à jour confirmée et conforme :", result);
        } else {
            console.warn("La donnée enregistrée diffère de la donnée envoyée.");
        }
        } else {
        console.warn("Aucune ligne n'a été modifiée (ID introuvable ou règles RLS).");
        }
};

