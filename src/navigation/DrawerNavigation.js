import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import Home from '../screen/home/Home';

const DrawerNavigation = () => {
  const {Navigator, Screen} = createDrawerNavigator();
  return (
    <Navigator screenOptions={{lazy: true}}>
      <Screen name="Home" component={Home} />
    </Navigator>
  );
};

export default DrawerNavigation;
