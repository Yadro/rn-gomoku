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

const count = 20;
const size = 35;
const sizeHalf = size / 2;

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
    const table = range(0, count + 1).map(y =>
      range(0, count + 1).map(x => {
        return (
          <View key={`t_${x};${y}`}
                style={[css.field, {position: 'absolute', top: x * size - sizeHalf, left: y * size - sizeHalf}]}/>
        );
      })
    );
    const fields = [];
    range(0, count).forEach(y => {
      return range(0, count).forEach(x => {
        const style: any[] = [css.field];
        const item = field.find(e => equal(e.position, x, y));
        let fill = {backgroundColor: 'white'};
        if (item) {
          fill = {backgroundColor: item.user == user ? 'white' : 'black'};
          fields.push(
            <View key={`s_${x};${y}`}
                  style={[css.fieldCircle, fill, {position: 'absolute', top: x * size, left: y * size}]}/>
          );
        }
      });
    });
    return (
      <View style={css.container}>
        <View style={css.info}>
          <Text>{'Room ' + room}</Text>
          <Text>{user == currentUser ? 'You' : 'Opponent'}</Text>
          <Text>{wait ? 'wait' : ' '}</Text>
          <Button title={"Toggle button" + num} onPress={() => this.setState({num: num + 1})}/>
        </View>
        <ScrollView>
          <ScrollView horizontal>
            <View style={{width: size * count + 20, height: size * count + 20}}>
              <TouchableWithoutFeedback style={{width: size * count + 20, height: size * count + 20}} onPress={this.fieldPress}>
                <View style={{width: size * count + 20, height: size * count + 20}}>
                  {table}
                  {fields}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ScrollView>
        </ScrollView>
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
    borderColor: 'grey',
    width: size,
    height: size,
  },
  fieldCircle: {
    borderWidth: .5,
    borderColor: 'grey',
    borderRadius: sizeHalf,
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