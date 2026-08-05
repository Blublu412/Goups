import { getByEAN } from '../scan';
import { supabase } from '../../lib/supabase';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../lib/supabase');

const supabaseMock = supabase as any;

//Tests getByEAN
describe('getByEAN', () =>{
    //fait avant chaque test
    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('doit retourner un produit si le code EAN existe dans la base de donnée', async ()=>{
        const fakeProduct = [{description: 'bien justeuse', EAN: 3017620422003, id: 1, name: "Pomme", price: 0.5, type: "fruit"}];

        (supabaseMock.eq as jest.Mock<any>).mockResolvedValue({
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

        (supabaseMock.eq as jest.Mock<any>).mockResolvedValue({
            data: [],
            error: null,
        });

        const result = await getByEAN(99999999999);

        expect(supabaseMock.eq).toHaveBeenCalledWith('EAN', 999999999);
        expect(result).toEqual([]);
    })


    it('devrait lever une erreur si la requête Supabase échoue', async () => {
        const dbError = new Error('Erreur réseau Supabase');

        (supabaseMock.eq as jest.Mock<any>).mockResolvedValue({
            data: null,
            error: dbError,
        });

        await expect(getByEAN(3017620422003)).rejects.toThrow('Erreur réseau Supabase');
    });
})

//TESTS addProductToCart
