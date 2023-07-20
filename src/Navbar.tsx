import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Scanner from './screen/Scanner';
import Chatroom from './screen/Chatroom';

const Stack = createNativeStackNavigator();

export default function Navbar() {
  const stackScreenOptions = {
    headerShown: false,
    contentStyle: {backgroundColor: 'transparent'},
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={stackScreenOptions}
        initialRouteName={'chatroom'}>
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="chatroom" component={Chatroom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}