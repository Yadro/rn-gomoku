import * as React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {range} from "./util";
import store from "./redux/store";
import {actions} from "./redux/actions";
import {FieldItem, UserEnum} from "./redux/field";
import {API} from "./api";

const count = 10;
const size = 20;

interface FieldP {
  field: FieldItem[];
}
interface FieldS {
  session;
  user: UserEnum;
  currentUser;
}
export default class Field extends React.Component<FieldP, FieldS> {
  layout;

  constructor(props) {
    super(props);
    const {serverInfo: {user, session}} = store.getState();
    this.state = {
      session,
      user,
      currentUser: 0,
    };
  }

  componentWillMount() {
    actions.fillField(API.getSteps(this.state.session));
  }

  fieldPress = ({nativeEvent: {pageX, pageY}}): void => {
    const {currentUser, user, session} = this.state;
    if (user !== currentUser) return;
    const {y} = this.layout;
    const touch = {
      x: Math.floor(pageX / size),
      y: Math.floor((pageY - y) / size),
    };
    actions.add({
      position: touch,
      user: user
    });
    API.postStep(session, user, `${touch.x};${touch.y}`).then(res => {
      this.setState({currentUser: res.user});
      return API.getSteps(session);
    })
      .then(steps => actions.fillField(steps));
  };

  update = () => {
    API.getCurrentUser(this.state.session).then(user => {
      this.setState({currentUser: user});
      if (this.state.user == user) {
        API.getSteps(this.state.session)
          .then(steps => actions.fillField(steps));
      }
    });
  };

  render() {
    const {field} = this.props;
    const {user, currentUser, session} = this.state;
    const fields = range(0, count).map(y => {
      return (
        <View key={y} style={css.row}>
          {range(0, count).map(x => {
            const style: any[] = [css.field];
            const item = field.find(e => equal(e.position, x, y));
            if (item) {
              console.log(item.user);
              style.push(item.user == user ? css.fieldActiveYou : css.fieldActive);
            }
            return <View key={x} style={style}/>;
          })}
        </View>
      );
    });
    return (
      <TouchableWithoutFeedback style={css.container} onPress={this.fieldPress}>
        <View>
          <Text>{user == currentUser ? 'You' : 'Opponent'}</Text>
          <Text>Session {session}</Text>
          <Button title="Refresh" onPress={this.update}/>
          <View onLayout={({nativeEvent}) => this.layout = nativeEvent.layout}>
            {fields}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

function equal({x, y}, _x, _y) {
  return x === _x && y === _y;
}

function assign(...args) {
  return Object.assign({}, args);
}

assign({}, {});

const css = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    height: size,
  },
  field: {
    borderWidth: .5,
    borderColor: 'black',
    width: size,
    height: size,
  },
  fieldActiveYou: {
    backgroundColor: 'green',
  },
  fieldActive: {
    backgroundColor: 'blue',
  },
});