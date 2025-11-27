import { Platform } from 'react-native';
import { 
  check, 
  request, 
  RESULTS, 
  PERMISSIONS 
} from 'react-native-permissions';

export const requestCameraPermissions = async () => {
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
        // console.log("Camera permission granted. Proceeding to launch camera/picker.");
        // Now you can call your ImagePicker.launchCamera()
        return true;
      } else {
        // console.log("Permission denied or blocked.");
        return false;
      }
    } catch (error) {
      // console.error("Error requesting permission:", error);
      return false;
    }
  };

export const requestGalleryPermission = async () => {
    // 1. Define the correct permission based on platform and Android version
    const galleryPermission = Platform.select({
      // iOS uses PHOTO_LIBRARY
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,

      // Android uses different permissions based on API level (33 is Android 13)
      android: Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES // Android 13+
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, // Android < 13
    });

    try {
      // 2. Check the current status
      let result = await check(galleryPermission);

      if (result === RESULTS.DENIED) {
        // 3. Request the permission if it hasn't been granted
        result = await request(galleryPermission);
      }

      if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        // RESULTS.LIMITED is often returned on iOS when partial access is given
        // console.log("Photo Library access granted.");
        // Now you can call CameraRoll.getPhotos() or ImagePicker.launchImageLibrary()
        return true;
      } else {
        // console.log("Photo Library permission denied or blocked. Result:", result);
        return false;
      }
    } catch (error) {
      // console.error("Error requesting permission:", error);
      return false;
    }
  };

export async function requestStoragePermission() {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      if (Platform.Version >= 33) {
        // Android 13+ - Request media permissions
        const permissions = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        ]);
        return Object.values(permissions).some(
          status => status === PermissionsAndroid.RESULTS.GRANTED
        );
      } else if (Platform.Version >= 29) {
        // Android 10-12 - Read permission only
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to download files",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 9 and below - Write permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to download files",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }