import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, TextInput, StyleSheet, ScrollView, BackHandler } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Box, Button, useToast, VStack, HStack } from 'native-base';
import { AuthContext } from '../../user/AuthContext';
import { UrlContext } from '../../user/UrlContext'; // Import the context

const StringUpload = ({ route }) => {
  const navigation = useNavigation();
  const { pipe_id } = route.params;
  const { user } = useContext(AuthContext);
  const { serverUrl } = useContext(UrlContext); // Get server URL from context
  const toast = useToast();

  const [formData, setFormData] = useState({
    id_pipe: pipe_id,
    PWCBS: '',
    id_location: '',
    status_location: '',
    activity_name: '',
    activity_date: '',
    loc_name: '',
  });

  const [isLandscape, setIsLandscape] = useState(false);

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

  const uploadDataToMySQL = async () => {
    if (!formData.id_pipe.trim()) {
      toast.show({
        title: 'Validation Error',
        status: 'error',
        description: 'Pipe ID cannot be empty',
        placement: 'top',
      });
      return;
    }

    try {
      if (!serverUrl) {
        throw new Error('Server URL not set');
      }

      const response = await axios.post(`${serverUrl}/string/add`, { ...formData, name: user.name }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 200) {
        toast.show({
          title: 'Success',
          status: 'success',
          description: 'Data uploaded to MySQL',
          placement: 'top',
        });
        navigation.navigate('Home');
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (ex) {
      console.error('Upload Error:', ex);
      toast.show({
        title: 'Error',
        status: 'error',
        description: `Failed to upload data to MySQL: ${ex.message || 'Unknown error'}`,
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
      {isLandscape ? (
        <HStack space={4} flexWrap="wrap" justifyContent="center">
          {Object.keys(formData).map((key) => (
            <TextInput
              key={key}
              placeholder={key.replace('_', ' ')}
              placeholderTextColor="#888"
              value={formData[key]}
              onChangeText={(text) => setFormData({ ...formData, [key]: text })}
              style={styles.input}
            />
          ))}
          <Button onPress={uploadDataToMySQL} colorScheme="blue" style={styles.button}>
            Upload Data to MySQL
          </Button>
        </HStack>
      ) : (
        <VStack space={4}>
          {Object.keys(formData).map((key) => (
            <TextInput
              key={key}
              placeholder={key.replace('_', ' ')}
              placeholderTextColor="#888"
              value={formData[key]}
              onChangeText={(text) => setFormData({ ...formData, [key]: text })}
              style={styles.input}
            />
          ))}
          <Button onPress={uploadDataToMySQL} colorScheme="blue">
            Upload Data to MySQL
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
    minWidth: '40%',
  },
  button: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default StringUpload;
