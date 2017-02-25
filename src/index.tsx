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
import {API} from "./api";

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
    this.setState({session: text});
  };

  connectBtn = (session) => () => {
    actions.asClient(+session);
    this.setState({view: 'game'});
  };

  serverBtn = () => {
    API.create().then(session => {
      actions.asServer(+session);
      this.setState({view: 'game'});
    })
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

  _renderField = () => {
    const {field} = this.state;
    return <Field field={field}/>
  };

  render() {
    const {session, view} = this.state;
    return <View style={{flex: 1}}>
      {view == 'choose' ?
        this._renderChoose(session) :
        this._renderField()
      }
    </View>
  }
}