import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, Alert } from 'react-native';
import { Box, Input, Button, Text, VStack, Collapse, HStack, SectionList, useToast } from 'native-base';
import axios from 'axios';
import { AuthContext } from '../user/AuthContext';
import { useUrl } from '../user/UrlContext'; // Import useUrl hook

const SearchPipeScreen = () => {
  const [spoolNo, setSpoolNo] = useState('');
  const [isoNo, setIsoNo] = useState('');
  const [jointNo, setJointNo] = useState('');
  const [pjCode, setPjCode] = useState('');
  const [results, setResults] = useState({ pipes: [], fitup: [], welding: [], stringing: [] });
  const [showSearch, setShowSearch] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const { user } = useContext(AuthContext);
  const { serverUrl } = useUrl(); // Use URL context
  const toast = useToast();

  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    handleOrientationChange(); // Check initial orientation

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, []);

  const handleSearch = async () => {
    if (showSearch) {
      // If search bar is visible, execute the search
      if (!user || !user.token) {
        Alert.alert('Error', 'User is not authenticated');
        return;
      }

      if (!serverUrl) {
        Alert.alert('Error', 'Server URL is not set');
        return;
      }

      try {
        const response = await axios.get(`${serverUrl}/search/pipes`, {
          params: {
            spool_no: spoolNo,
            iso_no: isoNo,
            joint_no: jointNo,
            pj_code: pjCode,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setResults(response.data);
        setShowSearch(false);
      } catch (error) {
        console.error('Error fetching pipe data:', error);
        if (error.response && error.response.status === 404) {
          toast.show({
            title: 'Error',
            status: 'error',
            description: 'Pipe does not exist!',
            placement: 'top',
          });
        } else {
          Alert.alert('Error', `Failed to fetch pipe data: ${error.message}`);
        }
      }
    } else {
      setShowSearch(true);
    }
  };

  const renderPipeItem = ({ item }) => (
    <Box style={styles.resultItem}>
      <Text>Pipe ID: {item.id_pipe}</Text>
      <Text>Spool No: {item.spool_no}</Text>
      <Text>Isometric No: {item.iso_no}</Text>
      <Text>Joint No: {item.joint_no}</Text>
      <Text>Project Code: {item.pj_code}</Text>
    </Box>
  );

  const renderFitupItem = ({ item }) => (
    <Box style={styles.resultItem}>
      <Text>Fitup Date: {item.fitup_date}</Text>
      <Text>Fitup Result: {item.fitup_result}</Text>
      <Text>Heat 1: {item.heat1}</Text>
      <Text>Heat 2: {item.heat2}</Text>
      <Text>Name: {item.name}</Text>
    </Box>
  );

  const renderWeldingItem = ({ item }) => (
    <Box style={styles.resultItem}>
      <Text>Welding Date: {item.welding_date}</Text>
      <Text>Root 1: {item.root1}</Text>
      <Text>Root 2: {item.root2}</Text>
      <Text>Root 3: {item.root3}</Text>
      <Text>Root 4: {item.root4}</Text>
      <Text>Welding Column: {item.weldingcol}</Text>
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
    </Box>
  );

  const renderStringingItem = ({ item }) => (
    <Box style={styles.resultItem}>
      <Text>Stringing Date: {item.stringing_date}</Text>
      <Text>PWCBS: {item.PWCBS}</Text>
      <Text>Location ID: {item.id_location}</Text>
      <Text>Status: {item.status_location}</Text>
      <Text>Activity Name: {item.activity_name}</Text>
      <Text>Activity Date: {item.activity_date}</Text>
      <Text>Location Name: {item.loc_name}</Text>
      <Text>Name: {item.name}</Text>
    </Box>
  );

  const sections = [
    { title: 'Pipes', data: results.pipes, renderItem: renderPipeItem },
    { title: 'Fitup Results', data: results.fitup, renderItem: renderFitupItem },
    { title: 'Welding Results', data: results.welding, renderItem: renderWeldingItem },
    { title: 'Stringing Results', data: results.stringing, renderItem: renderStringingItem },
  ];

  return (
    <Box flex={1} bg="white" p={4}>
      <Button onPress={handleSearch} mb={4}>
        Search
      </Button>
      <Collapse isOpen={showSearch}>
        {isLandscape ? (
          <HStack space={3} mb={4}>
            <Input
              placeholder="Spool No"
              value={spoolNo}
              onChangeText={setSpoolNo}
              bg="gray.200"
              borderRadius="5"
              placeholderTextColor="gray.500"
              flex={1}
            />
            <Input
              placeholder="Isometric No"
              value={isoNo}
              onChangeText={setIsoNo}
              bg="gray.200"
              borderRadius="5"
              placeholderTextColor="gray.500"
              flex={1}
            />
            <Input
              placeholder="Joint No"
              value={jointNo}
              onChangeText={setJointNo}
              bg="gray.200"
              borderRadius="5"
              placeholderTextColor="gray.500"
              flex={1}
            />
            <Input
              placeholder="Project Code"
              value={pjCode}
              onChangeText={setPjCode}
              bg="gray.200"
              borderRadius="5"
              placeholderTextColor="gray.500"
              flex={1}
            />
          </HStack>
        ) : (
          <VStack space={3} mb={4}>
            <Input
              placeholder="Spool No"
              value={spoolNo}
              onChangeText={setSpoolNo}
              bg="gray.200"
              borderRadius="5"
              placeholderTextColor="gray.500"
            />
            <Input
              placeholder="Isometric No"
              value={isoNo}
              onChangeText={setIsoNo}
              bg="gray.200"
              borderRadius="5"
              placeholderTextColor="gray.500"
            />
            <Input
              placeholder="Joint No"
              value={jointNo}
              onChangeText={setJointNo}
              bg="gray.200"
              borderRadius="5"
              placeholderTextColor="gray.500"
            />
            <Input
              placeholder="Project Code"
              value={pjCode}
              onChangeText={setPjCode}
              bg="gray.200"
              borderRadius="5"
              placeholderTextColor="gray.500"
            />
          </VStack>
        )}
      </Collapse>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, section }) => section.renderItem({ item })}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        contentContainerStyle={styles.sectionList}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  resultItem: {
    padding: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionList: {
    paddingBottom: 20,
  },
});

export default SearchPipeScreen;
