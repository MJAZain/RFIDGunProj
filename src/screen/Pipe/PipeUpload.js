import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../user/AuthContext';

const PipeUpload = ({ route, navigation }) => {
  const { uid } = route.params;
  const { user } = useContext(AuthContext); // Get the user context
  const [spoolNo, setSpoolNo] = useState('');
  const [isoNo, setIsoNo] = useState('');
  const [jointNo, setJointNo] = useState('');
  const [pjCode, setPjCode] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('http://192.168.102.101:3000/pipe', {
        id_pipe: uid,
        spool_no: spoolNo,
        iso_no: isoNo,
        joint_no: jointNo,
        pj_code: pjCode,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}` // Include the token in the request headers
        }
      });
      Alert.alert('Success', 'Pipe data submitted successfully');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit pipe data');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>UID</Text>
      <TextInput style={styles.input} value={uid} editable={false} />

      <Text style={styles.label}>Spool No</Text>
      <TextInput style={styles.input} value={spoolNo} onChangeText={setSpoolNo} />

      <Text style={styles.label}>ISO No</Text>
      <TextInput style={styles.input} value={isoNo} onChangeText={setIsoNo} />

      <Text style={styles.label}>Joint No</Text>
      <TextInput style={styles.input} value={jointNo} onChangeText={setJointNo} />

      <Text style={styles.label}>PJ Code</Text>
      <TextInput style={styles.input} value={pjCode} onChangeText={setPjCode} />

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#121212'
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default PipeUpload;
