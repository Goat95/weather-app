import React from 'react';
import { Alert } from 'react-native';
import Loading from './Loading';
import * as Location from 'expo-location';
import axios from 'axios';

const API_KEY = 'd487b95af09a57ad56eebc01f8f0a6a6';

export default class extends React.Component {
  state = {
    isLoading: true
  };
  getWeather = async (latitude, longitude) => {
    const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    console.log(data);
  }
  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
      this.setState({ isLoading: false });
      // Send to API and get weather  
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  }
  componentDidMount() {
    this.getLocation();
  }
  render () {
    const { isLoading } = this.state;
    return (
      isLoading ? <Loading /> : null
    );
  }
}

