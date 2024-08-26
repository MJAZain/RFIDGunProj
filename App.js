import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider } from 'native-base';
import HomeTabs from './src/HomePage/HomeTabs';
import StringUpload from './src/screen/Stringing/stringUpload';
import StringWrite from './src/screen/Stringing/stringWrite';
import WeldWrite from './src/screen/Welding/weldWrite';
import WeldUpload from './src/screen/Welding/weldUpload';
import FitupWrite from './src/screen/Fitup/fitupWrite';
import FitupUpload from './src/screen/Fitup/fitupUpload';
import Login from './src/user/Login';
import Register from './src/user/Register';
import PipeWriting from './src/screen/Pipe/PipeWriting';
import PipeUpload from './src/screen/Pipe/PipeUpload';
import SetServerUrl from './src/user/UrlInputScreen';
import { AuthProvider } from './src/user/AuthContext';
import { UrlProvider } from './src/user/UrlContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <UrlProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Url">
              <Stack.Screen name="Url" component={SetServerUrl} options={{ headerLeft: null }} />
              <Stack.Screen name="Login" component={Login} options={{ headerLeft: null }} />
              <Stack.Screen name="Register" component={Register} options={{ headerLeft: null }} />
              <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerLeft: null }} />
              <Stack.Screen name="StringUpload" component={StringUpload} options={{ headerLeft: null }} />
              <Stack.Screen name="StringWrite" component={StringWrite} options={{ headerLeft: null }} />
              <Stack.Screen name="WeldWrite" component={WeldWrite} options={{ headerLeft: null }} />
              <Stack.Screen name="WeldUpload" component={WeldUpload} options={{ headerLeft: null }} />
              <Stack.Screen name="PipeWriting" component={PipeWriting} options={{ headerLeft: null }} />
              <Stack.Screen name="PipeUpload" component={PipeUpload} options={{ headerLeft: null }} />
              <Stack.Screen name="FitupWrite" component={FitupWrite} options={{ headerLeft: null }} />
              <Stack.Screen name="FitupUpload" component={FitupUpload} options={{ headerLeft: null }} />
            </Stack.Navigator>
          </NavigationContainer>
        </UrlProvider>
      </AuthProvider>
    </NativeBaseProvider>
  );
};

export default App;
