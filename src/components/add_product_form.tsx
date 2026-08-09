import { Text, View, TextInput, Button } from "react-native";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import{ addproductToDB, addProductToCart, updateProduct} from '../services/scan';

interface AddProductProps {
    data: {
        decription: string | null;
        EAN: number | null;
        id: number;
        name: string;
        price: number | null;
        type: string;
        };
    cart_id: number;
    onClose: () => void;
};

interface FormInputs {
    EAN: string;
    Produit: string;
    prix: string;
    type: string;
    description: string | null;
}

export default function AddProductForm({data,cart_id,onClose}: AddProductProps){
    const [modif, setModif] = useState(false);
    const{ control, handleSubmit, formState: {errors}} = useForm({defaultValues:{
        EAN : String(data.EAN),
        Produit : data.name,
        prix: String(data.price),
        type : data.type,
        description: data.decription,

    }})

    const onChange = () =>{
        setModif(true)
    }

    const onSubmit = async (formdata: FormInputs)=>{
        if(modif){
            try{
                const eanAsNumber = parseInt(formdata.EAN, 10);
                const priceAsFloat = parseFloat(formdata.prix);
    
                await updateProduct(data.id,{
                    EAN: eanAsNumber,
                    name: formdata.Produit,
                    price: priceAsFloat,
                    type: formdata.type,
                    decription: formdata.description
                });
    
            }catch{
                alert("Erreur lors de l'insertion en base de données.");
            }
        }
        //await addProductToCart(product_id, cart_id);
        onClose();
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
                        editable={modif}
                        onChangeText={onChange}
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
                        editable={modif}
                        keyboardType="decimal-pad"
                        onChangeText={onChange}
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
                        editable={modif}
                        onChangeText={onChange}
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
                        editable={modif}
                        numberOfLines={4}
                        onChangeText={onChange}
                        value={value??""}/>
                    </View>
                )}/>
                {errors.type && <Text>Le type est requis</Text>}
            {!modif && <Button title="Modifier les informations" onPress={onChange} />}
            <Button title="Ajouter au panier" onPress={handleSubmit(onSubmit)} />
        </View>
    )

}