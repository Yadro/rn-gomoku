import * as React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
} from 'react-native';
import {actions} from "./redux/actions";
import ServerApi from "./api";

interface AppS {
  view: string;
  room;
  sessionInfo;
  field;
}

export default class App extends React.Component<any, AppS> {

  static navigationOptions = {
    title: 'Gomoku',
  };

  constructor(props) {
    super(props);
    this.state = {
      view: 'choose',
      room: null,
      sessionInfo: {},
      field: []
    };
  }

  onChangeSession = ({nativeEvent: {text}}) => {
    this.setState({room: text});
  };

  connectBtn = (room) => () => {
    const {navigate} = this.props.navigation;
    const api = new ServerApi('client');
    actions.asClient(room, api);
    api.connect(room).then(room => {
      navigate('Game');
    }).catch(e => {
      console.error(e);
    });
  };

  serverBtn = () => {
    const {navigate} = this.props.navigation;
    const api = new ServerApi('server');
    api.connect().then(room => {
      actions.asServer(room, api);
      navigate('Game');
    }).catch(e => {
      console.error(e)
    })
  };

  render() {
    const {room} = this.state;
    return <View style={{margin: 10}}>
      <Button title='Server' onPress={this.serverBtn}/>
      <View style={{marginTop: 10, marginBottom: 10}}>
        <TextInput value={room}
                   onChange={this.onChangeSession}/>
        <Button title='Connect' onPress={this.connectBtn(room)}/>
      </View>
      <Button title='List of server' onPress={this.serverBtn} />
    </View>
  }
}