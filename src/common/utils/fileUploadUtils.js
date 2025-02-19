import { Alert, Platform } from "react-native";
import { launchCamera } from "react-native-image-picker";
import { requestCameraPermission } from "./userPermissionUtils";
import { launchImageLibrary } from "react-native-image-picker";

 //**Camera-Capture-File*//
export const captureImage = async (type, addFileToArray) => {
  let options = {
    mediaType: type,
    maxWidth: 300,
    maxHeight: 550,
    quality: 1,
    videoQuality: "low",
    durationLimit: 30,
    saveToPhotos: true,
  };

  let isCameraPermitted = await requestCameraPermission();

  if (isCameraPermitted) {
    launchCamera(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode === "camera_unavailable") {
        Alert.alert("Camera not available on device");
        return;
      } else if (response.errorCode === "permission") {
        Alert.alert("Permission not satisfied");
        return;
      } else if (response.errorCode === "others") {
        Alert.alert(response.errorMessage);
        return;
      }
      addFileToArray(response);
    });
  }
};

//**Gallery-Pick-File*//
export const chooseFile = (type, addFileToArray) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
        return;
      } else if (response.errorCode === "camera_unavailable") {
        Alert.alert("Camera not available on device");
        return;
      } else if (response.errorCode === "permission") {
        Alert.alert("Permission not satisfied");
        return;
      } else if (response.errorCode === "others") {
        Alert.alert(response.errorMessage);
        return;
      }
  
      // Callback function to handle selected file
      addFileToArray(response);
    });
  };
