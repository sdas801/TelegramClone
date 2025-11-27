import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, { useState, useRef, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../services/AppContext';

const Otp = ({ navigation, route }) => {
  const { setUserId, setAuth, setUserData} = useContext(AppContext);
  const token = useRef(null)
  const userId = route.params.userId;
  console.log('from otp screen: ', userId);

  const [focus1, setFocus1] = useState(false);
  const [focus2, setFocus2] = useState(false);
  const [focus3, setFocus3] = useState(false);
  const [focus4, setFocus4] = useState(false);
  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [value3, setValue3] = useState(null);
  const [value4, setValue4] = useState(null);

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);

  const handleNextFocus = (text, nextRef) => {
    if (text.length === 1 && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };
  const handlePreviousFocus = (text, nextRef) => {
    if (text.length === 0 && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const ApiRequest = async otp => {
    let flag;

    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        orgnId: 18,
        otp: otp,
        userId: userId,
        tz: 'Asia/Kolkata',
        deviceType: 'Android',
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const res = await fetch(
        'https://dev.myhygge.io/hygmapi/api/v1/login/validateOTP',
        requestOptions,
      )
      const result = await res.text()
      const obj = JSON.parse(result);

      flag = obj.status

      if (obj.status === 200) {
        const userId = obj.response.userId;
        token.current = obj.response.token;
        await AsyncStorage.setItem('userId', JSON.stringify(userId));
        await AsyncStorage.setItem('auth', JSON.stringify(token.current));
        setUserId(userId);
        setAuth(token.current);
      }
    }
    catch (e) {
      ToastAndroid.show(String(e), ToastAndroid.SHORT);
    }
    console.log(flag)
    return flag;
  };

  const ProfileDetails = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token.current}`);
    console.log('ProfileDetails---------->', token.current);

    const raw = JSON.stringify({
      "orgid": 18,
      "userid": userId,
      "tz": "Asia/Kolkata",
      "deviceType": "Android"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    try {
      const result = await fetch("https://dev.myhygge.io/hygmapi/api/v1/employee/getProfileDetails", requestOptions);
      const obj = await result.json();
      if (obj.status === 200) {
        const response = obj.response;
        // const contact_number = response.contact_number;
        // const country_code = response.country_code
        // const dob = response.dob
        // const email_id = response.email_id
        // const first_name = response.first_name
        // const full_name = response.full_name
        // const gender = response.gender
        // const imageurl = response.imageurl
        // const last_name = response.last_name
        // const marital_status = response.marital_status
        // const nationality = response.nationality
        // const passport_number = response.passport_number
        await AsyncStorage.setItem('user_data', JSON.stringify(response));
        setUserData(response)
      }
    } catch (e) {
      console.log('error - ProfileDetails - fetch: ', e);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#e9f8ffff',
      }}
    >
      {isLoading
        ? <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
        : <KeyboardAvoidingView
          style={{
            flex: 1,
            // backgroundColor:'white',
            paddingHorizontal: 20,
          }}
        >
          {/* top container */}
          <View
            style={{
              flex: 1,
              marginTop: '15%',
              // backgroundColor:'blue',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            {/* title */}
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
              }}
            >
              Enter Authentication Code
            </Text>
            {/* subtitle */}
            <Text style={{ fontSize: 20 }}>
              Enter the 4-digit that we have sent to your email ID 'email name'{' '}
            </Text>
            <View
              style={{
                marginTop: 40,
                marginBottom: 10,
                flexDirection: 'row',
                // backgroundColor:'red',
                width: '68%',
                justifyContent: 'space-between',
              }}
            >
              <TextInput
                editable={!disabled}
                style={[
                  styles.otpTextInput,
                  { borderColor: focus1 ? 'blue' : '#cececeff' },
                ]}
                ref={input1}

                value={value1}
                onChangeText={e => {
                  setValue1(e);
                  handleNextFocus(e, input2);
                  handlePreviousFocus(e, null)



                }}
                onFocus={() => setFocus1(true)}
                onBlur={() => setFocus1(false)}
                maxLength={1}
                inputMode="numeric"
                autoFocus={true}
              //   type="text"

              // keyboardType='default'
              />
              <TextInput
                editable={!disabled}

                ref={input2}
                style={[
                  styles.otpTextInput,
                  { borderColor: focus2 ? 'blue' : '#cececeff' },
                ]}
                value={value2}
                onChangeText={e => {
                  setValue2(e);
                  handleNextFocus(e, input3);
                  handlePreviousFocus(e, input1)

                }}
                maxLength={1}
                inputMode="numeric"
                onFocus={() => setFocus2(true)}
                onBlur={() => setFocus2(false)}
              />
              <TextInput
                editable={!disabled}

                style={[
                  styles.otpTextInput,
                  { borderColor: focus3 ? 'blue' : '#cececeff' },
                ]}
                ref={input3}
                value={value3}
                onChangeText={e => {
                  setValue3(e);
                  handleNextFocus(e, input4);
                  handlePreviousFocus(e, input2)

                }}
                onFocus={() => setFocus3(true)}
                onBlur={() => setFocus3(false)}
                maxLength={1}
                inputMode="numeric"
              />
              <TextInput
                editable={!disabled}

                style={[
                  styles.otpTextInput,
                  { borderColor: focus4 ? 'blue' : '#cececeff' },
                ]}

                ref={input4}
                value={value4}
                onChangeText={e => {
                  setValue4(e);
                  handleNextFocus(e, null);
                  handlePreviousFocus(e, input3)
                }}
                onFocus={() => setFocus4(true)}
                onBlur={() => setFocus4(false)}
                maxLength={1}
                inputMode="numeric"
              />
            </View>

            <Text style={{
              color: 'red'
            }}>{error}</Text>
          </View>

          {/* bottom container */}
          <View
            style={{
              flex: 1,
              // backgroundColor:'red',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >

            {/* next botton */}
            <TouchableOpacity
              disabled={disabled}
              onPress={async () => {
                setError(null)

                setIsLoadingButton(true)

                setDisabled(true);

                const value = value1 + value2 + value3 + value4;
                console.log(value);

                const apiCheck = await ApiRequest(value);


                if (apiCheck === 200 && value.length === 4) {
                  setError(null)

                  setIsLoading(true);
                  await ProfileDetails();
                  navigation.replace('TabNavigation');

                } else if (value.length !== 4) {
                  setDisabled(false);
                  setIsLoadingButton(false);
                  setError('please enter all 4 digits of the otp')

                }
                else if (apiCheck === 404 || apiCheck === 500 || apiCheck === 1004) {
                  setDisabled(false);
                  setIsLoadingButton(false)
                  setError('Invalid Otp')
                } else if (apiCheck === undefined) {
                  setDisabled(false);
                  setIsLoadingButton(false)
                  setError('network issue')
                }
                else if (apiCheck === 1001) {
                  setDisabled(false);
                  setIsLoadingButton(false)
                  setError('Empty field')
                }
                else {
                  setDisabled(false);
                  setIsLoadingButton(false);
                  setError('uncaught error')

                }
              }}
              style={{
                width: '100%',
                height: 'auto',
                backgroundColor: 'blue',
                paddingVertical: 17,
                borderRadius: 30,
                marginVertical: 18,
              }}
            >
              {isLoadingButton
                ? <ActivityIndicator size="22" color="#e9e9ffff" />
                : <Text style={{ textAlign: 'center', color: 'white', fontSize: 18 }}>Continue</Text>
              }
            </TouchableOpacity>
            <Text>Resend Code in 'time'</Text>
          </View>
        </KeyboardAvoidingView>
      }
    </SafeAreaView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  otpTextInput: {
    borderWidth: 2,
    borderColor: 'blue',
    // backgroundColor:'red'
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 25,
    borderRadius: 60,
    height: 55,
    width: 55,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
