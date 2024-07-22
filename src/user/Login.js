import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { AuthContext } from './AuthContext';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      console.log('Starting login process');
      const response = await axios.post('http://192.168.102.101:3000/auth/login', { email, password });
      console.log('Received response:', response.data);

      const { token } = response.data;
      console.log('JWT token:', token);

      // Decode the token to get user info
      const userInfo = { ...jwtDecode(token), token };
      console.log('Decoded user info:', userInfo);

      await login(userInfo);
      console.log('User info stored in context');

      // Navigate to the home screen
      navigation.navigate('HomeTabs'); // Update this to match your navigation structure
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
        placeholder="Enter your email"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
        placeholder="Enter your password"
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#1E90FF" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={() => navigation.navigate('Register')} color="#1E90FF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: '#fff',
    backgroundColor: '#1f1f1f',
  },
  buttonContainer: {
    marginBottom: 10,
  },
});

export default Login;
