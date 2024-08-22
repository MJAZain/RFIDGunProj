import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView, TextInput, BackHandler } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Box, Button, useToast, VStack, HStack } from 'native-base';
import { AuthContext } from '../../user/AuthContext';
import { API_URL } from '@env';

const PipeUpload = ({ route }) => {
  const { uid } = route.params;
  const { user } = useContext(AuthContext); // Get the user context
  const navigation = useNavigation();
  const toast = useToast();

  const [spoolNo, setSpoolNo] = useState('');
  const [isoNo, setIsoNo] = useState('');
  const [jointNo, setJointNo] = useState('');
  const [pjCode, setPjCode] = useState('');

  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    handleOrientationChange(); // Check initial orientation

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/pipe/add`, {
        id_pipe: uid,
        spool_no: spoolNo,
        iso_no: isoNo,
        joint_no: jointNo,
        pj_code: pjCode,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      toast.show({
        title: 'Success',
        status: 'success',
        description: 'Pipe data submitted successfully',
        placement: 'top',
      });
      navigation.navigate('Home');
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Failed to submit pipe data',
        placement: 'top',
      });
      console.error(error);
    }
  };

  // Handling the back button
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLandscape ? (
        <HStack space={4} flexWrap="wrap" justifyContent="center">
          <TextInput
            style={styles.input}
            value={uid}
            editable={false}
            placeholder="UID"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={spoolNo}
            onChangeText={setSpoolNo}
            placeholder="Spool No"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={isoNo}
            onChangeText={setIsoNo}
            placeholder="ISO No"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={jointNo}
            onChangeText={setJointNo}
            placeholder="Joint No"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={pjCode}
            onChangeText={setPjCode}
            placeholder="PJ Code"
            placeholderTextColor="#888"
          />
          <Button onPress={handleSubmit} colorScheme="blue" style={styles.button}>
            Submit
          </Button>
        </HStack>
      ) : (
        <VStack space={4}>
          <TextInput
            style={styles.input}
            value={uid}
            editable={false}
            placeholder="UID"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={spoolNo}
            onChangeText={setSpoolNo}
            placeholder="Spool No"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={isoNo}
            onChangeText={setIsoNo}
            placeholder="ISO No"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={jointNo}
            onChangeText={setJointNo}
            placeholder="Joint No"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={pjCode}
            onChangeText={setPjCode}
            placeholder="PJ Code"
            placeholderTextColor="#888"
          />
          <Button onPress={handleSubmit} colorScheme="blue">
            Submit
          </Button>
        </VStack>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
    minWidth: '40%', // Adjust to fit multiple items in landscape mode
  },
  button: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default PipeUpload;
