import React, {Component} from 'react';
import {AppRegistry, View} from 'react-native';
import App from './build/index';
import store from "./build/redux/store";
import {StackNavigator} from 'react-navigation';
import Field from './build/field';


const Wrapper = StackNavigator({
  App: {screen: App},
  Game: {screen: Field},
});

class ReduxApp extends React.Component {

  componentWillMount() {
    this.unsubscribe = store.subscribe(() => {
      const {field, sessionInfo} = store.getState();
      this.setState({
        field,
        sessionInfo,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return <View style={{flex: 1}}>
      <Wrapper/>
    </View>
  }
}


AppRegistry.registerComponent('Gomoku', () => ReduxApp);
