import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Menu from './drawerMenu';
import styles, { COLOR } from '../../styles/index';
import { ABOUT, AUTH_STACK, PROFILE, SETTING, SURVEY_LIST, IMAGES, TRAINING, REGIONAL_SURVEY, EVENT } from '../../utilities';

class Drawer extends React.PureComponent {
  state = {
    iconSize: 75,
  };

  getNewDimensions = (event) => {
    this.setState({
      iconSize: event.nativeEvent.layout.width / 100 * 3 + 70,
    });
  }

  render() {
    const { iconSize } = this.state;
    const { navigation, activeItemKey, t, loginUser } = this.props;
    const defaultMenuProps = { activeItemKey, navigation };
    return (
      <View style={{ flex: 1 }} onLayout={this.getNewDimensions}>
        <View style={[{ flex: 4 }, styles.shadow4, styles.ph16, styles.bgApp]}>
          <View style={[{ flex: 1.2 }, styles.jEnd]}>
            <View style={ styles.shadow2 }>
              <Image style={{height: iconSize, width: iconSize}} source={IMAGES.profile.profileAvatar}/>
            </View>
          </View>
          <View style={[{ flex: 1 }, styles.jCenter]}>
            <Text style={[styles.cWhite, styles.font18, styles.bold]}>{loginUser.userName}</Text>
            <Text style={[styles.cWhite, styles.font16]}>{loginUser.userGroupCode}</Text>
          </View>
        </View>
        <View style={componentStyle.menuContainer}>
          <Menu
            {...defaultMenuProps}
            icon={'history'}
            title={t(`translation:${SURVEY_LIST}`)}
            navigateTo={SURVEY_LIST}
          />
          <Menu
            {...defaultMenuProps}
            icon={'local-library'}
            title={t(`translation:${TRAINING}`)}
            navigateTo={TRAINING}
          />
          <Menu
            {...defaultMenuProps}
            icon={'rate-review'}
            title={t(`translation:${REGIONAL_SURVEY}`)}
            navigateTo={REGIONAL_SURVEY}
          />
          <Menu
            {...defaultMenuProps}
            icon={'speaker-notes'}
            title={t(`translation:${EVENT}`)}
            navigateTo={EVENT}
          />
          <Menu
            {...defaultMenuProps}
            icon={'account-circle'}
            title={t(`translation:${PROFILE}`)}
            navigateTo={PROFILE}
          />
          {/* <Menu
            {...defaultMenuProps}
            icon={'my-location'}
            title={t(`translation:${ABOUT}`)}
            navigateTo={ABOUT}
          />
          <Menu
            {...defaultMenuProps}
            icon={'settings'}
            title={t(`translation:${SETTING}`)}
            navigateTo={SETTING}
          /> */}
          <Menu
            {...defaultMenuProps}
            icon={'power'}
            title={t('translation:logout')}
            navigateTo={AUTH_STACK}
          />
        </View>
      </View>
    );
  }
}

const componentStyle = StyleSheet.create({
  menuContainer: {
    flex: 10,
    paddingTop: 8,
    justifyContent: 'flex-start',
    marginBottom: 50
  },
});


const mapStateToProps = state => {
  return { loginUser: state.survey.loginUser }
}

export default connect(mapStateToProps, undefined)(translate()(Drawer));