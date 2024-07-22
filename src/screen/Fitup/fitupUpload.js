import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../user/AuthContext';

const FitupUpload = ({ route }) => {
  const navigation = useNavigation();
  const { pipe_id, name } = route.params;
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    id_pipe: pipe_id,
    fitup_date: '',
    fitup_result: '',
    heat1: '',
    heat2: '',
    name: user.name
  });

  const uploadDataToMySQL = async () => {
    if (!formData.id_pipe.trim()) {
      Alert.alert('Validation Error', 'Pipe ID cannot be empty');
      return;
    }

    try {
      const response = await axios.post('http://192.168.102.101:3000/fitup/add', formData);
      if (response.status === 200) {
        Alert.alert('Success', 'Data uploaded to MySQL', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home') // Navigate back to the Home screen
          }
        ]);
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (ex) {
      console.error('Upload Error:', ex);
      if (ex.response) {
        console.error('Response data:', ex.response.data);
        console.error('Response status:', ex.response.status);
        console.error('Response headers:', ex.response.headers);
      } else if (ex.request) {
        console.error('Request data:', ex.request);
      } else {
        console.error('Error message:', ex.message);
      }
      Alert.alert('Error', `Failed to upload data to MySQL: ${ex.message || 'Unknown error'}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(formData).filter(key => key !== 'id_pipe').map((key) => (
        <TextInput
          key={key}
          placeholder={key}
          placeholderTextColor="#888"
          value={formData[key]}
          onChangeText={(text) => setFormData({ ...formData, [key]: text })}
          style={styles.input}
        />
      ))}
      <Button title="Upload Data to MySQL" onPress={uploadDataToMySQL} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#333',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    color: '#fff',
    backgroundColor: '#444',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default FitupUpload;
