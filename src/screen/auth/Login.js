import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {useDispatch} from 'react-redux';
import {updateUser, updateFbToken} from '../../redux/authSlice';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  GoogleSignin.configure({
    webClientId:
      '689834161030-kefkn4uor1q8a2jlgtlo1pl5ut4eetu3.apps.googleusercontent.com',
  });

  const signinWithGoogle = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userSignIn = auth().signInWithCredential(googleCredential);
    userSignIn
      .then(userInfo => {
        if (userInfo?.user.email) {
          dispatch(updateUser(userInfo));
          if (userInfo?.additionalUserInfo?.profile?.name) {
            database()
              .ref('/users' + userInfo?.additionalUserInfo?.profile?.name)
              .set({
                name: userInfo?.additionalUserInfo?.profile?.name,
                sender: userInfo?.additionalUserInfo?.profile?.email,
                msg: {
                  sender: '',
                  reciever: ' ',
                },
              })
              .then(() => navigation.navigate('Drawer'));
          }
        }
      })
      .then(error => console.log(error));
  };

  const onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    // Sign-in the user with the credential
    const infos = await auth().signInWithCredential(facebookCredential);
    const info = Object.values(infos);

    dispatch(updateUser(info?.[0]));
    navigation.navigate('Drawer');
  };

  return (
    <View style={styles.main}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          signinWithGoogle();
        }}>
        <Text style={styles.signin}>Sign in with Google {'    '}</Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            onFacebookButtonPress();
          }}>
          <Text style={styles.signin}>Sign in with Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 45,
    borderRadius: 6,
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    width: 300,
  },
  signin: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});
