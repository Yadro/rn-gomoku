import * as React from 'react';
import {
  View,
  Text,
} from 'react-native';

interface AppP {
}
interface AppS {
}
export default class App extends React.Component<AppP, AppS> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <View>
      <Text>Hey</Text>
    </View>
  }
}