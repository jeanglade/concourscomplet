import {colors} from '_config';
import i18n from 'i18next';

export const getBarRiseTextValue = value => {
  var res = value;
  if (res !== undefined) {
    if (value.toString().length === 2) {
      res = '0' + value.toString();
    }
    res = value.toString()[0] + 'm' + value.toString().slice(1);
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
