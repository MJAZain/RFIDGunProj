import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import axios from 'axios';
import { Box, Button, useToast } from 'native-base';
import { AuthContext } from '../../user/AuthContext';
import { UrlContext } from '../../user/UrlContext'; // Import UrlContext

const FitupWrite = ({ navigation }) => {
  const [uid, setUid] = useState('');
  const [scanning, setScanning] = useState(false);
  const [buttonText, setButtonText] = useState('Start Scanning');
  const { user } = useContext(AuthContext);
  const { serverUrl } = useContext(UrlContext); // Use UrlContext for server URL
  const [isLandscape, setIsLandscape] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const handleOrientationChange = ({ window: { width, height } }) => {
      setIsLandscape(width > height);
    };

    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    handleOrientationChange({ window: Dimensions.get('window') });

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup NFC when the component unmounts
      NfcManager.cancelTechnologyRequest().catch((error) => {
        console.warn('Error cancelling NFC technology request on unmount', error);
      });
    };
  }, []);

  const startNfc = async () => {
    setScanning(true);
    setButtonText('Scanning...');
    try {
      await NfcManager.start();
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
        placement: 'top'
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
      navigation.navigate('FitupUpload', { pipe_id: uid, name: user.name });
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

export default FitupWrite;
