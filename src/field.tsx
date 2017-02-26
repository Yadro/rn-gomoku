import * as React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Svg, {
  G,
  Rect,
} from 'react-native-svg';
import {range} from "./util";
import store from "./redux/store";
import {actions} from "./redux/actions";
import {FieldItem, UserEnum} from "./redux/field";
import {API} from "./api";

const count = 20;
const size = 35;

interface FieldP {
  field: FieldItem[];
}
interface FieldS {
  session;
  user: UserEnum;
  currentUser;
  wait;
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
      wait: false,
    };
  }

  componentWillMount() {
    actions.fillField(API.getSteps(this.state.session));
  }

  fieldPress = ({nativeEvent}): void => {
    const {currentUser, user, session} = this.state;
    if (user !== currentUser) return;

    const {locationX, locationY} = nativeEvent;
    const touch = {
      x: Math.floor(locationX / size),
      y: Math.floor(locationY / size),
    };
    if ((touch.x < 0 || touch.x >= count || touch.y < 0 || touch.y >= count) ||
      this.props.field.find(e => equal(e.position, touch.x, touch.y))) {
      return;
    }

    actions.add({
      position: touch,
      user: user
    });
    this.setState({wait: true});
    API.postStep({session, user, position: `${touch.x};${touch.y}`})
      .then(res => {
        this.setState({currentUser: res.user});
        return API.getSteps(session);
      })
      .then(steps => {
        actions.fillField(steps);
        this.setState({wait: false});
      });
  };

  update = () => {
    this.setState({wait: true});
    API.getCurrentUser(this.state.session).then(user => {
      this.setState({currentUser: user});
      if (this.state.user == user) {
        API.getSteps(this.state.session)
          .then(steps => {
            actions.fillField(steps);
            this.setState({wait: false});
          });
      }
    });
  };

  render() {
    const {field} = this.props;
    const {user, currentUser, session, wait} = this.state;
    const fields = range(0, count).map(y => {
      return (
        <G key={y}>
          {range(0, count).map(x => {
            const style: any[] = [css.field];
            const item = field.find(e => equal(e.position, x, y));
            let fill = 'white';
            if (item) {
              style.push(item.user == user ? css.fieldActiveYou : css.fieldActive);
              fill = item.user == user ? 'green' : 'blue';
            }
            return <Rect key={x} x={x * size} y={y * size} width={size} height={size} fill={fill}
                         stroke="grey"
                         strokeWidth=".5"/>;
          })}
        </G>
      );
    });
    return (
      <View style={css.container}>
        <Text>{user == currentUser ? 'You' : 'Opponent'}</Text>
        <Text>Session {session}</Text>
        <Text>{wait ? 'wait' : ' '}</Text>
        <Button title="Refresh" onPress={this.update}/>
        <View style={css.container} >
          <ScrollView >
            <ScrollView horizontal>
              <TouchableWithoutFeedback style={css.container} onPress={this.fieldPress} >
                <Svg height={size * count} width={size * count}>
                  {fields}
                </Svg>
              </TouchableWithoutFeedback>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
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
  containerField: {
    flex: 1,
    width: size * count,
    height: size * count,
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