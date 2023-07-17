import * as React from 'react';
import { Appbar } from 'react-native-paper';

const MyComponent = ({title , navigation}) => (
  <Appbar.Header className="bg-[#877dfa]">
    <Appbar.Content title={title}  titleStyle={{color:"white" }} />
    {/* <Appbar.Action icon="calendar" onPress={() => {}} /> */}
    {/* <Appbar.Action icon="magnify" onPress={() => {}} /> */}
  </Appbar.Header>
);

export default MyComponent;