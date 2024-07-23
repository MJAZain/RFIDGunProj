import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, Dimensions } from 'react-native';
import { AuthContext } from '../user/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = ({ window: { width, height } }) => {
      setIsLandscape(width > height);
    };

    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    handleOrientationChange({ window: Dimensions.get('window') }); // Check initial orientation

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, []);

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

  const imageSource = require('../../public/userImage/Logo_PT_Rekayasa_Industri.jpg');

  return (
    <View style={styles.container}>
      <View style={[styles.content, isLandscape && styles.landscapeContent]}>
        <Image
          source={imageSource}
          style={[styles.image, isLandscape && styles.landscapeImage]}
          resizeMode="contain"
        />
        {user ? (
          <View style={[styles.userInfoContainer, isLandscape && styles.landscapeUserInfoContainer]}>
            <View style={[styles.userInfo, isLandscape && styles.landscapeUserInfo]}>
              <Text style={styles.text}>Name: {user.name}</Text>
              <Text style={styles.text}>Email: {user.email}</Text>
              <Text style={styles.text}>Company: {user.company}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Logout" onPress={handleLogout} color="#FF6347" />
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.text}>No user information available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landscapeContent: {
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: 100,
    marginBottom: 20,
  },
  landscapeImage: {
    width: '50%',
    height: 'auto',
    marginBottom: 0,
    marginRight: 20,
  },
  userInfoContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  landscapeUserInfoContainer: {
    width: '50%',
  },
  userInfo: {
    width: '100%',
    alignItems: 'center',
  },
  landscapeUserInfo: {
    width: '100%',
  },
  text: {
    color: '#000',
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'left',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default ProfileScreen;
