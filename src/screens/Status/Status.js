import React ,{useState} from 'react';
import { ImageBackground, View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ImageBackgroundBase } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../constants/Colors/Colors'
// camera
import * as ImagePicker from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const Status = () => {
  const [message, setMessage] = useState('');
  const requestPermissions = async () => {
          // Determine the permission string based on the platform
          const cameraPermission = Platform.select({
              ios: PERMISSIONS.IOS.CAMERA,
              android: PERMISSIONS.ANDROID.CAMERA,
          });
  
          try {
              // 1. Check the current status
              let result = await check(cameraPermission);
  
              if (result === RESULTS.DENIED) {
                  // 2. Request the permission if it hasn't been granted
                  result = await request(cameraPermission);
              }
  
              if (result === RESULTS.GRANTED) {
                  console.log("Camera permission granted. Proceeding to launch camera/picker.");
                  // Now you can call your ImagePicker.launchCamera()
                  return true;
              } else {
                  console.log("Permission denied or blocked.");
                  return false;
              }
          } catch (error) {
              console.error("Error requesting permission:", error);
              return false;
          }
      };
  
      const upLoadImage = async () => {
          const hasPermission = await requestPermissions();
          if (hasPermission) {
              // Only launch the camera/library if permission is granted
              ImagePicker.launchCamera({
                  mediaType: 'photo',
                  cameraType: 'back',
                  quality: 1,
                  saveToPhotos: true,
                  maxHeight: 1500,
                  maxWidth: 1500,
              }, (response) => {
                  
                  if (response.didCancel) {
                      console.log('User cancelled camera session');
                  } else if (response.errorCode) {
                      console.error('ImagePicker Error:', response.errorMessage);
                      // Inform the user about the error, perhaps permission denied
                  } else if (response.assets && response.assets.length > 0) {
                      // Success! Get the URI of the captured photo
                      const photoAsset = response.assets[0];
  
                      setMessage(photoAsset.uri)
                      
  
  
                  }
  
  
              });
  
          }
      };
      
  return (
    <View style={styles.container}>

      <View
     
      >
        {/* Status Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusScroll}>
          {/* Add Status */}
          <ImageBackground 
          source={{ uri: message }} 
      
      resizeMode="cover"
          style={styles.statusItem}>
            
            <View style={styles.addStatus}>
              <Text style={styles.addText}>S</Text>
              <View style={styles.plusIcon}>
                <Text style={{ color: '#fff', fontSize: 14 }}>+</Text>
              </View>
            </View>
            <Text style={styles.statusName}>Add status</Text>
          </ImageBackground>

          {/* Example Status */}
          {['Alice Johnson', 'Bob Smith', 'Diana Prince', 'Charlie Brown'].map((name, i) => (
            <View key={i} style={styles.statusItem}>
              <View style={styles.statusCircle}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/60' }}
                  style={styles.statusImage}
                />
              </View>
              <Text style={styles.statusName}>{name}</Text>
            </View>
          ))}
        </ScrollView>

      </View>
      {/* floating button */}
      <TouchableOpacity
      onPress={upLoadImage}
      style={styles.fab}>
        <MaterialIcons name='add-a-photo' size={20} color={'white'}/>
      </TouchableOpacity>










    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8
  },
  statusScroll: {
    flexDirection: 'row',

  },
  statusItem: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#d3d3d3ff',
    borderRadius: 10,
    width: 80,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 'auto'
  },
  statusCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.AppBarBackgroundColor,
    overflow: 'hidden'
  },
  statusImage: {
    width: '100%',
    height: '100%'
  },
  statusName: {
    marginTop: 5,
    fontSize: 12
  },
  addStatus: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  addText: {
    fontSize: 24,
    color: Colors.AppBarBackgroundColor,
    fontWeight: 'bold'
  },
  plusIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.AppBarBackgroundColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.AppBarBackgroundColor, // WhatsApp green
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

});

export default Status;
