import axios from 'axios';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

const ValorantStats = () => {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getStats = async () => {
    setLoading(true);
    try {
      // Remplacer par une clé d'API réelle et l'URL de l'API de Riot
      const response = await axios.get(
        `https://api.riotgames.com/valorant/player/${username}`,
      );
      setStats(response.data);
    } catch (error) {
      console.error(error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Player Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Get Stats" onPress={getStats} />

      {loading && <Text>Loading...</Text>}
      {stats && (
        <View>
          <Text style={styles.statsText}>Kills: {stats.kills}</Text>
          <Text style={styles.statsText}>Deaths: {stats.deaths}</Text>
          <Text style={styles.statsText}>Assists: {stats.assists}</Text>
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
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ValorantStats;
