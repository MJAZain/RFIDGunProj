import React, { useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../user/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Fitup"
            onPress={() => navigation.navigate('FitupWrite')}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Welding"
            onPress={() => navigation.navigate('WeldWrite')}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Stringing"
            onPress={() => navigation.navigate('StringWrite')}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Pipe Writing"
            onPress={() => navigation.navigate('PipeWriting')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  buttonWrapper: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
});

export default HomeScreen;
