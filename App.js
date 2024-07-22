import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeTabs from './src/HomePage/HomeTabs';
import StringUpload from './src/screen/Stringing/stringUpload';
import StringWrite from './src/screen/Stringing/stringWrite';
import WeldWrite from './src/screen/Welding/weldWrite';
import WeldUpload from './src/screen/Welding/weldUpload';
import FitupWrite from './src/screen/Fitup/fitupWrite';
import FitupRead from './src/screen/fitupRead';
import FitupUpload from './src/screen/Fitup/fitupUpload';
import Display from './src/utils/Display';
import Login from './src/user/Login';
import Register from './src/user/Register';
import PipeWriting from './src/screen/Pipe/PipeWriting';
import PipeUpload from './src/screen/Pipe/PipeUpload';
import { AuthProvider } from './src/user/AuthContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerLeft: null }} />
          <Stack.Screen name="Register" component={Register} options={{ headerLeft: null }} />
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen name="StringUpload" component={StringUpload} options={{ headerLeft: null }} />
          <Stack.Screen name="StringWrite" component={StringWrite} options={{ headerLeft: null }} />
          <Stack.Screen name="WeldWrite" component={WeldWrite} options={{ headerLeft: null }} />
          <Stack.Screen name="WeldUpload" component={WeldUpload} options={{ headerLeft: null }} />
          <Stack.Screen name="PipeWriting" component={PipeWriting} options={{ headerLeft: null }} />
          <Stack.Screen name="PipeUpload" component={PipeUpload} options={{ headerLeft: null }} />
          <Stack.Screen name="FitupWrite" component={FitupWrite} options={{ headerLeft: null }} />
          <Stack.Screen name="Read" component={FitupRead} options={{ headerLeft: null }} />
          <Stack.Screen name="Upload" component={FitupUpload} options={{ headerLeft: null }} />
          <Stack.Screen name="Display" component={Display} options={{ headerLeft: null }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
