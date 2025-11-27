// import 'react-native-gesture-handler';
import ChatNavigation from './src/navigation/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { AppProvider } from './src/services/AppContext'

const App = () => {

  // const storage = async () => {
  //   try {
  //     console.log('all keys', AsyncStorage.getAllKeys())
  //     console.log('userId data', AsyncStorage.getItem('userId'))

  //     // AsyncStorage.clear()
  //   } catch (error) {
  //     console.log('Error reading AsyncStorage:', error);
  //   }
  // }

  return (
    <AppProvider>
      {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
        <NavigationContainer>
          <ChatNavigation />
        </NavigationContainer>
      {/* </GestureHandlerRootView> */}
    </AppProvider>
  )
}


export default App

