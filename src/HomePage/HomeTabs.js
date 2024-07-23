import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './Home';
import ProfileScreen from './Profile';
import SearchPipeScreen from './searchPipe';

const Tab = createMaterialTopTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'black',
        style: { backgroundColor: 'white' },
        indicatorStyle: { backgroundColor: 'blue' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="SearchPipe"
        component={SearchPipeScreen}
        options={{ tabBarLabel: 'Search Pipe' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
