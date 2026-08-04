import { Text, View, StyleSheet,Button, TouchableOpacity, Alert} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useMemo, useRef } from 'react';
import { useRouter } from "expo-router";
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {getByEAN} from '../src/services/scan';
import CreateProductForm from '../src/components/create_product_form';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface BarCodeScannerResult {
    data: string;
    type: string;
}

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    const [data,setData]= useState(0);
    const [scanned,setScanned]= useState(false);
    const [exist, setExist]= useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['50%', '90%'], []);

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

    const HandleBarCodeScanned = async ({data}: BarCodeScannerResult) =>{
        const eanNumber = Number(data);
        const products = await getByEAN(eanNumber)
        setScanned(true);
        if (products.length != 0){
            setExist(true)
        }
        setData(eanNumber);
    };

    const HandleCloseSheet = () => {
        bottomSheetRef.current?.close();
    };
    //TODO changer le cart id
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <CameraView
                style={styles.camera}
                facing='back'
                onBarcodeScanned={scanned? undefined : HandleBarCodeScanned}
                barcodeScannerSettings={{barcodeTypes: ["ean13", "ean8"]}}
                />
                {!exist && scanned && (
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={0}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}
                        onChange={(index)=>{
                            if(index==-1){
                                setScanned(false)
                            }
                        }}>
                        <BottomSheetView>
                            <CreateProductForm codeEAN={data} cart_id={0} onClose={HandleCloseSheet}/>
                        </BottomSheetView>
                    </BottomSheet>

                )}
            </View>
        </GestureHandlerRootView>
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