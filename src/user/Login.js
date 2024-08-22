import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, Image } from 'react-native';
import { VStack, Box, Text, Input, Button, Link, Center, useToast, HStack } from 'native-base';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { AuthContext } from './AuthContext';
import { API_URL } from '@env';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const toast = useToast();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);
    updateOrientation();

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, []);

  const handleLogin = async () => {
    try {
      console.log('Starting login process');
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      console.log('Received response:', response.data);

      const { token } = response.data;
      console.log('JWT token:', token);

      // Decode the token to get user info
      const userInfo = { ...jwtDecode(token), token };
      console.log('Decoded user info:', userInfo);

      await login(userInfo);
      console.log('User info stored in context');

      navigation.navigate('HomeTabs');
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
      console.error('Login failed:', errorMessage);
      toast.show({
        title: 'Login failed',
        status: 'error',
        description: errorMessage,
        placement: 'top',
      });
    }
  };

  const imageSource = require('../../public/userImage/Logo_PT_Rekayasa_Industri.jpg');

  return (
    <Center flex={1} px="3" bg="#fff">
      {isLandscape ? (
        <HStack space={2} width="90%" maxW="800px" alignItems="center">
          <Image
            source={imageSource}
            style={{ width: 150, height: '100%' }}
            resizeMode="contain"
          />
          <VStack space={2} flex={1}>
            <Box>
              <Text fontSize="lg" fontWeight="bold">Email</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                variant="outline"
                mt={2}
                mb={4}
              />
            </Box>
            <Box>
              <Text fontSize="lg" fontWeight="bold">Password</Text>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                variant="outline"
                secureTextEntry
                mt={2}
                mb={4}
              />
            </Box>
            <Button onPress={handleLogin} size="sm" colorScheme="blue" mt={4}>Login</Button>
            <Text mt={4} fontSize="md">
              Tidak punya akun?{' '}
              <Link onPress={() => navigation.navigate('Register')} _text={{ color: "blue.500", textDecoration: "underline" }}>
                Register
              </Link>
            </Text>
          </VStack>
        </HStack>
      ) : (
        <VStack space={4} width="90%" maxW="400px">
          <Image
            source={imageSource}
            style={{ width: '100%', height: 150, marginBottom: 20 }}
            resizeMode="contain"
          />
          <Box>
            <Text fontSize="lg" fontWeight="bold">Email</Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              variant="outline"
              mt={2}
              mb={4}
            />
          </Box>
          <Box>
            <Text fontSize="lg" fontWeight="bold">Password</Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              variant="outline"
              secureTextEntry
              mt={2}
              mb={4}
            />
          </Box>
          <Button onPress={handleLogin} size="sm" colorScheme="blue" mt={4}>Login</Button>
          <Text mt={4} fontSize="md">
            Tidak punya akun?{' '}
            <Link onPress={() => navigation.navigate('Register')} _text={{ color: "blue.500", textDecoration: "underline" }}>
              Register
            </Link>
          </Text>
        </VStack>
      )}
    </Center>
  );
};

export default Login;
