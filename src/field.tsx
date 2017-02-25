import * as React from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
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
  session;
}
interface FieldS {
  field: FieldItem[];
}
export default class Field extends React.Component<FieldP, FieldS> {
  constructor(props) {
    super(props);
    this.state = {
      field: []
    };
  }

  componentWillMount() {
    API.getSteps(this.props.session)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (!(json && json.steps)) return;
        actions.fillField(json.steps.map(e => {
          const res = /(\d+);(\d+)/.exec(e.position);
          if (!res) return {};
          return {
            position: {
              x: +res[1],
              y: +res[2],
            },
            user: e.user,
          };
        }));
      })
      .catch(e => console.error(e));
  }

  fieldPress = ({nativeEvent: {pageX, pageY}}): void => {
    const touch = {
      x: Math.floor(pageX / size),
      y: Math.floor(pageY / size),
    };
    actions.add({
      position: touch,
      user: UserEnum.client
    });
    API.postStep(this.props.session, 1, `${touch.x};${touch.y}`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch(e => {
        console.error(e);
      })
  };

  render() {
    const {field} = this.state;
    const fields = range(0, count).map(y => {
      return (
        <View key={y} style={css.row}>
          {range(0, count).map(x => {
            const style: any[] = [css.field];
            const item = field.find(e => equal(e.position, x, y));
            if (item) {
              style.push(item.user == UserEnum.you ? css.fieldActiveYou : css.fieldActive);
            }
            return <View key={x} style={style}/>;
          })}
        </View>
      );
    });
    return (
      <TouchableWithoutFeedback style={css.container} onPress={this.fieldPress}>
        <View>
          {fields}
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