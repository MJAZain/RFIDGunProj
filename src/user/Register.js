import React, { useState, useEffect } from 'react';
import { Image, ScrollView } from 'react-native';
import { VStack, Box, Text, Input, Button, Link, Center, useToast } from 'native-base';
import axios from 'axios';
import { useUrl } from './UrlContext'; // Import useUrl hook

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const { serverUrl } = useUrl(); // Use URL context

  const handleRegister = async () => {
    if (!name || !email || !company || !position || !password) {
      toast.show({
        title: 'Registration failed',
        status: 'error',
        description: 'All fields are required.',
        placement: 'top',
      });
      return;
    }

    try {
      if (!serverUrl) {
        throw new Error('Server URL not set');
      }

      const response = await axios.post(`${serverUrl}/auth/register`, {
        name,
        email,
        company,
        position,
        password,
      });
      console.log('Registration successful');
      navigation.navigate('Login');
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
      console.error('Registration failed:', errorMessage);
      toast.show({
        title: 'Registration failed',
        status: 'error',
        description: errorMessage,
        placement: 'top',
      });
    }
  };

  const imageSource = require('../../public/userImage/Logo_PT_Rekayasa_Industri.jpg');

  return (
    <Center flex={1} bg="#fff">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
        <VStack space={4} width="100%" maxW="600px">
          <Image
            source={imageSource}
            style={{ width: '100%', height: 100, marginBottom: 8 }}
            resizeMode="contain"
          />
          <Box width="100%">
            <Text fontSize="lg" fontWeight="bold">Name</Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              variant="outline"
              mt={2}
              mb={2}
              width="100%"
              isRequired
            />
          </Box>
          <Box width="100%">
            <Text fontSize="lg" fontWeight="bold">Email</Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              variant="outline"
              mt={2}
              mb={2}
              width="100%"
              isRequired
            />
          </Box>
          <Box width="100%">
            <Text fontSize="lg" fontWeight="bold">Company</Text>
            <Input
              value={company}
              onChangeText={setCompany}
              placeholder="Enter your company"
              variant="outline"
              mt={2}
              mb={2}
              width="100%"
              isRequired
            />
          </Box>
          <Box width="100%">
            <Text fontSize="lg" fontWeight="bold">Position</Text>
            <Input
              value={position}
              onChangeText={setPosition}
              placeholder="Enter your position"
              variant="outline"
              mt={2}
              mb={2}
              width="100%"
              isRequired
            />
          </Box>
          <Box width="100%">
            <Text fontSize="lg" fontWeight="bold">Password</Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              variant="outline"
              secureTextEntry
              mt={2}
              mb={2}
              width="100%"
              isRequired
            />
          </Box>
          <Button onPress={handleRegister} size="sm" colorScheme="blue" mt={1} width="100%">Register</Button>
          <Text mt={1} fontSize="md">
            Sudah punya akun?{' '}
            <Link onPress={() => navigation.navigate('Login')} _text={{ color: "blue.500", textDecoration: "underline" }}>
              Login
            </Link>
          </Text>
        </VStack>
      </ScrollView>
    </Center>
  );
};

export default Register;
