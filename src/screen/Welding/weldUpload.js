import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../user/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';

const WeldUpload = () => {
  const [formData, setFormData] = useState({
    root1: '',
    root2: '',
    root3: '',
    root4: '',
    welsingcol: '',
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

  const { user } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { pipe_id } = route.params;

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const data = { ...formData, name: user.name, id_pipe: pipe_id };
    try {
      const response = await axios.post('http://192.168.102.101:3000/welding/add', data, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Assuming user.token contains the JWT token
        },
      });
      if (response.status === 201) {
        Alert.alert('Success', 'Welding data uploaded successfully');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Failed to upload welding data');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while uploading welding data');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weld Upload</Text>
      {Object.keys(formData).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key}
          value={formData[key]}
          onChangeText={(value) => handleInputChange(key, value)}
        />
      ))}
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
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
  },
});

export default WeldUpload;
