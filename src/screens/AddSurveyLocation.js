// LocationAdd.js
import React, { useState } from "react";
import { ImageBackground, StyleSheet, useColorScheme, Dimensions, StatusBar, TouchableOpacity, Image, ToastAndroid } from "react-native";
import { View, Text, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { COLOR } from '../common/typography';
import CustomDropDownPicker from "../components/CustomDropDownPicker";
import callApi from "../ApiRequest";
import { APIS_ENDPOINT } from "../Constants";
import Customloader from "../components/Customloader";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const AddSurveyLocation = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };
    const labelStyle = {
        color: isDarkMode ? 'white' : 'black', marginVertical: 10, fontWeight: '600'
    };

    const [isLoading, setLoading] = useState(false);
    const [openWard, setOpenWard] = useState(false);
    const [valueWard, setValueWard] = useState(null);
    const [itemsWard, setItemsWard] = useState(
        Array.from({ length: 35 }, (_, i) => ({
            label: `${i + 1}`,
            value: i + 1,
        }))
    );
    const [locationName, setLocationName] = useState("");

    const validateLocation = () => {
        if (valueWard != "" && locationName != "") {
            setLoading(true);
            const payload = {
                payLoad: {                            
                    locationName: locationName,
                    wardId: valueWard
                }
            };

            callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.SUBMIT_NEW_LOCATION, 'POST', payload)
                .then(data => {
                    setLoading(false);
                    showToast('New location added successfully');
                    clearAllInput();
                })
                .catch(error => {
                    setLoading(false);
                    console.error('Error:Submit', error);
                });

        }else{
            showToast('Fill both fields!')
        }
    }

    const clearAllInput = () =>{
        setValueWard("");
        setLocationName("");
    }

    const showToast = (message) => {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
        );
    }

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />

            <ImageBackground
                source={require('../../assets/bg.png')}
                resizeMode="stretch"
                style={styles.img}>

                <View style={{ height: screenHeight, width: screenWidth }}>
                    <View style={{ backgroundColor: 'rgba(227, 66, 52, 0.5)', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: COLOR.WHITE, fontSize: 20, textAlign: 'center', alignSelf: 'center' }}>Add New Survey Location</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/close.png')} style={{ width: 40, height: 40, }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ margin: 20 }}>
                        <Text style={labelStyle}>Ward</Text>
                        <CustomDropDownPicker
                            open={openWard}
                            value={valueWard}
                            items={itemsWard}
                            setOpen={setOpenWard}
                            setValue={setValueWard}
                            setItems={setItemsWard}
                            placeholder="Select Ward"
                            zIndex={1000}
                            // onSelectItem={handleWardChange}
                            arrowIconStyle={{ tintColor: COLOR.PRIMARY }}
                            min={100}
                            search={false}
                        />
                        <Text style={labelStyle}>Location Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter location"
                            value={locationName}
                            onChangeText={setLocationName}
                            placeholderTextColor={COLOR.GRAY_LITE}
                        />

                        <TouchableOpacity onPress={() => validateLocation()} style={styles.submitBtn}>
                            <Image source={require('../../assets/add.png')} style={styles.addIcon} />
                            <Text style={{ color: COLOR.WHITE, textAlign: 'center', fontWeight: 700, marginLeft: 10 }}>Add Location</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {isLoading ? <Customloader /> : null}
            </ImageBackground>

        </SafeAreaView>


    );
};

export default AddSurveyLocation;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%'
    },
    img: {
        height: screenHeight,
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 7,
        backgroundColor: 'white',
        padding: 10,
        color: COLOR.BLACK
    },
    submitBtn: {
        height: 50, backgroundColor: COLOR.PRIMARY, justifyContent: 'center', borderRadius: 10, marginTop: 30, alignItems: 'center', flexDirection: 'row'
    },
    addIcon: {
        width: 25,
        height: 25,
        tintColor: COLOR.WHITE
    },
});
