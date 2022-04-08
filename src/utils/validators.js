import * as Yup from 'yup';
import i18n from 'i18next';
import moment from 'moment';

export const ValidatorsAddAthlete = Yup.object().shape({
  firstname: Yup.string().required('Ce champ est obligatoire.'),
  name: Yup.string().required('Ce champ est obligatoire.'),
  sex: Yup.string().notOneOf(
    [i18n.t('competition:sex') + '*', ''],
    'Ce champ est obligatoire.',
  ),
  birthDate: Yup.string().test(
    'birthDate',
    'Ce champ est obligatoire.',
    value => {
      return (
        moment().format('DD/MM/YYYY') !==
        moment(Date.parse(value)).format('DD/MM/YYYY')
      );
    },
  ),
});
