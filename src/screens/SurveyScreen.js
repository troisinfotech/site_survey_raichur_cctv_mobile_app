import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    ToastAndroid,
    TextInput,
    Modal,
    Alert,
    TouchableHighlight,
    ActivityIndicator,
    BackHandler,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import callApi from '../ApiRequest';
import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { APIS_ENDPOINT } from '../Constants';
import Customloader from '../components/Customloader';
import Video from 'react-native-video';
import CustomDropDownPicker from '../components/CustomDropDownPicker';
import { COLOR } from '../common/typography';
import QuestionnaireItem from '../components/QuestionnaireItem';
import { requestLocationPermission } from '../common/utils/userPermissionUtils';
import { captureImage, chooseFile } from '../common/utils/fileUploadUtils';
import { useFocusEffect } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const itemsAreaType = [
    { label: "Market", value: "Market" },
    { label: "Street", value: "Street" },
    { label: "Residential", value: "Residential" },
    { label: "Public Space", value: "Public Space" }
];

const questions = [
    { id: 1, text: "Is there an existing CCTV pole or mounting structure available?" },
    { id: 2, text: "Is the location suitable for monitoring garbage dumping?" },
    { id: 3, text: "Is the location suitable for monitoring face detection & recognition?" },
    { id: 4, text: "Is the location suitable for monitoring potholes and streetlights?" },
    { id: 5, text: "Is there a stable power supply at the location?" },
    { id: 6, text: "Is there an internet connection (Fiber/Wi-Fi/4G) available?" },
    { id: 7, text: "Are there frequent power outages in the area?" },
    { id: 8, text: "Are there obstructions (trees, poles, buildings) that might block the camera view?" },
    { id: 9, text: "Is the location well-lit at night for face detection?" },
    { id: 10, text: "Are streetlights staying ON even during daytime in this area?" },
    { id: 11, text: "Is the area prone to extreme weather conditions (heavy rain, dust, fog)?" },
    { id: 12, text: "Is local community support required for installation?" },
    { id: 13, text: "Is there a risk of camera vandalism or tampering?" },
];

const SurveyScreen = ({ navigation }) => {

    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };
    const labelStyle = {
        color: isDarkMode ? 'white' : 'black', marginVertical: 10, fontWeight: '600'
    };
    const labelStyle2 = {
        color: 'black', marginVertical: 10, fontWeight: '600'
    };
    const tilteStyle = {
        color: COLOR.PRIMARY, marginVertical: 20, textAlign: 'center', fontSize: 20, fontWeight: '900', fontFamily: 'Arial', fontStyle: 'italic'
    };

    const [isUpdate, setIsUpdate] = useState(false);
    const [openWard, setOpenWard] = useState(false);
    const [valueWard, setValueWard] = useState(null);
    const [itemsWard, setItemsWard] = useState(
        Array.from({ length: 35 }, (_, i) => ({
            label: `${i + 1}`,
            value: i + 1,
        }))
    );
    const [openBlackSpot, setOpenBlackSpot] = useState(false);
    const [valueBlackSpot, setValueBlackSpot] = useState(null);
    const [itemsBlackSpot, setItemsBlackSpot] = useState([]);
    const [openArea, setOpenArea] = useState(false);
    const [valueArea, setValueArea] = useState(null);
    const [itemsArea, setItemsArea] = useState(itemsAreaType);
    const [locationCoord, setLocationCoord] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [previewId, setPreviewId] = useState('');
    const [previewType, setPreviewType] = useState('');
    const [getAttach, setAttach] = useState([]);
    const [getAttachement, setAttachement] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [paused, setPaused] = useState(true);
    const [muted, setMuted] = useState(false);
    const videoRef = useRef(null);
    const [isBuffering, setBuffering] = useState(false);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [ptzCount, setPtzCount] = useState("");
    const [generalCount, setGeneralCount] = useState("");
    const [siteDetail, setSiteDetail] = useState(null);

    const [answers, setAnswers] = useState(
        questions.map((q) => ({ questionId: q.id, response: "false", remarks: "" }))
    );

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                Alert.alert(
                    "Exit App",
                    "Are you sure you want to exit?",
                    [
                        { text: "Cancel", onPress: () => null, style: "cancel" },
                        { text: "Exit", onPress: () => BackHandler.exitApp() },
                    ],
                    { cancelable: false }
                );
                return true; // Prevent default back action
            };

            const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

            return () => backHandler.remove(); // Cleanup when screen is not focused
        }, [])
    );

    //**Set_Values_of_Site*//
    useEffect(() => {
        if (siteDetail != null) {
            setIsUpdate(true);
            //   // console.log("siteDetaillll", siteDetail);
            setLocationCoord(siteDetail?.generalInformationDto?.gpsCoordinates);
            setValueArea(siteDetail?.generalInformationDto?.areaType);
            setPtzCount(String(siteDetail?.generalInformationDto?.ptzCamCount));
            setGeneralCount(String(siteDetail?.generalInformationDto?.generalCamCount));

            { siteDetail?.generalInformationDto?.attachments !== null ? setAttachement(siteDetail?.generalInformationDto?.attachments) : setAttachement([]) }

            if (siteDetail?.storageDto?.length > 0) {
                setAnswers(siteDetail?.storageDto.map(item => ({
                    questionId: item.questionId,
                    response: item.response,
                    remarks: item.remarks,
                })));
            }
        } else {
            setIsUpdate(false);
        }
    }, [siteDetail])

    const handleValueChange = (index, newValue) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[index] = { ...updatedAnswers[index], response: newValue };
            return updatedAnswers;
        });
    };

    const handleRemarkChange = (index, newRemark) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[index] = { ...updatedAnswers[index], remarks: newRemark };
            return updatedAnswers;
        });
    };

    const togglePlayPause = () => {
        setPaused(!paused);
    };

    const handleBuffer = (buffer) => {
        setBuffering(buffer.isBuffering);
    };

    const handleEnd = () => {
        // Video playback has ended, you can perform any action here
        // For example, reset the video to the beginning
        videoRef.current.seek(0);
        setPaused(true);
    };

    //**Select dropdown values*//
    const handleWardChange = (item) => {
        getSiteCode(item.label);
    };

    const handleLocationChange = (item) => {
        clearAllInput();
        getSiteDetail(item.value);
    }

    //**LOCATION*//
    const getCurrentLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {

            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        setLatitude(latitude);
                        setLongitude(longitude);
                        setLocationCoord(latitude + "," + longitude);
                    },
                    error => {
                        showLocationAlert();
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
    };

    // confirm before clear all input fields//
    const handeleClear = () => {
        Alert.alert(
            "Confirm Reset",
            "Are you sure you want to reset the form?",
            [
                { text: "Cancel", onPress: () => null, style: "cancel" },
                { text: "Reset", onPress: () => clearAllInput() },
            ],
            { cancelable: false }
        );
    }

    // clear all input fields//
    const clearAllInput = () => {
        setAttach([]);
        setAttachement([]);
        setValueWard("");
        setValueBlackSpot("");
        setLocationCoord("");
        setValueArea("");
        setAnswers(questions.map((q) => ({ questionId: q.id, response: "false", remarks: "" })));
        setOpenBlackSpot(false);
        setOpenWard(false);
        setOpenArea(false);
        setPtzCount("");
        setGeneralCount("");
    };

    // get Site Code api//
    const getSiteCode = (siteLabel) => {
        callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.SITE_CODE + siteLabel, 'GET')
            .then(data => {
                const dropdownItems = data.map(item => ({
                    label: item.name,
                    value: item.id.toString()
                }));
                setItemsBlackSpot(dropdownItems);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // submit api call//
    const submitSurvey = () => {
        if (valueBlackSpot !== "" && locationCoord !== "" && valueArea !== "") {
            isValid = true;
        } else {
            isValid = false;
        }

        if (isValid) {
            setLoading(true);
            const locationData = {
                locationId: valueBlackSpot,
                gpsCoordinates: locationCoord,
                areaType: valueArea,
                ptzCamCount: ptzCount,
                generalCamCount: generalCount,
            };

            const finalPayload = createPayload(locationData, getAttachement, answers);
            // console.log("fefefe", finalPayload)
            callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.SURVEY_SUBMIT, isUpdate ? 'PATCH' : 'POST', finalPayload)
                .then(data => {
                    setLoading(false);
                    ToastAndroid.showWithGravity(
                        'Survey added successfully',
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                    );
                    clearAllInput();
                })
                .catch(error => {
                    setLoading(false);
                    console.error('Error:Submit', error);
                });
        } else {
            Alert.alert("Submit Survey ", 'Fill all fields!');
        }
    }

    const createPayload = (location, attachmentList, responseList) => {
        return {
            payLoad: {
                generalInformationDto: {
                    ...location,
                    attachments: attachmentList.map(({ id, fileExtn, fileSizeKb, contentType, resourceName }) => ({
                        id,
                        fileExtn,
                        fileSizeKb,
                        contentType,
                        resourceName,
                    })),
                },
                storageDto: responseList.map(({ questionId, response, remarks }) => ({
                    questionId,
                    response,
                    remarks: remarks || "",
                })),
            },
        };
    };

    //**Get_Site_Detail*//
    const getSiteDetail = (siteCode) => {
        callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.SITE_CODE_DETAIL + siteCode, 'GET')
            .then(data => {
                setSiteDetail(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //**Add_File_To_Array*//
    const addFileToArray = (response) => {
        const newImageUri = response.assets[0]?.uri;
        setAttach([...getAttach, newImageUri]);
        uploadFile(response);
    }

    //**Upload-Image*//
    const uploadFile = async (response) => {
        setLoading(true);
        // console.log("imageUri", response);
        const formData = new FormData();
        formData.append('resourceFile', {
            uri: response?.assets[0]?.uri,
            name: response?.assets[0]?.fileName,
            type: response?.assets[0]?.type,
        });

        try {
            // console.log(formData,'formData')
            const response = await fetch(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.FILE_UPLOAD_MULTI, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();
            // console.log("success", data);
            getUploadedFile(data?.payLoad?.id);
        } catch (error) {
            setLoading(false);
            console.error('Error uploading image:', error);
        }
    };

    // get Site Code api//
    const getUploadedFile = (fileId) => {
        callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.FILE_UPLOAD_GET + fileId, 'GET')
            .then(data => {
                // console.log("dataaaaaGet", data);
                const newImagePay = data?.payLoad;
                setAttachement([...getAttachement, newImagePay].flat());
                setLoading(false);
                ToastAndroid.showWithGravity(
                    'File updated successfully',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                );
            })
            .catch(error => {
                setLoading(false);
                console.error('Error:FileGet', error);
            });
    }

    //**Delete-File-Alert*//
    const deleteConfirmAlert = (index) => {
        Alert.alert(
            "Delete file!",
            "Are you sure to delete this file?",
            [
                { text: "Yes", onPress: () => deleteImage(index) },
                {
                    text: "No",
                    onPress: () => console.log(""),
                    style: "cancel",
                },
            ],
            {
                cancelable: true,
            }
        );
    };

    //**Delete-File*//
    const deleteImage = (index) => {
        setAttachement(prevState => prevState.filter((_, i) => i !== index));
        ToastAndroid.showWithGravity(
            'File removed. Submit the survey to update the changes.',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
        );
    };

    const viewFile = (id, type) => {
        setPreviewId(id);
        setPreviewType(type);
        setPreviewModalVisible(true);
    }

    const checkNewLocation = () => {
        clearAllInput();
        navigation.navigate("LocationAdd")
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

                <ScrollView keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                    <View style={{ flex: 1, margin: 15, paddingBottom: 300 }}>
                        <Text style={tilteStyle}>SITE SURVEY</Text>

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
                            onSelectItem={handleWardChange}
                            arrowIconStyle={{ tintColor: COLOR.PRIMARY }}
                            min={100}
                            search={false}
                        />

                        {/* <Text style={labelStyle}>Survey Location</Text> */}
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                            <Text style={labelStyle}>Survey Location </Text>
                            <TouchableOpacity style={{
                                backgroundColor: 'white', width: 25,
                                height: 25, borderRadius: 5,
                            }} onPress={() => checkNewLocation()}>
                                <Image source={require('../../assets/add.png')} style={styles.addIcon} />
                            </TouchableOpacity>
                        </View>
                        <CustomDropDownPicker
                            open={openBlackSpot}
                            value={valueBlackSpot}
                            items={itemsBlackSpot}
                            setOpen={setOpenBlackSpot}
                            setValue={setValueBlackSpot}
                            setItems={setItemsBlackSpot}
                            placeholder="Select survey location"
                            zIndex={1000}
                            onSelectItem={handleLocationChange}
                            arrowIconStyle={{ tintColor: COLOR.PRIMARY }}
                            min={100}
                            search={true}
                        />

                        {valueBlackSpot && <View>
                            <Text style={labelStyle}>Location</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input2}
                                    placeholder="Enter location coordinates"
                                    value={locationCoord}
                                    onChangeText={setLocationCoord}
                                    keyboardType='decimal-pad'
                                    placeholderTextColor={COLOR.GRAY_LITE}
                                />
                                <TouchableOpacity onPress={getCurrentLocation}>
                                    <Image source={require('../../assets/target.png')} style={styles.icon} />
                                </TouchableOpacity>
                            </View>

                            <Text style={labelStyle}>Type of Area</Text>
                            <CustomDropDownPicker
                                open={openArea}
                                value={valueArea}
                                items={itemsArea}
                                setOpen={setOpenArea}
                                setValue={setValueArea}
                                setItems={setItemsArea}
                                placeholder="Select area type"
                                zIndex={1000}
                                arrowIconStyle={{ tintColor: COLOR.PRIMARY }}
                                min={100}
                                maxHeight={180}
                                search={false}
                            />

                            <Text style={labelStyle}>Camera Requirement</Text>
                            <View style={{ flexDirection: 'row', flex: 1, borderWidth: 0.2, borderColor: COLOR.WHITE, padding: 10, borderRadius: 5 }}>
                                <View style={{ flex: 1, marginTop: -10 }}>
                                    <Text style={labelStyle}>PTZ Count</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter count"
                                        value={ptzCount}
                                        onChangeText={setPtzCount}
                                        placeholderTextColor={COLOR.GRAY_LITE}
                                        keyboardType='numeric'
                                    />
                                </View>
                                <View style={{ flex: 1, marginTop: -10 }}>
                                    <Text style={labelStyle}>General Count</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter count"
                                        value={generalCount}
                                        onChangeText={setGeneralCount}
                                        placeholderTextColor={COLOR.GRAY_LITE}
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>

                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                                <Text style={labelStyle}>Attach file (Image & Video) </Text>
                                <TouchableOpacity style={{
                                    backgroundColor: 'white', width: 25,
                                    height: 25, borderRadius: 5
                                }} onPress={() => setModalVisible()}>
                                    <Image source={require('../../assets/file_add.png')} style={styles.addIcon} />
                                </TouchableOpacity>
                            </View>

                            {getAttachement !== null ?
                                <ScrollView horizontal={true} contentContainerStyle={styles.imageList}>
                                    {getAttachement.map((item, index) => (
                                        <TouchableOpacity onPress={() => viewFile(item.id, item.fileExtn)}>
                                            <ImageBackground key={item?.id}
                                                source={
                                                    item.fileExtn !== "mp4"
                                                        ? { uri: APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.FILE_DOWNLOAD + item.id }
                                                        : require('../../assets/video.png')
                                                }
                                                style={{ height: 70, width: 70, margin: 5 }}>
                                                <TouchableHighlight
                                                    style={{ alignItems: 'flex-end' }}
                                                    onPress={() => deleteConfirmAlert(index)}
                                                >
                                                    <Image source={require('../../assets/delete.png')} style={styles.addIcon} />
                                                </TouchableHighlight>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                : null}

                            <View>
                                {questions.map((question, index) => {
                                    // console.log(`🔹 Question ${question.id} - API Response:`, answers[index]?.response);
                                    return (
                                        <QuestionnaireItem
                                            key={question.id}
                                            question={question.text}
                                            value={answers[index]?.response} // Pass boolean value
                                            onChange={(value) => handleValueChange(index, value)}
                                            remark={answers[index]?.remarks || ""}
                                            setRemark={(remark) => handleRemarkChange(index, remark)}
                                        />
                                    );
                                })}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30, }}>
                                <TouchableOpacity onPress={() => handeleClear()} style={styles.resetBtn}>
                                    <Text style={{ color: COLOR.WHITE, textAlign: 'center', fontWeight: 700 }}>Reset</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => submitSurvey()} style={styles.submitBtn}>
                                    <Text style={{ color: COLOR.WHITE, textAlign: 'center', fontWeight: 700 }}>{isUpdate ? "Update" : "Submit"}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>}

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(false);
                            }}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <View style={{ alignItems: 'center', marginVertical: 20 }}>
                                        <Image source={require('../../assets/media.png')} style={{ width: 35, height: 35, tintColor: COLOR.PRIMARY }} />
                                        <Text style={{ color: 'black', marginVertical: 20, marginHorizontal: 25, fontSize: 18, textAlign: 'center' }}>Choose the picker to attach your files. (Images & Videos)</Text>
                                        <TouchableOpacity onPress={() => [captureImage("photo", addFileToArray), setModalVisible(false)]}>
                                            <Text style={styles.imgButtonStyl}>Image using Camera</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => [captureImage('video', addFileToArray), setModalVisible(false)]}>
                                            <Text style={styles.imgButtonStyl}>Video using Camera</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => [chooseFile('photo', addFileToArray), setModalVisible(false)]}>
                                            <Text style={styles.imgButtonStyl}>Image from Gallery</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => [chooseFile('video', addFileToArray), setModalVisible(false)]}>
                                            <Text style={styles.imgButtonStyl}>Video from Gallery</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                                            <Text style={[styles.imgButtonStyl, { backgroundColor: '#E9EAEC' }]}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </Modal>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={previewModalVisible}
                            onRequestClose={() => {
                                setPreviewModalVisible(false);
                            }}
                        >
                            <View style={styles.modalContainer2}>
                                <View style={styles.modalContent2}>
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => setPreviewModalVisible(false)} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
                                            <Image source={require('../../assets/close.png')} style={{ width: 35, height: 35 }} />
                                        </TouchableOpacity>
                                        {previewType !== 'mp4' ?
                                            <Image resizeMode='contain' source={{ uri: APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.FILE_DOWNLOAD + previewId }} style={{ width: screenWidth / 1.2, height: screenHeight / 2.2 }} />
                                            :

                                            <View style={styles.containerVideo}>
                                                <Video
                                                    ref={videoRef}
                                                    resizeMode="contain"
                                                    source={{
                                                        uri: `${APIS_ENDPOINT.BASE_URL}${APIS_ENDPOINT.FILE_DOWNLOAD}${previewId}`,
                                                    }}
                                                    style={styles.mediaPlayer}
                                                    volume={1.0}
                                                    paused={paused}
                                                    muted={muted}
                                                    onBuffer={handleBuffer}
                                                    onEnd={handleEnd}
                                                />
                                                {isBuffering ? <ActivityIndicator color={COLOR.PRIMARY} style={styles.playPauseButton} size={'large'} /> : <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
                                                    <Image source={paused ? require('../../assets/play.png') : require('../../assets/pause.png')} style={styles.buttonIcon} />
                                                </TouchableOpacity>}
                                            </View>
                                        }

                                    </View>
                                </View>
                            </View>
                        </Modal>
                        {isLoading ? <Customloader /> : null}
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default SurveyScreen;

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
    input2: {
        flex: 1,
        paddingVertical: 8,
        color: COLOR.BLACK,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: 'white'
    },
    styleIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
        tintColor: COLOR.PRIMARY
    },
    addIcon: {
        width: 25,
        height: 25,
        tintColor: COLOR.PRIMARY
    },
    label: {
        marginVertical: 10, fontWeight: '600'
    },
    inputView: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 7,
        backgroundColor: '#E9EAEC',
        padding: 10
    },
    modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent1: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 10,
        width: screenWidth / 2,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: screenWidth / 1.2,
        // height: screenHeight / 1.8,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContent2: {
        width: screenWidth / 1.1,
        height: screenHeight / 1.8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    imgButtonStyl: {
        backgroundColor: 'rgba(227, 66, 52, 0.1)',
        padding: 10,
        width: screenWidth / 1.5,
        textAlign: 'center',
        borderRadius: 10,
        marginBottom: 20,
        color: '#000'
    },
    imageStyle: {
        width: 100,
        height: 100,
        margin: 5,
        resizeMode: 'stretch'
    },
    imageList: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    image: {
        width: 50,
        height: 50,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
        padding: 5,
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerVideo: {
        flexDirection: 'column',
        alignItems: 'center',
        height: screenHeight / 2.2
    },
    mediaPlayer: {
        position: 'absolute',
        backgroundColor: 'black',
        justifyContent: 'center',
        width: screenWidth / 1.1, height: screenHeight / 2.2,
    },
    playPauseButton: {
        // marginTop: 20,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        height: "100%",
    },
    buttonIcon: {
        width: 35,
        height: 35,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: COLOR.WHITE,
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    icon: {
        width: 24,
        height: 24,
        marginLeft: 10,
        tintColor: COLOR.PRIMARY
    },

    resetBtn: {
        flex: 1, height: 40, borderWidth: 2, borderColor: COLOR.WHITE, justifyContent: 'center', borderRadius: 10, marginHorizontal: 10
    },
    submitBtn: {
        flex: 1, height: 40, backgroundColor: COLOR.PRIMARY, justifyContent: 'center', borderRadius: 10, marginHorizontal: 10
    }
});