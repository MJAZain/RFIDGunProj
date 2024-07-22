import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './Home';
import ProfileScreen from './Profile';
import SearchPipeScreen from './searchPipe';

const Tab = createMaterialTopTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Search Pipe" component={SearchPipeScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;
