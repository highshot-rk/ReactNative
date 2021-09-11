import React from 'react';
import { Text, View, Button } from 'react-native';
import PropTypes from 'prop-types';

import styles from '../../common/CommonStyles';

const propTypes = {
  functionModal: PropTypes.func,
};

class ChildModalScreen extends React.Component {

  _onPress = () => {
    return this.props.functionModal();
  }
  render() {
    return (
      <View style={styles.container, { backgroundColor: "#fff", alignItems: 'center' }}>
        <Text>Modal Content</Text>
        <Button
          title="Close modal"
          // イベントをpropsでもらう
          // onPress={this.props.nav._toggleModal}
          onPress={() => this._onPress()}
        />
      </View>
    );
  }
}

ChildModalScreen.propTypes = propTypes;
export default ChildModalScreen;