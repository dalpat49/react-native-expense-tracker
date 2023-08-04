import React ,{ useState ,useEffect}from 'react';
import {
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  SafeAreaView,
  I18nManager,
  FlatList,
  RefreshControl,
  Pressable,
  View,
  Modal,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import axios from "axios";
import { Input, Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from "react-native-toast-message";
import Appbar from "./Appbar";
import * as BackgroundFetch from 'expo-background-fetch';
import { startBackgroundLocationTracking, stopBackgroundLocationTracking, BACKGROUND_LOCATION_TASK_NAME } from '../BackgroundTask';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit"




const Statics = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
  
}) => {
    const data = [
        {
          name: "Seoul",
          population: 21500000,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Toronto",
          population: 2800000,
          color: "#F00",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Beijing",
          population: 527612,
          color: "red",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "New York",
          population: 8538000,
          color: "#ffffff",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Moscow",
          population: 11920000,
          color: "rgb(0, 0, 255)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }
      ];

  return (
    <>
      <View>
  <Text>Bezier Line Chart</Text>
  <PieChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
        }
      ]
    }}
    // width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisSuffix="k"

    bezier
    accessor={"population"}
    backgroundColor={"transparent"}
    paddingLeft={"15"}
    center={[10, 50]}
    absolute
  />
</View>
        </>
  );
};

export default Statics;
