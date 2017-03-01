import * as React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
} from 'react-native';
import Field from "./field";
import store from "./redux/store";
import {actions} from "./redux/actions";
import {UserEnum} from "./redux/field";
import {ServerApi, ClientApi} from "./api";

interface AppS {
  view: string;
  room;
  sessionInfo;
  field;
}

export default class App extends React.Component<any, AppS> {

  api: ServerApi;
  unsubscribe;

  constructor(props) {
    super(props);
    this.state = {
      view: 'choose',
      room: null,
      sessionInfo: {},
      field: []
    };
  }

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

  onChangeSession = ({nativeEvent: {text}}) => {
    this.setState({room: text});
  };

  connectBtn = (room) => () => {
    actions.asClient(room);
    this.api = new ServerApi('client');
    this.api.connect(room).then(room => {
      this.setState({view: 'game'});
    }).catch(e => {
      console.error('rejected');
    });
  };

  serverBtn = () => {
    this.api = new ServerApi('server');
    this.api.connect().then(room => {
      actions.asServer(room);
      this.setState({view: 'game'});
    }).catch(e => {
      console.error('rejected')
    })
  };

  _renderChoose = (room) => {
    return (
      <View style={{margin: 10}}>
        <View>
          <Button title='Server' onPress={this.serverBtn} />
        </View>
        <View>
          <TextInput value={room}
                     onChange={this.onChangeSession}/>
          <Button title='Connect' onPress={this.connectBtn(room)} />
        </View>
      </View>
    )
  };

  _renderField = () => {
    const {field} = this.state;
    return <Field field={field} api={this.api}/>
  };

  render() {
    const {room, view} = this.state;
    return <View style={{flex: 1}}>
      {view == 'choose' ?
        this._renderChoose(room) :
        this._renderField()
      }
    </View>
  }
}