import { Text, View, TextInput, Button, Alert } from "react-native"
import { useForm, Controller } from "react-hook-form"

interface AddProductProps {
    codeEAN: number;
}

interface FormInputs {
    EAN: string;
    Produit: string;
    prix: string;
//ajouter au fur et à mesure de l'avancement du formulaire
}

export default function addProduct({codeEAN} : AddProductProps) {
    const{ control, handleSubmit, formState: {errors}} = useForm({defaultValues:{
        EAN : String(codeEAN),
        Produit : "",
        prix: "",

    }})

    const onSubmit = async (data: {})=>{}// à changer et mettre la fonction addProductToDB et remplir avec les champs du formulaire

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
            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
    )

}
