import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, Alert, StyleSheet, BackHandler } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../../user/AuthContext';

const FitupWrite = () => {
  const [nfcTag, setNfcTag] = useState(null);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    NfcManager.start();

    return () => {
      NfcManager.stop();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation])
  );

  const checkPipeRegistration = async (tagId) => {
    try {
      const response = await axios.get(`http://192.168.102.101:3000/pipe/${tagId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Assuming user.token contains the JWT token
        },
      });
      if (response.data.registered) {
        return true;
      } else {
        Alert.alert('Error', 'Pipe not registered');
        return false;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to check pipe registration');
      return false;
    }
  };

  const readNfc = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      setNfcTag(tag);

      const tagId = tag.id;
      const isRegistered = await checkPipeRegistration(tagId);

      if (isRegistered) {
        navigation.navigate('Upload', { pipe_id: tagId, name: user.name });
      }

      await NfcManager.cancelTechnologyRequest();
    } catch (ex) {
      console.warn(ex);
      Alert.alert('Error', 'Failed to read NFC tag. Please try again.');
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

export default FitupWrite;
