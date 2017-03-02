import * as React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Svg, {
  G,
  Rect,
  Line,
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
  num;
  status;
}
export default class Field extends React.Component<FieldP, FieldS> {
  layout;
  begin;

  constructor(props: FieldP) {
    super(props);
    const {serverInfo: {user, room}} = store.getState();
    this.state = {
      num: 0,
      room,
      user,
      currentUser: UserEnum.server,
      wait: false,
      status: 'process',
    };
    props.api.subscribe(this.update);
  }

  componentWillMount() {
  }

  fieldPress = ({nativeEvent}): void => {
    this.begin = Date.now();
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
    if (data.status == 'lose') {
      Alert.alert('You lose', 'Continue', [{text: 'okay :c'}]);
      return;
    } else if (data.status == 'win') {
      Alert.alert('You Win', 'Continue', [{text: 'yeah'}]);
      return;
    }
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


  componentDidUpdate() {
    console.log('rendered: ' + ((Date.now() - this.begin) / 1000) + 'ms\n');
  }

  render() {
    const {field} = this.props;
    const {user, currentUser, wait, room, num} = this.state;

    const table = [];
    range(0, count + 1).forEach(y => {
      table.push(
        <Line key={`t_y_${y}`}
              x1={0} y1={y * size - size / 2}
              x2={count * size - size / 2} y2={y * size - size / 2}
              stroke="grey" strokeWidth="1"/>);
    });
    range(0, count + 1).forEach(x => {
      table.push(
        <Line key={`t_x_${x}`}
              x1={x * size - size / 2} y1={0}
              x2={x * size - size / 2} y2={count * size - size / 2}
              stroke="grey" strokeWidth="1"/>);

    });
    const fields = [];
    range(0, count).map(y => {
      range(0, count).map(x => {
        const style: any[] = [css.field];
        const item = field.find(e => equal(e.position, x, y));
        let fill = 'white';
        if (item) {
          style.push(item.user == user ? css.fieldActiveYou : css.fieldActive);
          fill = item.user == user ? 'white' : 'black';
          fields.push(
            <Circle key={`s_${x};${y}`} cx={x * size + size / 2} cy={y * size + size / 2} r={size / 2}
                    fill={fill} stroke="grey" strokeWidth=".5"/>
          );
        }
      })
    });
    return (
      <View style={css.container}>
        <View style={css.info}>
          <Text>{'Room ' + room}</Text>
          <Text>{user == currentUser ? 'You' : 'Opponent'}</Text>
          <Text>{wait ? 'wait' : ' '}</Text>
          <Button title={"Toggle button" + num} onPress={() => this.setState({num: num + 1})}/>
        </View>
        <View style={{flex: 1}}>
          <ScrollView>
            <ScrollView horizontal>
              <TouchableWithoutFeedback style={css.container} onPress={this.fieldPress}>
                <Svg height={size * count + 20} width={size * count + 20} style={css.containerField}>
                  {table}
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
    backgroundColor: '#f0f0f0'
  },
  info: {
    padding: 10,
    marginBottom: 10,
    elevation: 5,
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