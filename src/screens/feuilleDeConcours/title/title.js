import React from 'react';
import {colors, styleSheet} from '_config';
import {View, Image, Text} from 'react-native';
import {MyButton} from '_components';
import i18n from 'i18next';
import epreuves from '../../../icons/epreuves/epreuves';

const Title = props => (
  <View style={{backgroundColor: colors.ffa_blue_light}}>
    <View
      style={[
        styleSheet.flexRow,
        styleSheet.flexWrap,
        {marginStart: 10, alignItems: 'center'},
      ]}>
      <MyButton
        onPress={props.navigation.goBack}
        styleView={[{marginHorizontal: 5}]}
        content={
          <Image
            style={styleSheet.icon20}
            source={require('../icons/back.png')}
          />
        }
      />
      <Image
        style={[styleSheet.icon30, {marginHorizontal: 5}]}
        source={epreuves[props.concoursData._?.imageEpreuve.slice(0, -5)]}
      />
      <Text
        style={[styleSheet.textTitle, styleSheet.textWhite, {marginEnd: 10}]}>
        {props.concoursData._?.epreuve} - {props.concoursData._?.dateInfo} -{' '}
        {props.concoursData._?.nbAthlete}{' '}
        {i18n.t('competition:athletes').toLocaleLowerCase()}
      </Text>
      <View
        style={{
          borderRadius: 15,
          padding: 3,
          paddingHorizontal: 10,
          backgroundColor: props.concoursData._?.statutColor,
        }}>
        <Text
          style={[
            styleSheet.text,
            styleSheet.textCenter,
            styleSheet.textWhite,
          ]}>
          {props.concoursData._?.statut}
        </Text>
      </View>
    </View>
  </View>
);

export default Title;
