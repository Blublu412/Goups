import { supabase } from '../lib/supabase';
import { Tables, TablesInsert, TablesUpdate} from '../lib/database.types';

// Extraction rapide de tes types pour un code plus lisible
type Product = Tables<'Product'>;

/**
 * Fonction qui recupère un produit par son code EAN dans la base de donnée
 * @param eanCode: number
 * @returns une liste de produit
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
 * Fonction qui ajoute un produit à un chariot
 * @param productId l'id du produit
 * @param cartId l'id du chariot actuelle
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
 * Fonction qui ajoute un produit à la base de donnée
 * @param newProduct 
 * @returns un nombre qui est l'id du produit qui vient d'être ajouté
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
 * Fonction qui modifie un produit en base de donnée
 * @param product_id id du produit que l'on veux modifié
 * @param updateProduct le produit modifié
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

/**
 * Fonction qui permet d'obtenir un produit  par son id
 * @param product_id l'id du produit
 * @returns le produit
 */
export const getProductById = async (product_id:number) : Promise<Product> =>{
    const {data, error} = await supabase
    .from('Product')
    .select('*')
    .eq('id', product_id); 

    if (error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }

    return data[0];
};

/**
 * Fonction qui permet d'obtenir plusieurs produit par leur ids réspectif
 * @param products_id les id des produits recherché
 * @returns les produits
 */
export const getProductsByIds= async (products_id: number[]): Promise<Product[]> =>{
    const {data, error} =await supabase
    .from('Product')
    .select('*')
    .in('id', products_id);

    if (error){
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }

    return data;
};


