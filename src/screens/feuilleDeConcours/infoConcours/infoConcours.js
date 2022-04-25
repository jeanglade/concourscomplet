import React from 'react';
import {styleSheet} from '_config';
import {View, Text} from 'react-native';
import i18n from 'i18next';
import {getBarRiseTextValue} from '../../../utils/convertor';

const InfoConcours = props => {
  return (
    <View style={[styleSheet.flexRowCenter, styleSheet.flexWrap]}>
      {props.concoursData?._?.type !== 'SB' && (
        <Text style={[styleSheet.text, {marginHorizontal: 5}]}>
          {props.concoursData?._?.nbTries} {i18n.t('competition:tries')}
        </Text>
      )}
      {props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet
        ?.NumTour != 7 && (
        <>
          <Text style={[styleSheet.text, {marginHorizontal: 5}]}>
            {i18n.t('competition:nb_athlete_qualif')} :{' '}
            {props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.NbQualifiePlace?.toString()}
          </Text>
          {!props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet
            ?.StandardQualificationPlace && (
            <Text style={[styleSheet.text, {marginHorizontal: 5}]}>
              {i18n.t('competition:perf_minima')} :{' '}
              {getBarRiseTextValue(
                props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.PerfMinima?.toString(),
              )}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default InfoConcours;
