import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, Alert, StyleSheet, BackHandler } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../../user/AuthContext';

const WeldWrite = () => {
  const [nfcTag, setNfcTag] = useState(null);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log('NfcManager starting');
    NfcManager.start()
      .then(() => console.log('NfcManager started'))
      .catch(err => console.error('Error starting NfcManager:', err));

    return () => {
      console.log('NfcManager stopping');
      NfcManager.stop()
        .then(() => console.log('NfcManager stopped'))
        .catch(err => console.error('Error stopping NfcManager:', err));
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('Back button pressed');
        navigation.navigate('Home');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      console.log('BackHandler event added');

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        console.log('BackHandler event removed');
      };
    }, [navigation])
  );

  const checkPipeRegistration = async (tagId) => {
    try {
      console.log('User object:', user);  // Log the user object
      if (!user || !user.token) {
        Alert.alert('Error', 'User token is missing');
        return false;
      }

      console.log(`Checking pipe registration for tagId: ${tagId}`);
      const response = await axios.get(`http://192.168.102.101:3000/pipe/${tagId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Ensure the token is passed correctly
        },
      });
      if (response.data.registered) {
        console.log('Pipe is registered');
        return true;
      } else {
        Alert.alert('Error', 'Pipe not registered');
        return false;
      }
    } catch (error) {
      console.error('Error checking pipe registration:', error);
      Alert.alert('Error', 'Failed to check pipe registration');
      return false;
    }
  };

  const readNfc = async () => {
    try {
      console.log('Requesting NFC technology');
      await NfcManager.requestTechnology(NfcTech.Ndef);
      console.log('NFC technology requested');

      const tag = await NfcManager.getTag();
      console.log('NFC tag read:', tag);
      setNfcTag(tag);

      const tagId = tag.id;
      const isRegistered = await checkPipeRegistration(tagId);

      if (isRegistered) {
        console.log('Navigating to WeldUpload with tagId:', tagId);
        navigation.navigate('WeldUpload', { pipe_id: tagId, name: user.name });
      }

      console.log('Cancelling NFC technology request');
      await NfcManager.cancelTechnologyRequest();
    } catch (ex) {
      console.warn('Error in readNfc:', ex);
      Alert.alert('Error', 'Failed to read NFC tag. Please try again.');
      console.log('Cancelling NFC technology request after error');
      await NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Reader</Text>
      <Button title="Read NFC Tag" onPress={readNfc} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default WeldWrite;
