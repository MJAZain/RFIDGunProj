import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, BackHandler } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Pre-step, call this before any NFC operations
NfcManager.start();

const FitupRead = () => {
  const [nfcTag, setNfcTag] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const readNfc = async () => {
    try {
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Read the NFC tag
      const tag = await NfcManager.getTag();
      setNfcTag(tag);

      // Fetch data from the backend using the tag's ID
      const tagId = tag.id;
      const response = await axios.get(`http://192.168.102.101:3000/fetch/${tagId}`);

      if (response.data) {
        const tagData = response.data;
        navigation.navigate('Display', { tagData });
      } else {
        Alert.alert('Error', 'No data found for this tag');
      }

      // Cleanup
      NfcManager.cancelTechnologyRequest();
    } catch (ex) {
      console.warn(ex);
      Alert.alert('Error', 'Failed to read NFC tag. Please try again.');
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Reader</Text>
      <Button title="Scan NFC Tag" onPress={readNfc} />
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

export default FitupRead;
