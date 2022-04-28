import {colors} from '_config';
import i18n from 'i18next';

export const getHauteurToTextValue = value => {
  var res = value;
  if (res !== undefined && res !== null) {
    if (parseInt(value) || value === '0') {
      if (value.toString().length === 1) {
        value = '00' + value.toString();
      }
      if (value.toString().length === 2) {
        value = '0' + value.toString();
      }
      res = value.toString().slice(0, -2) + 'm' + value.toString().slice(-2);
    }
  }
  return res;
};

export const getStatusColor = statut => {
  var res = colors.black;
  switch (statut) {
    case i18n.t('common:ready'):
      res = colors.black;
      break;
    case i18n.t('common:in_progress'):
      res = colors.red;
      break;
    case i18n.t('common:finished'):
      res = colors.orange;
      break;
    case i18n.t('common:send_to_elogica'):
      res = colors.green;
      break;
  }
  return res;
};

export const getStatus = concoursData => {
  var res = i18n.t('common:ready');
  //Vérifier s'il y a une date de fin => terminé
  //Vérifier s'il y a des résultats => en cours
  return res;
};
