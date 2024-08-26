import React, { useEffect, useState, useContext } from 'react';
import { Text, StyleSheet } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import axios from 'axios';
import { Box, Button, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../user/AuthContext';
import { UrlContext } from '../../user/UrlContext'; // Import the context

const StringWrite = () => {
  const [uid, setUid] = useState('');
  const [scanning, setScanning] = useState(false);
  const [buttonText, setButtonText] = useState('Start Scanning');
  const { user } = useContext(AuthContext);
  const { serverUrl } = useContext(UrlContext); // Get server URL from context
  const navigation = useNavigation();
  const toast = useToast();

  useEffect(() => {
    const initNfc = async () => {
      try {
        await NfcManager.start();
      } catch (ex) {
        console.warn('Error starting NFC Manager', ex);
      }
    };

    initNfc();

    return () => {
      // Ensure NFC technology request is cancelled when the component unmounts
      NfcManager.cancelTechnologyRequest().catch((error) => {
        console.warn('Error cancelling NFC technology request on unmount', error);
      });
    };
  }, []);

  const startNfc = async () => {
    setScanning(true);
    setButtonText('Scanning...');
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      setUid(tag.id);
      await NfcManager.cancelTechnologyRequest();
      setScanning(false);
      handlePipeRegistration(tag.id);
    } catch (ex) {
      console.warn('Error reading NFC tag', ex);
      await NfcManager.cancelTechnologyRequest().catch((error) => {
        console.warn('Error cancelling NFC technology request', error);
      });
      setScanning(false);
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Failed to read NFC tag. Please try again.',
        placement: 'top',
      });
      setButtonText('Start Scanning');
    }
  };

  const handlePipeRegistration = async (uid) => {
    try {
      if (!serverUrl) {
        throw new Error('Server URL not set');
      }

      const response = await axios.get(`${serverUrl}/pipe/${uid}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.data.registered) {
        setButtonText('Next');
      } else {
        toast.show({
          title: 'Error',
          status: 'error',
          description: 'Pipe is not registered',
          placement: 'top',
        });
        setUid(''); // Clear the UID state
        setButtonText('Scan Again');
      }
    } catch (error) {
      console.error('Error checking pipe registration', error);
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Failed to check pipe registration',
        placement: 'top',
      });
      setUid(''); // Clear the UID state
      setButtonText('Start Scanning');
    }
  };

  const handleButtonPress = () => {
    if (buttonText === 'Start Scanning' || buttonText === 'Scan Again') {
      startNfc();
    } else if (buttonText === 'Next') {
      navigation.navigate('StringUpload', { pipe_id: uid, name: user.name });
    }
  };

  return (
    <Box style={styles.container}>
      <Text style={styles.label}>Scan Tag</Text>
      <Text style={styles.uidText}>{uid || 'Fetching UID...'}</Text>
      <Button onPress={handleButtonPress} colorScheme="blue" isDisabled={scanning}>
        {buttonText}
      </Button>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    color: '#000',
    marginBottom: 8,
  },
  uidText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#888',
  },
});

export default StringWrite;
