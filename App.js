/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import React, { useEffect, useState } from 'react';
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
  TextInput,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { COLOR } from './src/common/typography';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };
  const labelStyle = {
    color: isDarkMode ? Colors.lighter : Colors.darker, marginVertical: 10, fontWeight:'600'
  };
  const tilteStyle = {
    color: COLOR.PRIMARY, marginVertical: 20, textAlign: 'center', fontSize: 20, fontWeight: '900', fontFamily: 'Arial', fontStyle: 'italic'
  };

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [openType, setOpenType] = useState(false);
  const [valueType, setValueType] = useState(null);
  const [itemsType, setItemsType] = useState([
    { label: 'Junction', value: '1' },
    { label: 'Highway', value: '2' },
    { label: 'Network Available', value: '3' },
  ]);

  const [openCode, setOpenCode] = useState(false);
  const [valueCode, setValueCode] = useState(null);
  const [itemsCode, setItemsCode] = useState([
    { label: 'Option A', value: 'optionA' },
    { label: 'Option B', value: 'optionB' },
    { label: 'Option C', value: 'optionC' },
  ]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      // console.log('granted', granted);
      if (granted === 'granted') {
        // console.log('You can use Geolocation');
        return true;
      } else {
        // console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  //**LOCATION*//
  const getCurrentLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {

      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            // console.log(position);
            const { latitude, longitude } = position.coords;
            // setLocation(position);
            const region = {
              latitude,
              longitude,
              latitudeDelta: 0.15,
              longitudeDelta: 0.15,
            };
            setLatitude(latitude);
            setLongitude(longitude);
            // mapRef.current.animateToRegion(region, 1000);

          },
          error => {
            // See error code charts below.
            // console.log(error.code, error.message);
            // setLocation(false);
            showLocationAlert();
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    });
    // console.log(location);


  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {/* <ImageBackground
        source={require('./assets/bahrain_outline_map.jpg')}
        resizeMode="stretch"
        style={styles.img}> */}

{/* <View style={{ flex: 1, backgroundColor:'rgba(52, 52, 52, 0.8)' }}> */}
<View style={{ flex: 1 }}>
<View style={{ flex: 1, margin: 10 }}>

<Text style={tilteStyle}>SITE SURVEY</Text>

<Text style={labelStyle}>Site Type</Text>
<DropDownPicker
  open={openType}
  value={valueType}
  items={itemsType}
  setOpen={setOpenType}
  setValue={setValueType}
  setItems={setItemsType}
  placeholder={'Select site type'}
  zIndex={1000}
/>

<Text style={labelStyle}>Site Code</Text>
<DropDownPicker
  open={openCode}
  value={valueCode}
  items={itemsCode}
  setOpen={setOpenCode}
  setValue={setValueCode}
  setItems={setItemsCode}
  placeholder={'Select site code'}
  zIndex={100}
/>

{valueCode !== null ? <View >
  <Text style={labelStyle}>Location Description</Text>
  <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 7, backgroundColor: 'white', padding: 10 }}>
    <Text style={{ color: 'black' }}>123 Xinam Road, South Way, 2nd Lane, Near Jamaram Manson</Text>
  </View>

  <Text style={labelStyle}>Direction</Text>
  <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 7, backgroundColor: 'white', padding: 10 }}>
    <Text style={{ color: 'black' }}>SOUTH</Text>
  </View>

  <Text style={labelStyle}>Lane</Text>
  <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 7, backgroundColor: 'white', padding: 10 }}>
    <Text style={{ color: 'black' }}>1 + 2</Text>
  </View>

  <Text style={labelStyle}>Lane to detect</Text>
  <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 7, backgroundColor: 'white', padding: 10 }}>
    <Text style={{ color: 'black' }}>3</Text>
  </View>

  <Text style={labelStyle}>Location</Text>
  <View style={{
    borderWidth: 1, borderColor: 'black', borderRadius: 7, backgroundColor: 'white', padding: 10, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between'
  }}>

    <Text style={{ color: 'black' }}>{latitude}, {longitude}</Text>
    <TouchableOpacity onPress={() => getCurrentLocation()}>
      <Image source={require('./assets/target.png')} style={styles.styleIcon} />
    </TouchableOpacity>
  </View>
</View> : null}

{valueCode !== null ? <TouchableOpacity style={{ marginTop: 30, height: 40, backgroundColor: '#C70039', justifyContent: 'center', borderRadius: 10 }}>
  <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700 }}>Submit</Text>
</TouchableOpacity> : null}



</View>
</View>
       

      {/* </ImageBackground> */}

      {/* <ImageBackground
        source={require('./assets/bahrain_outline_map.jpg')}
        resizeMode="stretch"
        style={styles.img}> */}

      {/* <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Image source={require('./assets/search.png')} style={styles.searchIcon} />

          <TextInput
            style={styles.input}
            placeholder="Search with area code"
            value={searchValue}
            onChangeText={handleInputChange}
          />
        </View>

        {showSearchButton && (
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={{color:'white'}}>search</Text>
          </TouchableOpacity>
        )}
      </View> */}
      {/* </ImageBackground> */}
    </SafeAreaView>

  );
}

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
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    marginHorizontal: 10
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#000',
    borderRadius: 20,
    marginLeft: 8,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  styleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  label: {
    marginVertical: 10, fontWeight:'600'
  },
});

export default App;
