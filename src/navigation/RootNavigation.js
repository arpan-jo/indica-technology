import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useSelector} from 'react-redux';
import Login from '../screen/auth/Login';
import DrawerNavigation from './DrawerNavigation';

const RootNavigation = () => {
  const {Navigator, Screen} = createNativeStackNavigator();

  const {
    auth: {name},
  } = useSelector(state => state);
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen
        name="Login"
        component={
          name?.additionalUserInfo?.profile?.email ? DrawerNavigation : Login
        }
      />
      <Screen name="Drawer" component={DrawerNavigation} />
      {/* <Screen name="User" component={User} /> */}
    </Navigator>
  );
};

export default RootNavigation;
