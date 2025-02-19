// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
//   Dimensions,
//   ImageBackground,
//   TouchableOpacity,
//   PermissionsAndroid,
//   ToastAndroid,
//   TextInput,
//   Modal,
//   Platform,
//   Alert,
//   TouchableHighlight,
//   ActivityIndicator,
// } from 'react-native';
// import DropDownPicker from 'react-native-dropdown-picker';
// import Geolocation from 'react-native-geolocation-service';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import callApi from './ApiRequest';

// import {
//   Colors
// } from 'react-native/Libraries/NewAppScreen';
// import { APIS_ENDPOINT } from './Constants';
// import RadioButtonGroup from './components/RadioButtonGroup';
// import RNFS from 'react-native-fs'
// import Customloader from './components/Customloader';
// import Video from 'react-native-video';
// import CustomDropDownPicker from './components/CustomDropDownPicker';
// import { COLOR } from './common/typography';

// const screenHeight = Dimensions.get('window').height;
// const screenWidth = Dimensions.get('window').width;

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//     flex: 1
//   };
//   const labelStyle = {
//     color: isDarkMode ? 'white' : 'black', marginVertical: 10, fontWeight: '600'
//   };
//   const labelStyle2 = {
//     color: 'black', marginVertical: 10, fontWeight: '600'
//   };
//   const tilteStyle = {
//     color: COLOR.PRIMARY, marginVertical: 20, textAlign: 'center', fontSize: 20, fontWeight: '900', fontFamily: 'Arial', fontStyle: 'italic'
//   };

//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [openType, setOpenType] = useState(false);
//   const [valueType, setValueType] = useState(null);
//   const [itemsType, setItemsType] = useState([]);
//   const [selectedTypeName, setSelectedTypeName] = useState(null);

//   const [openCode, setOpenCode] = useState(false);
//   const [valueCode, setValueCode] = useState(null);
//   const [itemsCode, setItemsCode] = useState([]);
//   const [siteDetail, setSiteDetail] = useState(null);

//   const [buildingHeight, setBuildingHeight] = useState('');
//   const [towerHeight, setTowerHeight] = useState('');
//   const [remark, setRemark] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [previewModalVisible, setPreviewModalVisible] = useState(false);
//   const [previewId, setPreviewId] = useState('');
//   const [previewType, setPreviewType] = useState('');

//   const [zebraWidth, setZebraWidth] = useState('');
//   const [zebraStopDistance, setZebraStopDistance] = useState('');
//   const [signalHeight, setSignalHeight] = useState('');
//   const [isCameraBehindOk, setIsCameraBehindOK] = useState(false);
//   const [openPosition, setOpenPosition] = useState(false);
//   const [valuePosition, setValuePosition] = useState(null);
//   const [itemsPosition, setItemsPosition] = useState([]);
//   const [selectedPositionName, setSelectedPositionName] = useState(null);
//   const [selectedPositionId, setSelectedPositionId] = useState(null);

//   // const [filePath, setFilePath] = useState(null);
//   const [getAttach, setAttach] = useState([]);
//   const [getAttachement, setAttachement] = useState([]);

//   const [isFlyOver, setIsFlyOver] = useState(false);
//   const [isLoading, setLoading] = useState(false);
//   const [validateMsg, setValidateMsg] = useState('');

//   const [paused, setPaused] = useState(true);
//   const [muted, setMuted] = useState(false);
//   const videoRef = useRef(null);
//   const [isBuffering, setBuffering] = useState(false);

//   const togglePlayPause = () => {
//     setPaused(!paused);
//   };

//   const handleBuffer = (buffer) => {
//     setBuffering(buffer.isBuffering);
//   };

//   const handleEnd = () => {
//     // Video playback has ended, you can perform any action here
//     // For example, reset the video to the beginning
//     videoRef.current.seek(0);
//     setPaused(true);
//   };

//   const requestLocationPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Geolocation Permission',
//           message: 'Can we access your location?',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       // console.log('granted', granted);
//       if (granted === 'granted') {
//         // console.log('You can use Geolocation');
//         return true;
//       } else {
//         // console.log('You cannot use Geolocation');
//         return false;
//       }
//     } catch (err) {
//       return false;
//     }
//   };

//   useEffect(() => {
//     // getCurrentLocation();
//     getSiteType();
//     getSignalPosition();
//   }, []);

//   useEffect(() => {
//     if (siteDetail != null) {
//       // console.log("siteDetaillll", siteDetail);
//       setBuildingHeight(siteDetail?.buildingHeight?.toString());
//       setTowerHeight(siteDetail?.towerHeight?.toString());
//       setRemark(siteDetail?.remarks);
//       setIsFlyOver(siteDetail?.flyOverAbove);
//       { siteDetail?.attachments !== null ? setAttachement(siteDetail?.attachments) : setAttachement([]) }
//     }
//   }, [siteDetail])

//   //**Select dropdown values*//
//   const handleTypeChange = (item) => {
//     setSiteDetail(null);
//     setSelectedTypeName(item.label)
//     getSiteCode(item.label);
//   };

//   const handleFlyoverChange = (value) => {
//     setIsFlyOver(value);
//   };

//   const handlePositionChange = (item) => {
//     setSelectedPositionName(item.label)
//     setSelectedPositionId(item.value);
//   };

//   const handleCameraChange = (value) => {
//     setIsCameraBehindOK(value);
//   };

//   const handleCodeChange = (item) => {
//     getSiteCodeDetail(item.value);
//   };
//   //end//

//   //**Camera-Permission*//
//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'App needs camera permission',
//           },
//         );
//         // If CAMERA Permission is granted
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     } else return true;
//   };

//   //**LOCATION*//
//   const getCurrentLocation = () => {
//     const result = requestLocationPermission();
//     result.then(res => {

//       if (res) {
//         Geolocation.getCurrentPosition(
//           position => {
//             const { latitude, longitude } = position.coords;
//             setLatitude(latitude);
//             setLongitude(longitude);
//           },
//           error => {
//             showLocationAlert();
//           },
//           { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
//         );
//       }
//     });
//   };

//   // clear all input fields//
//   const clearAllInput = () => {
//     setSiteDetail(null);
//     setValueCode("");
//     setAttach([]);
//     setAttachement([]);
//     setRemark("");
//     setBuildingHeight('');
//     setTowerHeight('');
//     setZebraWidth('');
//     setZebraStopDistance('');
//     setSelectedPositionId('');
//     setSelectedPositionName('');
//     setSignalHeight('');
//     setIsCameraBehindOK(false);
//     setIsFlyOver(false);
//   };

//   // get Site Type api//
//   const getSiteType = () => {
//     callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.SITE_TYPE, 'GET')
//       .then(data => {
//         const dropdownItems = data.map(item => ({
//           label: item.name,
//           value: item.id.toString()
//         }));
//         setItemsType(dropdownItems);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   }

//   // get Site Code api//
//   const getSiteCode = (siteLabel) => {
//     callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.SITE_CODE + siteLabel, 'GET')
//       .then(data => {
//         const dropdownItems = data.map(item => ({
//           label: item.name,
//           value: item.id.toString()
//         }));
//         setItemsCode(dropdownItems);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   }

//   // get Signal Position api//
//   const getSignalPosition = () => {
//     callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.SIGNAL_POSITION , 'GET')
//       .then(data => {
//         const dropdownPosition = data?.payLoad?.map(item => ({
//           label: item.name,
//           value: item.id.toString()
//         }));
//         setItemsPosition(dropdownPosition);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   }

//   // get Site Code api//
//   const getSiteCodeDetail = (siteCode) => {
//     callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.SITE_CODE_DETAIL + siteCode, 'GET')
//       .then(data => {
//         setSiteDetail(data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   }

//   const createPayload = (siteDetail, latitude, longitude, isFlyOver, buildingHeight, towerHeight, remark, getAttachment, zebraWidth, zebraStopDistance, selectedTypeName, selectedPositionId, selectedPositionName, signalHeight, isCameraBehindOk) => {
//     const payload = {
//       id: siteDetail?.id,
//       latitude: siteDetail?.latitude || latitude,
//       longitude: siteDetail?.longitude || longitude,
//       flyOverAbove: isFlyOver,
//       buildingHeight: buildingHeight,
//       towerHeight: towerHeight,
//       remarks: remark,
//       attachments: getAttachment,
//       zebraLineWidth: zebraWidth,
//       zebraStopLineDistance: zebraStopDistance,
//     };
  
//     if (selectedTypeName === "Junction") {
//       payload.primarySignalPosition = {
//         id: selectedPositionId,
//         name: selectedPositionName,
//       };
//       payload.primarySignalHeight = signalHeight;
//       payload.positionChanged = isCameraBehindOk;
//     }
  
//     return payload;
//   };

//   // submit api call//
//   const submitSurvey = () => {
//     // console.log("getAttachement", getAttachement);
//     let isValid = false;

//     if (siteDetail.latitude !== null && siteDetail.latitude !== "" || latitude !== null && latitude !== "") {
//       if (selectedTypeName === "Network Location") {
//         if (buildingHeight !== undefined && towerHeight !== undefined) {
//           isValid = true;
//         } else {
//           isValid = false;
//         }
//       } else {
//         isValid = true;
//       }
//     } else {
//       isValid = false;
//     }

//     // console.log("attach", getAttachement);

//     // console.log("extraData", zebraWidth +"---"+ zebraStopDistance + "----"+ signalHeight +"---"+ isCameraBehindOk +"----"+selectedPositionName+"---"+signalHeight+"---"+isCameraBehindOk);

//     if (isValid) {
//       setLoading(true);
//       // const payload = {
//       //   payLoad: {
//       //     id: siteDetail?.id,
//       //     latitude: latitude,
//       //     longitude: longitude,
//       //     flyOverAbove: isFlyOver,
//       //     buildingHeight: buildingHeight,
//       //     towerHeight: towerHeight,
//       //     remarks: remark,
//       //     attachments: getAttachement,
//       //     zebraLineWidth: zebraWidth,
//       //     zebraStopLineDistance: zebraStopDistance,
//       //     primarySignalPosition: {
//       //       "id":selectedPositionId,
//       //       "name":selectedPositionName
//       //   },
//       //     primarySignalHeight: signalHeight,
//       //     positionChanged: isCameraBehindOk,
//       //   }
//       // };

//       const payload = createPayload(
//         siteDetail,
//         latitude,
//         longitude,
//         isFlyOver,
//         buildingHeight,
//         towerHeight,
//         remark,
//         getAttachement,
//         zebraWidth,
//         zebraStopDistance,
//         selectedTypeName,
//         selectedPositionId,
//         selectedPositionName,
//         signalHeight,
//         isCameraBehindOk
//       );

//       // console.log("SumbitPayyyy", payload);
//       callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.SURVEY_SUBMIT, 'PATCH', payload)
//         .then(data => {
//           setLoading(false);
//           ToastAndroid.showWithGravity(
//             'Site detail updated successfully',
//             ToastAndroid.LONG,
//             ToastAndroid.TOP,
//           );
//           clearAllInput();
//         })
//         .catch(error => {
//           setLoading(false);
//           console.error('Error:Submit', error);
//         });
//     } else {
//       Alert.alert("Submit Survey ", 'Mandatory* fields should not be empty!');
//     }
//   }

//   //**Camera-Capture-File*//
//   const captureImage = async (type) => {
//     let options = {
//       mediaType: type,
//       maxWidth: 300,
//       maxHeight: 550,
//       quality: 1,
//       videoQuality: 'low',
//       durationLimit: 30,
//       saveToPhotos: true,
//     };
//     let isCameraPermitted = await requestCameraPermission();
//     // let isStoragePermitted = await requestExternalWritePermission();
//     if (isCameraPermitted || isStoragePermitted) {
//       launchCamera(options, (response) => {
//         // console.log('Response = ', response);
//         if (response.didCancel) {
//           // Alert.alert('User cancelled camera picker');
//           return;
//         } else if (response.errorCode == 'camera_unavailable') {
//           Alert.alert('Camera not available on device');
//           return;
//         } else if (response.errorCode == 'permission') {
//           Alert.alert('Permission not satisfied');
//           return;
//         } else if (response.errorCode == 'others') {
//           Alert.alert(response.errorMessage);
//           return;
//         }
//         // setFilePath(response);
//         addFileToArray(response);
//       });
//     }
//   };
//   //**Gallery-Pick-File*//
//   const chooseFile = (type) => {
//     let options = {
//       mediaType: type,
//       maxWidth: 300,
//       maxHeight: 550,
//       quality: 1,
//     };
//     launchImageLibrary(options, (response) => {
//       // console.log('Response = ', response);
//       if (response.didCancel) {
//         // Alert.alert('User cancelled camera picker');
//         return;
//       } else if (response.errorCode == 'camera_unavailable') {
//         Alert.alert('Camera not available on device');
//         return;
//       } else if (response.errorCode == 'permission') {
//         Alert.alert('Permission not satisfied');
//         return;
//       } else if (response.errorCode == 'others') {
//         Alert.alert(response.errorMessage);
//         return;
//       }
//       // setFilePath(response);

//       addFileToArray(response);
//     });
//   };

//   //**Add_File_To_Array*//
//   const addFileToArray = (response) => {
//     const newImageUri = response.assets[0]?.uri;
//     setAttach([...getAttach, newImageUri]);
//     uploadFile(response);
//   }

//   //**Upload-Image*//
//   const uploadFile = async (response) => {
//     setLoading(true);
//     // console.log("imageUri", response);
//     const formData = new FormData();
//     formData.append('resourceFile', {
//       uri: response?.assets[0]?.uri,
//       name: response?.assets[0]?.fileName,
//       type: response?.assets[0]?.type, // or the actual MIME type of the file
//     });

//     try {
//       // console.log(formData,'formData')
//       const response = await fetch(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.FILE_UPLOAD_MULTI, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const data = await response.json();
//       // console.log("success", data);
//       getUploadedFile(data?.payLoad?.id);
//     } catch (error) {
//       setLoading(false);
//       console.error('Error uploading image:', error);
//     }
//   };

//   // get Site Code api//
//   const getUploadedFile = (fileId) => {
//     callApi(APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.FILE_UPLOAD_GET + fileId, 'GET')
//       .then(data => {
//         // console.log("dataaaaaGet", data);
//         const newImagePay = data?.payLoad;
//         setAttachement([...getAttachement, newImagePay].flat());
//         setLoading(false);
//         ToastAndroid.showWithGravity(
//           'File updated successfully',
//           ToastAndroid.LONG,
//           ToastAndroid.TOP,
//         );
//       })
//       .catch(error => {
//         setLoading(false);
//         console.error('Error:FileGet', error);
//       });
//   }

//   //**Delete-File-Alert*//
//   const deleteConfirmAlert = (index) => {
//     Alert.alert(
//       "Delete file!",
//       "Are you sure to delete this file?",
//       [
//         { text: "Yes", onPress: () => deleteImage(index) },
//         {
//           text: "No",
//           onPress: () => console.log(""),
//           style: "cancel",
//         },
//       ],
//       {
//         cancelable: true,
//       }
//     );
//   };
//   //**Delete-File*//
//   const deleteImage = (index) => {
//     // setAttach(getAttach.filter(imageUri => imageUri !== uri));
//     // setAttachement(getAttachement?.filter(i => i !== index));
//     setAttachement(prevState => prevState.filter((_, i) => i !== index));
//     ToastAndroid.showWithGravity(
//       'File removed. Submit the survey to update the changes.',
//       ToastAndroid.LONG,
//       ToastAndroid.TOP,
//     );
//   };

//   const viewFile = (id, type) => {
//     setPreviewId(id);
//     setPreviewType(type);
//     setPreviewModalVisible(true);
//   }

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />

//       <ImageBackground
//         source={require('../assets/bg.png')}
//         resizeMode="stretch"
//         style={styles.img}>

//         <ScrollView style={{ flex: 1 }}>
//           <View style={{ flex: 1, margin: 10, paddingBottom: 300 }}>
//             <Text style={tilteStyle}>SITE SURVEY</Text>

//             <Text style={labelStyle}>Site Type</Text>
//             <CustomDropDownPicker
//               open={openType}
//               value={valueType}
//               items={itemsType}
//               setOpen={setOpenType}
//               setValue={setValueType}
//               setItems={setItemsType}
//               placeholder="Select site type"
//               zIndex={1000}
//               onSelectItem={handleTypeChange}
//               arrowIconStyle={{ tintColor: '#C70039' }}
//               min={100}
//               maxHeight={150}
//               search={false}
//             />

//             <Text style={labelStyle}>Site Code</Text>
//             <CustomDropDownPicker
//               open={openCode}
//               value={valueCode}
//               items={itemsCode}
//               setOpen={setOpenCode}
//               setValue={setValueCode}
//               setItems={setItemsCode}
//               placeholder="Select site code"
//               zIndex={100}
//               onSelectItem={handleCodeChange}
//               arrowIconStyle={{ tintColor: '#C70039' }}
//               min={100}
//               maxHeight={170}
//               search={true}
//             />

//             {siteDetail !== null ? <View >
//               <View style={[styles.inputView, { marginTop: 15 }]}>
//                 <Text style={[labelStyle2, { marginTop: -5 }]}>Location Description</Text>
//                 <Text style={{ color: 'black' }}>{siteDetail.locationDescription}</Text>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <View>
//                     <Text style={labelStyle2}>Direction</Text>
//                     <Text style={{ color: 'black', textAlign: 'center' }}>{siteDetail.direction}</Text>
//                   </View>

//                   <View>
//                     <Text style={labelStyle2}>Lanes</Text>
//                     <Text style={{ color: 'black', textAlign: 'center' }}>{siteDetail.lanes}</Text>
//                   </View>

//                   <View>
//                     <Text style={labelStyle2}>Lanes to detect</Text>
//                     <Text style={{ color: 'black', textAlign: 'center' }}>{siteDetail.lanesToDetect}</Text>
//                   </View>
//                 </View>
//               </View>

//               <Text style={labelStyle}>Location<Text style={{ color: 'red' }}> *</Text></Text>
//               <View style={{
//                 borderWidth: 1, borderColor: 'black', borderRadius: 7, backgroundColor: 'white', padding: 10, flexDirection: 'row',
//                 alignItems: 'center', justifyContent: 'space-between'
//               }}>

//                 <Text style={{ color: 'black' }}>{siteDetail.latitude !== null && siteDetail.longitude !== null ? siteDetail.latitude + " " + siteDetail.longitude : latitude + " " + longitude}</Text>
//                 {siteDetail !== null && siteDetail.latitude !== null && siteDetail.longitude !== null ?
//                   null : <TouchableOpacity onPress={() => getCurrentLocation()}>
//                     <Image source={require('../assets/target.png')} style={[styles.styleIcon]} />
//                   </TouchableOpacity>}
//               </View>

//               {selectedTypeName === "Junction" ?
//                 <View>
//                   <Text style={labelStyle}>Fly Over above?</Text>
//                   <RadioButtonGroup
//                     options={[
//                       { label: 'Yes', value: 'true' },
//                       { label: 'Not', value: 'false' },
//                     ]}
//                     defaultValue="false"
//                     onValueChange={handleFlyoverChange}
//                   />

//                   <Text style={labelStyle}>Zebra Line Width</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter width"
//                     value={zebraWidth}
//                     onChangeText={setZebraWidth}
//                     keyboardType='numeric'
//                   />

//                   <Text style={labelStyle}>Zebra Stop Line Distance</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter distance"
//                     value={zebraStopDistance}
//                     onChangeText={setZebraStopDistance}
//                     keyboardType='numeric'
//                   />

//                   <Text style={labelStyle}>Primary Signal Position with respect to stop line</Text>
//                   <CustomDropDownPicker
//                     open={openPosition}
//                     value={valuePosition}
//                     items={itemsPosition}
//                     setOpen={setOpenPosition}
//                     setValue={setValuePosition}
//                     setItems={setItemsPosition}
//                     placeholder="Select signal position"
//                     onSelectItem={handlePositionChange}
//                     zIndex={1000}
//                     arrowIconStyle={{ tintColor: '#C70039' }}
//                     min={100}
//                     maxHeight={150}
//                   />

//                   <Text style={labelStyle}>Primary Signal Height</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter signal height"
//                     value={signalHeight}
//                     onChangeText={setSignalHeight}
//                     keyboardType='numeric'
//                   />

//                   <Text style={labelStyle}>Can we position the Camera behind 30 meters of Signal?</Text>
//                   <RadioButtonGroup
//                     options={[
//                       { label: 'Yes', value: 'true' },
//                       { label: 'No', value: 'false' },
//                     ]}
//                     defaultValue="false"
//                     onValueChange={handleCameraChange}
//                   />

//                 </View> : null}

//               {selectedTypeName === "Network Location" ?
//                 <View>
//                   <Text style={labelStyle}>Building height<Text style={{ color: 'red' }}> *</Text></Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter building height"
//                     value={buildingHeight}
//                     onChangeText={setBuildingHeight}
//                     keyboardType='numeric'
//                   />

//                   <Text style={labelStyle}>Tower height<Text style={{ color: 'red' }}> *</Text></Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter tower height"
//                     value={towerHeight}
//                     onChangeText={setTowerHeight}
//                     keyboardType='numeric'
//                   />
//                 </View> : null}

//               <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>

//                 <Text style={labelStyle}>Attach file (Image & Video) </Text>

//                 <TouchableOpacity style={{
//                   backgroundColor: 'white', width: 25,
//                   height: 25, borderRadius: 5, marginRight: 15
//                 }} onPress={() => setModalVisible()}>
//                   <Image source={require('../assets/file_add.png')} style={styles.addIcon} />
//                 </TouchableOpacity>
//               </View>

//               {getAttachement !== null ?
//                 <ScrollView horizontal={true} contentContainerStyle={styles.imageList}>
//                   {getAttachement.map((item, index) => (
//                     <TouchableOpacity onPress={() => viewFile(item.id, item.fileExtn)}>
//                       <ImageBackground key={item?.id}
//                         source={
//                           item.fileExtn !== "mp4"
//                             ? { uri: APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.FILE_DOWNLOAD + item.id }
//                             : require('../assets/video.png')
//                         }
//                         style={{ height: 70, width: 70, margin: 5 }}>
//                         <TouchableHighlight
//                           style={{ alignItems: 'flex-end' }}
//                           onPress={() => deleteConfirmAlert(index)}
//                         >
//                           <Image source={require('../assets/delete.png')} style={styles.addIcon} />
//                         </TouchableHighlight>
//                       </ImageBackground>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//                 : null}

//               <Text style={labelStyle}>Remark</Text>
//               <TextInput
//                 style={[styles.input, { textAlignVertical: 'top' }]}
//                 placeholder="Enter remark"
//                 value={remark}
//                 onChangeText={setRemark}
//                 multiline={true}
//                 numberOfLines={5}
//               />

//               <TouchableOpacity onPress={() => submitSurvey()} style={{ marginTop: 30, height: 40, backgroundColor: '#C70039', justifyContent: 'center', borderRadius: 10 }}>
//                 <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700 }}>Submit</Text>
//               </TouchableOpacity>

//             </View> : null}

//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={modalVisible}
//               onRequestClose={() => {
//                 setModalVisible(false);
//               }}
//             >
//               <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                   <View style={{ alignItems: 'center', marginVertical: 20 }}>
//                     <Image source={require('../assets/media.png')} style={{ width: 35, height: 35 }} />
//                     <Text style={{ color: 'black', marginVertical: 20, marginHorizontal: 25, fontSize: 18, textAlign: 'center' }}>Choose the picker to attach your files. (Images & Videos)</Text>
//                     <TouchableOpacity onPress={() => [captureImage('photo'), setModalVisible(false)]}>
//                       <Text style={styles.imgButtonStyl}>Image using Camera</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => [captureImage('video'), setModalVisible(false)]}>
//                       <Text style={styles.imgButtonStyl}>Video using Camera</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => [chooseFile('photo'), setModalVisible(false)]}>
//                       <Text style={styles.imgButtonStyl}>Image from Gallery</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => [chooseFile('video'), setModalVisible(false)]}>
//                       <Text style={styles.imgButtonStyl}>Video from Gallery</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => setModalVisible(false)}>
//                       <Text style={[styles.imgButtonStyl, { backgroundColor: '#E9EAEC' }]}>Cancel</Text>
//                     </TouchableOpacity>
//                   </View>

//                 </View>
//               </View>
//             </Modal>

//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={previewModalVisible}
//               onRequestClose={() => {
//                 setPreviewModalVisible(false);
//               }}
//             >
//               <View style={styles.modalContainer2}>
//                 <View style={styles.modalContent2}>
//                   <View style={{ alignItems: 'center' }}>
//                     <TouchableOpacity onPress={() => setPreviewModalVisible(false)} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
//                       <Image source={require('../assets/close.png')} style={{ width: 35, height: 35 }} />
//                     </TouchableOpacity>
//                     {previewType !== 'mp4' ?
//                       <Image resizeMode='contain' source={{ uri: APIS_ENDPOINT.BASE_URL + APIS_ENDPOINT.FILE_DOWNLOAD + previewId }} style={{ width: screenWidth / 1.2, height: screenHeight / 2.2 }} />
//                       :

//                       <View style={styles.containerVideo}>
//                         <Video
//                           ref={videoRef}
//                           resizeMode="contain"
//                           source={{
//                             uri: `${APIS_ENDPOINT.BASE_URL}${APIS_ENDPOINT.FILE_DOWNLOAD}${previewId}`,
//                           }}
//                           style={styles.mediaPlayer}
//                           volume={1.0}
//                           paused={paused}
//                           muted={muted}
//                           onBuffer={handleBuffer}
//                           onEnd={handleEnd}
//                         />
//                         {isBuffering ? <ActivityIndicator color={'#C70039'} style={styles.playPauseButton} size={'large'} /> : <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
//                           <Image source={paused ? require('../assets/play.png') : require('../assets/pause.png')} style={styles.buttonIcon} />
//                         </TouchableOpacity>}
//                       </View>
//                     }

//                   </View>
//                 </View>
//               </View>
//             </Modal>
//             {isLoading ? <Customloader /> : null}
//           </View>
//         </ScrollView>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     width: '100%'
//   },
//   img: {
//     height: screenHeight,
//     width: screenWidth,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: 'black',
//     borderRadius: 7,
//     backgroundColor: 'white',
//     padding: 10,
//     color: 'black'
//   },
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 10,
//     borderWidth: 1,
//     backgroundColor: 'white'
//   },
//   styleIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 8,
//     tintColor: "#C70039"
//   },
//   addIcon: {
//     width: 25,
//     height: 25,
//   },
//   label: {
//     marginVertical: 10, fontWeight: '600'
//   },
//   inputView: {
//     borderWidth: 1,
//     borderColor: 'black',
//     borderRadius: 7,
//     backgroundColor: '#E9EAEC',
//     padding: 10
//   },
//   modalContainer1: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent1: {
//     backgroundColor: 'white',
//     padding: 5,
//     borderRadius: 10,
//     width: screenWidth / 2,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.1)',
//   },
//   modalContainer2: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   modalContent: {
//     width: screenWidth / 1.2,
//     // height: screenHeight / 1.8,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalContent2: {
//     width: screenWidth / 1.1,
//     height: screenHeight / 1.8,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   imgButtonStyl: {
//     backgroundColor: 'rgba(199, 0, 57, 0.1)',
//     padding: 10,
//     width: screenWidth / 1.5,
//     textAlign: 'center',
//     borderRadius: 10,
//     marginBottom: 20,
//     color: '#000'
//   },
//   imageStyle: {
//     width: 100,
//     height: 100,
//     margin: 5,
//     resizeMode: 'stretch'
//   },
//   imageList: {
//     flexDirection: 'row',
//   },
//   imageContainer: {
//     position: 'relative',
//     marginBottom: 20,
//   },
//   image: {
//     width: 50,
//     height: 50,
//   },
//   deleteButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 15,
//     padding: 5,
//   },
//   // mediaPlayer: {
//   //   position: 'absolute',
//   //   backgroundColor: 'black',
//   //   justifyContent: 'center',
//   //   width: screenWidth / 1.1, height: screenHeight / 2.2,
//   //   marginTop: 40
//   // },
//   loader: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   containerVideo: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     height: screenHeight / 2.2
//   },
//   mediaPlayer: {
//     position: 'absolute',
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     width: screenWidth / 1.1, height: screenHeight / 2.2,
//   },
//   playPauseButton: {
//     // marginTop: 20,
//     alignItems: 'flex-end',
//     justifyContent: 'flex-end',
//     height: "100%",
//   },
//   buttonIcon: {
//     width: 35,
//     height: 35,
//   },
// });

// export default App;
