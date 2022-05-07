import React from 'react';
import { StackActions, NavigationActions, createStackNavigator } from 'react-navigation';
import i18next from 'i18next';
import { BackIcon, MenuIcon, SubmitButton } from '../components/header';
import styles, { COLOR } from '../styles';

export function getStackResetAction(routeNames, index = 0) {
  const actionJson = { index };
  if (Array.isArray(routeNames)) {
    actionJson.actions = routeNames.map(route => NavigationActions.navigate({ routeName: route }));
  } else {
    actionJson.actions = [NavigationActions.navigate({ routeName: routeNames })];
  }
  return StackActions.reset(actionJson);
}

export const NavOptions = (title) => ({ navigation }) => {
  return {
    title: i18next.t(`translation:${title}`),
    headerStyle: styles.bgApp,
    headerBackTitleStyle: COLOR.WHITE,
    headerTintColor: COLOR.WHITE,
    headerTitleStyle: styles.cWhite 
  };
};

export const customNavOptions = (title, isMenuIcon, rightButton, rightButtonAction) => ({ navigation, screenProps }) => {
  // Handle Form Title
  let info = navigation.getParam('handleSave') ? (navigation.getParam('key') ? "Edit " : "New ") : "";
  return {
    title: info + i18next.t(`translation:${title}`),
    headerLeft: isMenuIcon ? <MenuIcon navigation={navigation} /> : <BackIcon navigation={navigation} />,
    headerRight: rightButton ? <SubmitButton navigation={navigation} text={rightButton} action={rightButtonAction} /> : null,
    headerStyle: styles.bgApp,
    headerBackTitleStyle: COLOR.WHITE,
    headerTintColor: COLOR.WHITE,
    headerTitleStyle: styles.cWhite
  };
};

export const containerStackNavigator = (screen, title = '', isMenuIcon = true, rightButton, rightButtonAction) => {
  if(Array.isArray(screen)) {
    let stackRoutes = {};
    screen.map( (sc, index) => {
      stackRoutes[title[index]] = {
        screen: sc, 
        navigationOptions: customNavOptions(
          Array.isArray(title) ? title[index] : title, 
          isMenuIcon[index], // index === 0 ? true : false
          rightButton[index],
          rightButtonAction[index]
        )
      }
    })
    return createStackNavigator(stackRoutes, { initialRouteName: title[0] });
  }
  return createStackNavigator({ title: { screen, navigationOptions: customNavOptions(title, isMenuIcon) } });
};
