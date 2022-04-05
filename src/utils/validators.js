import * as Yup from 'yup';

const Validators = Yup.object().shape({
  required: Yup.string().required('Ce champ est obligatoire.'),

  newpassword: Yup.string()
    .min(4, 'Votre mot de passe est trop court !')
    .required('Le nouveau mot de passe est obligatoire.')
    .when('actualpassword', {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().notOneOf(
        [Yup.ref('actualpassword')],
        "Vous ne pouvez pas mettre l'ancien mot de passe",
      ),
    }),

  newconfirmedpassword: Yup.string()
    .min(4, 'Votre mot de passe est trop court !')
    .required('Le nouveau mot de passe est obligatoire.')
    .when('newpassword', {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref('newpassword')],
        'Les deux mots de passe doivent être identiques',
      ),
    }),
});

export default Validators;
