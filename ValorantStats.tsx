import React, {useState} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ValorantStats = () => {
  const [agentName, setAgentName] = useState('');
  const [agentStats, setAgentStats] = useState<any>(null);
  const [maps, setMaps] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'agents' | 'maps'>('agents');
  const [selectedMap, setSelectedMap] = useState<any>(null);

  // Récupérer les données des agents
  const getAgentStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://valorant-api.com/v1/agents', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      const agent = data.data.find(
        (agent: any) =>
          agent.displayName.toLowerCase() === agentName.toLowerCase(),
      );

      if (agent) {
        setAgentStats(agent);
      } else {
        setAgentStats(null);
      }
    } catch (error) {
      console.error(error);
      setAgentStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les données des cartes
  const getMaps = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://valorant-api.com/v1/maps', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setMaps(data.data);
      console.log(data);
    } catch (error) {
      console.error(error);
      setMaps(null);
    } finally {
      setLoading(false);
    }
  };

  // Basculer entre les modes "agents" et "maps"
  const toggleViewMode = (mode: 'agents' | 'maps') => {
    setViewMode(mode);
    if (mode === 'maps' && !maps) {
      getMaps();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button title="View Agents" onPress={() => toggleViewMode('agents')} />
        <Button title="View Maps" onPress={() => toggleViewMode('maps')} />
      </View>

      {viewMode === 'agents' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter Agent Name"
            value={agentName}
            onChangeText={setAgentName}
          />
          <Button title="Get Agent Stats" onPress={getAgentStats} />

          {loading && <Text>Loading...</Text>}

          {agentStats ? (
            <ScrollView contentContainerStyle={styles.agentInfo}>
              <Image
                source={{uri: agentStats.fullPortrait}}
                style={styles.agentImage}
              />
              <Text style={styles.agentName}>{agentStats.displayName}</Text>
              <Text style={styles.agentDescription}>
                {agentStats.description}
              </Text>
              <Text style={styles.agentRole}>
                Role: {agentStats.role.displayName}
              </Text>
              <Text style={styles.sectionTitle}>Abilities:</Text>
              {agentStats.abilities.map((ability: any, index: number) => (
                <View key={index} style={styles.abilityContainer}>
                  <Text style={styles.abilityName}>{ability.displayName}</Text>
                  <Text style={styles.abilityDescription}>
                    {ability.description}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text>No agent found or incorrect name</Text>
          )}
        </View>
      )}

      {viewMode === 'maps' && (
        <View>
          {selectedMap ? (
            <View style={styles.fullMapContainer}>
              <Text style={styles.selectedMapName}>
                {selectedMap.displayName}
              </Text>
              <Image
                source={{uri: selectedMap.displayIcon}}
                style={styles.fullMapImage}
              />
              <Button
                title="Back to Maps"
                onPress={() => setSelectedMap(null)}
              />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.mapsInfo}>
              {loading && <Text>Loading maps...</Text>}
              {maps ? (
                maps.map((map: any) => (
                  <TouchableOpacity
                    key={map.uuid}
                    onPress={() => setSelectedMap(map)}>
                    <View style={styles.mapContainer}>
                      <Text style={styles.mapName}>{map.displayName}</Text>
                      <Image
                        source={{uri: map.splash}}
                        style={styles.mapImage}
                      />
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No maps found</Text>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  agentInfo: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  agentName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  agentDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  agentRole: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  abilityContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  abilityName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  abilityDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  mapsInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  mapContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mapName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mapImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  fullMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMapName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fullMapImage: {
    width: 500,
    height: 400,
    resizeMode: 'contain',
  },
  agentImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
});

export default ValorantStats;
