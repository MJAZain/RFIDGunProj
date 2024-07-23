import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, TextInput, StyleSheet, ScrollView, BackHandler } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Box, Button, useToast, VStack, HStack, Text } from 'native-base';
import { AuthContext } from '../../user/AuthContext';

const WeldUpload = () => {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { pipe_id } = route.params;

  const toast = useToast();
  const [formData, setFormData] = useState({
    id_pipe: pipe_id,
    root1: '',
    root2: '',
    root3: '',
    root4: '',
    weldingcol: '',
    root_wp: '',
    root_batchno: '',
    filler1: '',
    filler2: '',
    filler3: '',
    filler4: '',
    filler_wp: '',
    filler_batchno: '',
    cover1: '',
    cover2: '',
    cover3: '',
    cover4: '',
    cover_wp: '',
    cover_batchno: '',
    wps_id: '',
  });

  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    handleOrientationChange();

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const data = { ...formData, name: user.name, id_pipe: pipe_id };
    try {
      const response = await axios.post('http://192.168.102.101:3000/welding/add', data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 201) {
        toast.show({
          title: 'Success',
          status: 'success',
          description: 'Welding data uploaded successfully',
          placement: 'top',
        });
        navigation.navigate('Home');
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error(error);
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'An error occurred while uploading welding data',
        placement: 'top',
      });
    }
  };

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
      <Text style={styles.title}>Weld Upload</Text>
      {isLandscape ? (
        <HStack space={4} flexWrap="wrap" justifyContent="center">
          {Object.keys(formData).map((key) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={key.replace('_', ' ')}
              placeholderTextColor="#888"
              value={formData[key]}
              onChangeText={(value) => handleInputChange(key, value)}
            />
          ))}
          <Button onPress={handleSubmit} colorScheme="blue" style={styles.button}>
            Submit
          </Button>
        </HStack>
      ) : (
        <VStack space={4}>
          {Object.keys(formData).map((key) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={key.replace('_', ' ')}
              placeholderTextColor="#888"
              value={formData[key]}
              onChangeText={(value) => handleInputChange(key, value)}
            />
          ))}
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
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
    color: '#000',
    backgroundColor: '#fff',
    flex: 1,
    minWidth: '40%', // Adjust to fit multiple items in landscape mode
  },
  button: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default WeldUpload;
