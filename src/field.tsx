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
  Circle,
} from 'react-native-svg';
import {range} from "./util";
import store from "./redux/store";
import {actions} from "./redux/actions";
import {FieldItem, UserEnum} from "./redux/field";

const count = 20;
const size = 35;

interface FieldP {
  api;
  field: FieldItem[];
}
interface FieldS {
  room;
  user: UserEnum;
  currentUser;
  wait;
}
export default class Field extends React.Component<FieldP, FieldS> {
  layout;

  constructor(props: FieldP) {
    super(props);
    const {serverInfo: {user, room}} = store.getState();
    this.state = {
      room,
      user,
      currentUser: UserEnum.server,
      wait: false,
    };
    props.api.subscribe(this.update);
  }

  componentWillMount() {
  }

  fieldPress = ({nativeEvent}): void => {
    const {currentUser, user} = this.state;
    if (currentUser != user) return;

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
      user,
    });
    this.setState({wait: true});
    this.props.api.step(`${touch.x};${touch.y}`)
      .then(data => {
        console.log(data);
        this.setState({
          currentUser: user == UserEnum.server ? UserEnum.client : UserEnum.server
        });
      });
  };

  update = (data) => {
    const {user} = this.state;
    console.log(data);
    // todo
    const [x, y] = data.position.split(';');
    actions.add({
      position: {
        x: +x,
        y: +y,
      },
      user: user == UserEnum.server ? UserEnum.client : UserEnum.server,
    });
    this.setState({
      wait: false,
      currentUser: user
    });
  };

  render() {
    const {field} = this.props;
    const {user, currentUser, wait, room} = this.state;
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
              return (
                <G key={x}>
                  <Rect key={'r' + x} x={x * size } y={y * size} width={size} height={size}
                        fill="white" stroke="grey" strokeWidth=".5"/>
                  <Circle key={'c' + x} cx={x * size + size / 2} cy={y * size + size / 2} r={size / 2}
                          fill={fill} stroke="grey" strokeWidth=".5"/>
                </G>

              )
            }
            return <Rect key={x} x={x * size } y={y * size} width={size} height={size}
                         fill={fill} stroke="grey" strokeWidth=".5"/>
          })}
        </G>
      );
    });
    return (
      <View style={css.container}>
        <Text>{'Room ' + room}</Text>
        <Text>{user == currentUser ? 'You' : 'Opponent'}</Text>
        <Text>{wait ? 'wait' : ' '}</Text>
        <View style={{flex: 1, marginTop: 10}}>
          <ScrollView>
            <ScrollView horizontal>
              <TouchableWithoutFeedback style={css.container} onPress={this.fieldPress}>
                <Svg height={size * count + 20} width={size * count + 20} style={css.containerField}>
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
    backgroundColor: 'white'
  },
  containerField: {
    margin: 10
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