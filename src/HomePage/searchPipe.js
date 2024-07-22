import React, { useState, useContext } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../user/AuthContext';

const SearchPipeScreen = () => {
  const [spoolNo, setSpoolNo] = useState('');
  const [isoNo, setIsoNo] = useState('');
  const [jointNo, setJointNo] = useState('');
  const [pjCode, setPjCode] = useState('');
  const [results, setResults] = useState({ pipes: [], fitup: [], welding: [], stringing: [] });
  const { user } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!user || !user.token) {
      Alert.alert('Error', 'User is not authenticated');
      return;
    }

    try {
      const response = await axios.get('http://192.168.102.101:3000/search/pipes', {
        params: {
          spool_no: spoolNo,
          iso_no: isoNo,
          joint_no: jointNo,
          pj_code: pjCode,
        },
        headers: {
          Authorization: `Bearer ${user.token}`, // Include the token in the request headers
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching pipe data:', error);
      Alert.alert('Error', `Failed to fetch pipe data: ${error.message}`);
    }
  };

  const renderPipeItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text>Pipe ID: {item.id_pipe}</Text>
      <Text>Spool No: {item.spool_no}</Text>
      <Text>Isometric No: {item.iso_no}</Text>
      <Text>Joint No: {item.joint_no}</Text>
      <Text>Project Code: {item.pj_code}</Text>
    </View>
  );

  const renderFitupItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text>Fitup Date: {item.fitup_date}</Text>
      <Text>Fitup Result: {item.fitup_result}</Text>
      <Text>Heat 1: {item.heat1}</Text>
      <Text>Heat 2: {item.heat2}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Pipe ID: {item.id_pipe}</Text>
    </View>
  );

  const renderWeldingItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text>Root 1: {item.root1}</Text>
      <Text>Root 2: {item.root2}</Text>
      <Text>Root 3: {item.root3}</Text>
      <Text>Root 4: {item.root4}</Text>
      <Text>Welding Column: {item.welsingcol}</Text>
      <Text>Root WP: {item.root_wp}</Text>
      <Text>Root Batch No: {item.root_batchno}</Text>
      <Text>Filler 1: {item.filler1}</Text>
      <Text>Filler 2: {item.filler2}</Text>
      <Text>Filler 3: {item.filler3}</Text>
      <Text>Filler 4: {item.filler4}</Text>
      <Text>Filler WP: {item.filler_wp}</Text>
      <Text>Filler Batch No: {item.filler_batchno}</Text>
      <Text>Cover 1: {item.cover1}</Text>
      <Text>Cover 2: {item.cover2}</Text>
      <Text>Cover 3: {item.cover3}</Text>
      <Text>Cover 4: {item.cover4}</Text>
      <Text>Cover WP: {item.cover_wp}</Text>
      <Text>Cover Batch No: {item.cover_batchno}</Text>
      <Text>WPS ID: {item.wps_id}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Pipe ID: {item.id_pipe}</Text>
    </View>
  );

  const renderStringingItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text>PWCBS: {item.PWCBS}</Text>
      <Text>Location ID: {item.id_location}</Text>
      <Text>Status: {item.status_location}</Text>
      <Text>Activity Name: {item.activity_name}</Text>
      <Text>Activity Date: {item.activity_date}</Text>
      <Text>Location Name: {item.loc_name}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Pipe ID: {item.id_pipe}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Spool No"
        value={spoolNo}
        onChangeText={setSpoolNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Isometric No"
        value={isoNo}
        onChangeText={setIsoNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Joint No"
        value={jointNo}
        onChangeText={setJointNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Project Code"
        value={pjCode}
        onChangeText={setPjCode}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={results.pipes}
        keyExtractor={(item) => item.id_pipe.toString()}
        renderItem={renderPipeItem}
        style={styles.resultsList}
      />
      <Text>Fitup Results:</Text>
      <FlatList
        data={results.fitup}
        keyExtractor={(item) => item.id_pipe.toString()}
        renderItem={renderFitupItem}
        style={styles.resultsList}
      />
      <Text>Welding Results:</Text>
      <FlatList
        data={results.welding}
        keyExtractor={(item) => item.id_pipe.toString()}
        renderItem={renderWeldingItem}
        style={styles.resultsList}
      />
      <Text>Stringing Results:</Text>
      <FlatList
        data={results.stringing}
        keyExtractor={(item) => item.id_pipe.toString()}
        renderItem={renderStringingItem}
        style={styles.resultsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  resultsList: {
    marginTop: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
});

export default SearchPipeScreen;
