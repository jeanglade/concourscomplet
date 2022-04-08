import * as Yup from 'yup';
import i18n from 'i18next';
import moment from 'moment';

export const ValidatorsAddAthlete = Yup.object().shape({
  firstname: Yup.string().required(i18n.t('toast:required_field')),
  name: Yup.string().required(i18n.t('toast:required_field')),
  sex: Yup.string().notOneOf(
    [i18n.t('competition:sex') + '*', ''],
    i18n.t('toast:required_field'),
  ),
  birthDate: Yup.string().test(
    'birthDate',
    i18n.t('toast:required_field'),
    value => {
      return (
        moment().format('DD/MM/YYYY') !==
        moment(Date.parse(value)).format('DD/MM/YYYY')
      );
    },
  ),
});
