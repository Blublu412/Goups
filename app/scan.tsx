import { Text, View, StyleSheet,Button, TouchableOpacity} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { useRouter } from "expo-router";

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    const [data,setData]= useState(null);
    const [scanned,setScanned]= useState(false);
    const router = useRouter();

    if(!permission){
        return <View/>;
    }

    if(!permission.granted){
        return (
            <View style={styles.container}>
                <Text>Si vou voulez scanner des article, il faut l'autorisation d'utiliser la caméra.</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const HandleBarCodeScanned = ({data}) =>{
        setScanned(true);
        setData(data);
    }

    return (
        <View style={styles.container}>
            <CameraView
            style={styles.camera}
            facing='back'
            onBarcodeScanned={scanned? undefined : HandleBarCodeScanned}
            barcodeScannerSettings={{barcodeTypes: ["ean13", "ean8"]}}
            />
            {scanned && (
                <View>
                    <Text>Code détecté: {data}</Text>
                    <Button title="HomePage" onPress={()=>{
                        setScanned(false);
                        router.push("/")
                    }
                    }/>
                </View>
            )}

        </View>
    );
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex:1
  },
  resultContainer: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
});