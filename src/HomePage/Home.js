import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { VStack, Box, Text, Pressable } from 'native-base';
import { AuthContext } from '../user/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    handleOrientationChange();

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.buttonContainer, isLandscape && styles.landscapeButtonContainer]}>
        <VStack space={4}>
          <Box style={[styles.row, isLandscape && styles.landscapeRow]}>
            <Pressable
              style={styles.buttonWrapper}
              onPress={() => navigation.navigate('FitupWrite')}
            >
              <Image
                source={require('../../public/pipeImage/Fitup.webp')}
                style={styles.image}
              />
              <Text style={styles.label}>Fitup</Text>
            </Pressable>
            <Pressable
              style={styles.buttonWrapper}
              onPress={() => navigation.navigate('WeldWrite')}
            >
              <Image
                source={require('../../public/pipeImage/Welding.webp')}
                style={styles.image}
              />
              <Text style={styles.label}>Welding</Text>
            </Pressable>
            <Pressable
              style={styles.buttonWrapper}
              onPress={() => navigation.navigate('StringWrite')}
            >
              <Image
                source={require('../../public/pipeImage/Stringing.webp')}
                style={styles.image}
              />
              <Text style={styles.label}>Stringing</Text>
            </Pressable>
          </Box>
          <Box style={[styles.row, isLandscape && styles.landscapeRow]}>
            <Pressable
              style={styles.buttonWrapper}
              onPress={() => navigation.navigate('PipeWriting')}
            >
              <Image
                source={require('../../public/pipeImage/RFID.jpg')}
                style={styles.image}
              />
              <Text style={styles.label}>Pipe Writing</Text>
            </Pressable>
          </Box>
        </VStack>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  buttonContainer: {
    width: '90%',
  },
  landscapeButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  landscapeRow: {
    justifyContent: 'center',
  },
  buttonWrapper: {
    width: 100,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  label: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
