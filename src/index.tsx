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

interface AppS {
  view: string;
  session;
  sessionInfo;
  field;
}
export default class App extends React.Component<any, AppS> {

  unsubscribe;

  constructor(props) {
    super(props);
    this.state = {
      view: 'choose',
      session: null,
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
    this.setState({
      session: +text,
      view: 'field',
    });
  };

  connectBtn = (session) => () => {
    actions.setSession(session);
    actions.setStatus(UserEnum.client);
  };

  serverBtn = () => {
    actions.setStatus(UserEnum.server);
  };

  _renderChoose = session => {
    return (
      <View>
        <View>
          <Button title='Server' onPress={this.serverBtn} />
        </View>
        <View>
          <TextInput value={session}
                     onChange={this.onChangeSession}/>
          <Button title='Connect' onPress={this.connectBtn(session)} />
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