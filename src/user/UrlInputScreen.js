import React, { useState, useEffect } from 'react';
import { Dimensions, Image } from 'react-native';
import { VStack, Box, Text, Input, Button, Center, useToast, HStack } from 'native-base';
import { useUrl } from './UrlContext';

const SetServerUrl = ({ navigation }) => {
  const { serverUrl, saveServerUrl } = useUrl();
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');
  const toast = useToast();
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  useEffect(() => {
    if (serverUrl) {
      const [ip, port] = serverUrl.replace('http://', '').split(':');
      setIpAddress(ip);
      setPort(port || '');
    }
  }, [serverUrl]);

  const handleSaveUrl = () => {
    try {
      if (!ipAddress || !port) {
        throw new Error('Please enter a valid IP address and port');
      }
      
      const url = `http://${ipAddress}:${port}`;
      saveServerUrl(url);
      toast.show({
        title: 'Success',
        status: 'success',
        description: 'Server URL saved successfully.',
        placement: 'top',
      });

      navigation.navigate('Login');
    } catch (e) {
      console.error('Failed to save server URL:', e);
      toast.show({
        title: 'Error',
        status: 'error',
        description: e.message,
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
              <Text fontSize="lg" fontWeight="bold">Server IP Address</Text>
              <Input
                value={ipAddress}
                onChangeText={setIpAddress}
                placeholder="Enter the IP address"
                variant="outline"
                mt={2}
                mb={4}
              />
              <Text fontSize="lg" fontWeight="bold">Port</Text>
              <Input
                value={port}
                onChangeText={setPort}
                placeholder="Enter the port"
                variant="outline"
                mt={2}
                mb={4}
                keyboardType="numeric"
              />
            </Box>
            <Button onPress={handleSaveUrl} size="sm" colorScheme="blue" mt={4}>Save URL</Button>
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
            <Text fontSize="lg" fontWeight="bold">Server IP Address</Text>
            <Input
              value={ipAddress}
              onChangeText={setIpAddress}
              placeholder="Enter the IP address"
              variant="outline"
              mt={2}
              mb={4}
            />
            <Text fontSize="lg" fontWeight="bold">Port</Text>
            <Input
              value={port}
              onChangeText={setPort}
              placeholder="Enter the port"
              variant="outline"
              mt={2}
              mb={4}
              keyboardType="numeric"
            />
          </Box>
          <Button onPress={handleSaveUrl} size="sm" colorScheme="blue" mt={4}>Save URL</Button>
        </VStack>
      )}
    </Center>
  );
};

export default SetServerUrl;
