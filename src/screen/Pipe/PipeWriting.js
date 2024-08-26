import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import axios from 'axios';
import { useToast, Box, Center } from 'native-base';
import { AuthContext } from '../../user/AuthContext';
import { UrlContext } from '../../user/UrlContext'; // Import the context

const PipeWriting = ({ navigation }) => {
  const [uid, setUid] = useState('');
  const [scanning, setScanning] = useState(false);
  const [buttonText, setButtonText] = useState('Start Scanning');
  const { serverUrl } = useContext(UrlContext); // Get server URL from context
  const { user } = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    // Ensure that NFC Manager is initialized
    NfcManager.start();
    return () => {
      NfcManager.stop();
      NfcManager.setEventListener('stateChange', 'onStateChange', () => {});
    };
  }, []);

  const startNfc = async () => {
    setScanning(true);
    setButtonText('Scanning...');
    try {
      await NfcManager.requestTechnology(NfcTech.NfcA);
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
        title: "Error",
        status: "error",
        description: "Failed to read NFC tag. Please try again.",
        placement: "top"
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
        toast.show({
          title: "Error",
          status: "error",
          description: "Pipe is already registered",
          placement: "top"
        });
        setButtonText('Scan Again');
      } else {
        setButtonText('Next');
      }
    } catch (error) {
      console.error('Error checking pipe registration', error);
      toast.show({
        title: "Error",
        status: "error",
        description: "Failed to check pipe registration",
        placement: "top"
      });
      setButtonText('Start Scanning');
    }
  };

  const handleButtonPress = () => {
    if (buttonText === 'Start Scanning' || buttonText === 'Scan Again') {
      startNfc();
    } else if (buttonText === 'Next') {
      navigation.navigate('PipeUpload', { uid });
    }
  };

  return (
    <Center flex={1} px="3">
      <Box alignItems="center">
        <Text style={styles.label}>Scan Tag</Text>
        <Text style={styles.uidText}>{uid || 'Fetching UID...'}</Text>
        <Button
          title={buttonText}
          onPress={handleButtonPress}
          disabled={scanning}
          color="#1E90FF"
        />
      </Box>
    </Center>
  );
};

const styles = StyleSheet.create({
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

export default PipeWriting;
