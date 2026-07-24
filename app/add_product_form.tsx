import { Text, View, TextInput, Button, Alert } from "react-native"
import { useForm, Controller } from "react-hook-form"
import{ addproductToDB, addProductToCart} from '../src/services/scan'

interface AddProductProps {
    codeEAN: number;
    cart_id: number;
}

interface FormInputs {
    EAN: string;
    Produit: string;
    prix: string;
    type: string;
    description: string
//ajouter au fur et à mesure de l'avancement du formulaire
}

export default function addProduct({codeEAN, cart_id} : AddProductProps) {
    const{ control, handleSubmit, formState: {errors}} = useForm({defaultValues:{
        EAN : String(codeEAN),
        Produit : "",
        prix: "",
        type : "",
        description: "",

    }})

    const onSubmit = async (data: FormInputs)=>{
        try{
            const eanAsNumber = parseInt(data.EAN, 10);
            const priceAsFloat = parseFloat(data.prix);

            const newId = await addproductToDB({
                EAN: eanAsNumber,
                name: data.Produit,
                price: priceAsFloat,
                type: data.type,
                decription: data.description
            });

            await addProductToCart(newId, cart_id);
            //alert("Produit ajouté au panier");
        }catch{
            alert("Erreur lors de l'insertion en base de données.");
        }
    }// à changer et mettre la fonction addProductToDB et remplir avec les champs du formulaire

    return(
        <View>
            <Controller 
                control={control}
                name ="EAN"
                render={({field : {value}}) =>(
                    <View>
                        <Text>Code EAN</Text>
                        <TextInput
                        editable={false}
                        value={value}/>
                    </View>
                )}/>
            {errors.EAN && <Text> Le code EAN est obligatoire</Text>}
            <Controller
                control={control}
                rules={{
                    required:true,
                }}
                name="Produit"
                render={({field : {onChange, onBlur, value}})=>(
                    <View>
                        <Text>Nom du produit:</Text>
                        <TextInput
                        placeholder="nom du Produit"
                        onChange={onChange}
                        value={value}/>
                    </View>
                )}/>
            {errors.Produit && <Text>Le noms du produit est requis</Text>}
            <Controller
                control={control}
                rules={{
                    required:true,
                    pattern: {
                        value: /^\d+([.,]\d{1,2})?$/,
                        message: "Format invalide (ex: 10.50 ou 10)"
                    },
                }}
                name="prix"
                render={({field : {onChange, onBlur, value}})=>(
                    <View>
                        <Text>Prix:</Text>
                        <TextInput
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        onChange={onChange}
                        value={value}/>
                    </View>
                )}/>
            {errors.prix && <Text>Le prix est requis</Text>}
            <Controller
                control={control}
                rules={{
                    required:true,
                }}
                name="type"
                render={({field : {onChange, onBlur, value}})=>(
                    <View>
                        <Text>Type du produit:</Text>
                        <TextInput
                        placeholder="mettre le type du produit"
                        onChange={onChange}
                        value={value}/>
                    </View>
                )}/>
                {errors.type && <Text>Le type est requis</Text>}
                <Controller
                control={control}
                rules={{
                }}
                name="description"
                render={({field : {onChange, onBlur, value}})=>(
                    <View>
                        <Text>Description:</Text>
                        <TextInput
                        multiline
                        numberOfLines={4}
                        onChange={onChange}
                        value={value}/>
                    </View>
                )}/>
                {errors.type && <Text>Le type est requis</Text>}
            <Button title="Ajouter au panier" onPress={handleSubmit(onSubmit)} />
        </View>
    )

}
