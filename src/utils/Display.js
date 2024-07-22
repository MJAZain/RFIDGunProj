import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Display = ({ route }) => {
  const { tagData } = route.params;

  const fields = [
    'pipe_id', 'fitup_date', 'fitup_result', 'heat1', 'heat2',
    'isometric_no', 'joint_no', 'joint_id', 'fitupdt',
    'isometric_id', 'subcont_code', 'pj_code'
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tag Data</Text>
      {fields.map((key) => (
        <View key={key} style={styles.dataContainer}>
          <Text style={styles.dataKey}>{key.replace('_', ' ')}:</Text>
          <Text style={styles.dataValue}>{tagData[key] || 'N/A'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#333',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  dataContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 5,
  },
  dataKey: {
    color: '#aaa',
    fontSize: 16,
  },
  dataValue: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Display;
