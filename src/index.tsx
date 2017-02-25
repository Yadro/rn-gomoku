import * as React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
} from 'react-native';
import Field from "./field";

interface AppS {
  view: string;
  session;
}
export default class App extends React.Component<any, AppS> {

  constructor(props) {
    super(props);
    this.state = {
      view: 'choose',
      session: null
    };
  }

  _renderChoose = session => {
    return (
      <View>
        <View>
          <Button title='Server' onPress={() => null} />
        </View>
        <View>
          <TextInput value={session}/>
          <Button title='Connect' onPress={() => null} />
        </View>
      </View>
    )
  };

  _renderField = e => {
    return <Field/>
  };

  render() {
    const {session, view} = this.state;
    return <View style={{flex: 1}}>
      {view == 'choose' ?
        this._renderChoose(session) :
        this._renderField(1)
      }
    </View>
  }
}