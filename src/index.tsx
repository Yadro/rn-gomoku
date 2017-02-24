import * as React from 'react';
import {
  View,
  Text,
} from 'react-native';
import Field from "./field";

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
    return <View style={{flex: 1}}>
      <Field />
      <Text>Complete</Text>
    </View>
  }
}