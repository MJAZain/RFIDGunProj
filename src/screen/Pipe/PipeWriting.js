import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, Alert, BackHandler } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../user/AuthContext';

const PipeWriting = ({ navigation }) => {
  const [uid, setUid] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const initNfc = async () => {
      console.log('Initializing NFC Manager');
      try {
        await NfcManager.start();
        console.log('NFC Manager started');
      } catch (ex) {
        console.warn('Error starting NFC Manager', ex);
      }
    };

    initNfc();

    return () => {
      console.log('Cleaning up NFC event listeners in useEffect');
      NfcManager.setEventListener(NfcTech.NfcA, null);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const readNfc = async () => {
        console.log('Requesting NFC technology');
        try {
          await NfcManager.requestTechnology(NfcTech.NfcA);
          console.log('NFC technology requested');
          const tag = await NfcManager.getTag();
          console.log('NFC tag read', tag);
          if (isActive) {
            setUid(tag.id);
          }
        } catch (ex) {
          console.warn('Error reading NFC tag', ex);
        } finally {
          console.log('Cancelling NFC technology request');
          await NfcManager.cancelTechnologyRequest();
        }
      };

      const onBackPress = () => {
        console.log('Back button pressed, cleaning up and navigating home');
        isActive = false;
        NfcManager.setEventListener(NfcTech.NfcA, null);
        navigation.navigate('Home');
        return true;
      };

      console.log('Reading NFC tag');
      readNfc();

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        console.log('Cleaning up NFC event listeners and back handler in useFocusEffect');
        isActive = false;
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        NfcManager.setEventListener(NfcTech.NfcA, null);
      };
    }, [navigation])
  );

  const checkPipeRegistration = async (uid) => {
    console.log('Checking pipe registration for UID:', uid);
    try {
      const response = await axios.get(`http://192.168.102.101:3000/pipe/${uid}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.data.registered) {
        console.log('Pipe is already registered');
        Alert.alert('Error', 'Pipe is already registered');
        return false;
      } else {
        console.log('Pipe is not registered');
        return true;
      }
    } catch (error) {
      console.error('Error checking pipe registration', error);
      Alert.alert('Error', 'Failed to check pipe registration');
      return false;
    }
  };

  const handleNext = async () => {
    console.log('Handling next button press');
    if (uid) {
      console.log('UID found:', uid);
      const isNotRegistered = await checkPipeRegistration(uid);
      if (isNotRegistered) {
        console.log('Navigating to PipeUpload');
        navigation.navigate('PipeUpload', { uid });
      }
    } else {
      console.log('UID not found, showing alert');
      Alert.alert('Error', 'UID not found. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Scan Tag</Text>
      <Text style={styles.uidText}>{uid || 'Fetching UID...'}</Text>
      <Button title="Next" onPress={handleNext} disabled={!uid} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  uidText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#888',
  },
  button: {
    backgroundColor: '#1E90FF',
    color: '#fff',
  },
});

export default PipeWriting;
