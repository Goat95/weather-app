# Weather App
React Native를 사용하여 만든 간단한 Weather App입니다.

## 배운점
expo를 이용한 React Native에서 style을 주는 방법과 핸드폰에 geolocation에 접근하여 api에 보내는 방법 등, expo를 이용하여 React Native 기본에 대하여 배웠습니다.

## 전체적인 구조
### Weather.js
```javascript
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// 날씨 정보를 오브젝트로 생성
const weatherOptions = {
    Haze: {
        iconName: "weather-hail",
        gradient: ["#4DA0B0", "#D39D38"],
        title: "Haze",
        subtitle: "Just don't go outside."
    },
    Thunderstorm: {
        iconName: "weather-lightning",
        gradient: ["#373B44", "#4286F4"],
        title: "Thunderstorm in the house",
        subtitle: "Actually, outside of the house"
    }, 
    Drizzle: {
        iconName: "weather-hail",
        gradient: ["#89F7FE", "#66A6FF"],
        title: "Drizzle",
        subtitle: "Is like rain, but gay"
    }, 
    Rain: {
        iconName: "weather-rainy",
        gradient: ["#00C6FB", "#005BEA"],
        title: "Raining like a MF",
        subtitle: "For more info look outside."
    }, 
    Snow: {
        iconName: "weather-snowy",
        gradient: ["#7DE2FC", "#B9B6E5"],
        title: "Cold as balls",
        subtitle: "Do you want to build a snowman? Okey bye."
    }, 
    Atmosphere: {
        iconName: "weather-hail",
        gradient: ["#89F7FE", "#66A6FF"],
        title: "Atmosphere",
        subtitle: "Just don't go outside."
    }, 
    Clear: {
        iconName: "weather-sunny",
        gradient: ["#FF7300", "#FEF253"],
        title: "Sunny as fuck",
        subtitle: "Go get your ass burnt"
    }, 
    Clouds: {
        iconName: "weather-cloudy",
        gradient: ["#D7D2CC", "#304352"],
        title: "Clouds",
        subtitle: "I know, fucking boring"
    },
    Mist: {
        iconName: "weather-hail",
        gradient: ["#4DA0B0", "#D39D38"],
        title: "Mist!",
        subtitle: "It's like you have no glasses on."
    }
}

export default function Weather({ temp, condition }) {
    return (
        <LinearGradient style={styles.container}
            colors={weatherOptions[condition].gradient}
            style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* View는 Html에 div 같은 것. */}
            <View style={styles.halfContainer}>
                <MaterialCommunityIcons name={weatherOptions[condition].iconName} size={96} color="white" />
                {/* 모든 text는 Text로 감싸야 한다. */}
                <Text style={styles.temp}>{temp}</Text>
            </View>
            <View style={{ ...styles.halfContainer, ...styles.textContainer }}>
                <Text style={styles.title}>{weatherOptions[condition].title}</Text>
                <Text style={styles.subtitle}>{weatherOptions[condition].subtitle}</Text>
            </View>
        </LinearGradient>
    );
}

Weather.PropTypes = {
    temp: PropTypes.number.isRequired,
    condition: PropTypes.oneOf(["Thunderstorm", "Drizzle", "Rain", "Snow", "Atmosphere", "Clear", "Clouds", "Haze", "Mist"]).isRequired
};

// react native는 StylesSheet Api를 이용하여 css효과를 준다.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    temp: {
        fontSize: 42,
        color: 'white'
    },
    halfContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontSize: 44,
        fontWeight: '300',
        marginBottom: 10
    },
    subtitle: {
        fontWeight: '600',
        color: 'white',
        fontSize: 24
    },
    textContainer: {
        paddingHorizontal: 20,
        alignItems: 'flex-start'
    }
})
```
### Loading.js
```javascript
import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function Loading () {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.text}>Getting the good weather</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        // react native만 가지고 있는 것.
        paddingHorizontal: 30,
        paddingVertical: 100,
        backgroundColor: '#FDF6AA'
    },
    text: {
        color: '#2c2c2c',
        fontSize: 30
    }
})
```
### App.js
```javascript
import React from 'react';
import { Alert } from 'react-native';
import Loading from './Loading';
import * as Location from 'expo-location';
import axios from 'axios';
import Weather from './Weather';

// OpenWeather API KEY
const API_KEY = 'd487b95af09a57ad56eebc01f8f0a6a6';

export default class extends React.Component {
  state = {
    isLoading: true,
  };
  // 날씨를 받아오는 함수를 비동기적으로 실행한다.
  getWeather = async (latitude, longitude) => { 
    const { data: {
      main: { temp },
      weather  
    } 
    // axios를 사용하여 api를 fetch한다.
  } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    this.setState({ isLoading: false, condition: weather[0].main, temp });
  }
  // 위치를 받아오는 함수를 비동기적으로 실행한다.
  getLocation = async () => {
    try {
      // 사용자가 permission을 주면 실행
      await Location.requestPermissionsAsync();
      // location 오브젝트 안에 coords 오브젝트의 latitude, longitude를 가져옴. 
      const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
      // Send to API and get weather  
    } catch (error) {
      // 사용자가 permission을 주지 않으면 실행
      Alert.alert("Can't find you.", "So sad");
    }
  }
  componentDidMount() {
    this.getLocation();
  }
  render () {
    const { isLoading, temp, condition } = this.state;
    return (
      isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />
    );
  }
}
```
