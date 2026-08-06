import { getByEAN, addProductToCart, addproductToDB, updateProduct } from '../scan';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { supabase } from '../../lib/supabase';
import type { MockSupabaseClient } from '../../lib/__mocks__/supabase';

jest.mock('../../lib/supabase');

const supabaseMock = supabase as unknown as MockSupabaseClient;

jest.mock('../../lib/supabase');


describe('Tests service scan', ()=>{

    beforeEach(()=>{
        jest.clearAllMocks();

        supabaseMock.from.mockReturnThis();
        supabaseMock.select.mockReturnThis();
        supabaseMock.insert.mockReturnThis();
        supabaseMock.update.mockReturnThis();
        supabaseMock.delete.mockReturnThis();
        supabaseMock.eq.mockReturnThis();
    });

    /* --------------------------------------------------------------------------- */
    /*                               getByEAN                                     */
    /* ------------------------------------------------------------------------- */
    describe('getByEAN', () =>{

        it('doit retourner un produit si le code EAN existe dans la base de donnée', async ()=>{
            const fakeProduct = [{description: 'bien justeuse', EAN: 3017620422003, id: 1, name: "Pomme", price: 0.5, type: "fruit"}];

            supabaseMock.eq.mockResolvedValue({
                data: fakeProduct,
                erro: null,
            });

            const result = await getByEAN(3017620422003);

            expect(supabaseMock.from).toHaveBeenCalledWith('Product'); // Remplace par le nom exact de ta table
            expect(supabaseMock.select).toHaveBeenCalledWith('*');
            expect(supabaseMock.eq).toHaveBeenCalledWith('EAN', 3017620422003);
            expect(result).toEqual(fakeProduct);
        });


        it('doit retourner un tableau vide si le produit est inexistant', async () =>{

            supabaseMock.eq.mockResolvedValue({
                data: [],
                error: null,
            });

            const result = await getByEAN(999999999);

            expect(supabaseMock.eq).toHaveBeenCalledWith('EAN', 999999999);
            expect(result).toEqual([]);
        })


        it('devrait lever une erreur si la requête Supabase échoue', async () => {
            const dbError = new Error('Erreur réseau Supabase');

            supabaseMock.eq.mockResolvedValue({
                data: null,
                error: dbError,
            });

            await expect(getByEAN(3017620422003)).rejects.toThrow('Erreur réseau Supabase');
        });
    })

    /* --------------------------------------------------------------------------- */
    /*                             addProductToCart                               */
    /* ------------------------------------------------------------------------- */
    describe('addProductToCart', () => {
        it('devrait ajouter un produit au panier avec succès', async () => {
            supabaseMock.insert.mockResolvedValue({
                data: null,
                error: null,
            });

            await addProductToCart(10, 5);

            expect(supabaseMock.from).toHaveBeenCalledWith('Contain');
            expect(supabaseMock.insert).toHaveBeenCalledWith([
                { id_cart: 5, id_product: 10 },
            ]);
        });

        it('devrait lever une erreur si l\'insertion dans le panier échoue', async () => {
            const mockError = new Error('Erreur de clé étrangère');

            supabaseMock.insert.mockResolvedValue({
                data: null,
                error: mockError,
            });

            await expect(addProductToCart(10, 5)).rejects.toThrow(mockError);
        });
    });
    /* --------------------------------------------------------------------------- */
    /*                              addproductToDB                                */
    /* ------------------------------------------------------------------------- */
    describe('addproductToDB', () => {
        it('devrait ajouter un produit en BDD et retourner son id', async () => {
            const newProduct = {
                decription:"",
                name: 'Pomme',
                price: 0.5,
                EAN: 3012345678901,
                type: "fruit",
            };

            supabaseMock.single.mockResolvedValue({
                data: { id: 42 },
                error: null,
            });

            const insertedId = await addproductToDB(newProduct);

            expect(supabaseMock.from).toHaveBeenCalledWith('Product');
            expect(supabaseMock.insert).toHaveBeenCalledWith([newProduct]);
            expect(supabaseMock.select).toHaveBeenCalledWith('id');
            expect(insertedId).toBe(42);
        });

        it('devrait lever une erreur si l\'ajout du produit échoue', async () => {
            const mockError = new Error('Violation de contrainte d\'unicité');

            supabaseMock.single.mockResolvedValue({
                data: null,
                error: mockError,
            });

            await expect(
                addproductToDB({ 
                decription:"",
                name: 'Pomme',
                price: 0.5,
                EAN: 3012345678901,
                type: "fruit",
            })
            ).rejects.toThrow(mockError);
        });
    });
    /* --------------------------------------------------------------------------- */
    /*                               updateProduct                                */
    /* ------------------------------------------------------------------------- */
    describe('updateProduct', () => {
        it('devrait mettre à jour un produit et valider les modifications', async () => {
            const updateData = { name: 'Jus d\'orange', price: 3.0 };
            const returnedProduct = [{ id: 1, name: 'Jus d\'orange', price: 3.0 }];

            supabaseMock.select.mockResolvedValue({
                data: returnedProduct,
                error: null,
            });

            await updateProduct(1, updateData);

            expect(supabaseMock.from).toHaveBeenCalledWith('Product');
            expect(supabaseMock.update).toHaveBeenCalledWith(updateData);
            expect(supabaseMock.eq).toHaveBeenCalledWith('id', 1);
            expect(supabaseMock.select).toHaveBeenCalled();
        });

        it('devrait gérer le cas où aucune ligne n\'a été modifiée (ID introuvable)', async () => {
            supabaseMock.select.mockResolvedValue({
                data: [],
                error: null,
            });

            await expect(
                updateProduct(999, { name: 'Inexistant' })
            ).resolves.not.toThrow();
        });

        it('devrait lever une erreur si la mise à jour Supabase retourne une erreur', async () => {
            const mockError = new Error('Erreur de connexion à la BDD');

            supabaseMock.select.mockResolvedValue({
                data: null,
                error: mockError,
            });

            await expect(
                updateProduct(1, { name: 'Jus d\'orange' })
            ).rejects.toThrow(mockError);
        });
    });
});
