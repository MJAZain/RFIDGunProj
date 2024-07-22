import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { AuthContext } from '../user/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            await logout();
            navigation.replace('Login');  // Use replace to ensure the user cannot go back to the profile screen
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Name: {user.name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Company: {user.company}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Logout" onPress={handleLogout} color="#FF6347" />
          </View>
        </>
      ) : (
        <Text style={styles.text}>No user information available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default ProfileScreen;
