import base64 from 'react-native-base64';
import {Keyboard} from 'react-native';
import {getFile} from '../../utils/myAsyncStorage';

export const validateCompetitionCode = async (
  codeCompetition,
  t,
  showMessage,
) => {
  const soapRequest = require('easy-soap-request');
  var res = null;
  var XMLParser = require('react-xml-parser');
  if (codeCompetition !== null && codeCompetition !== '') {
    const {response} = await soapRequest({
      url: 'http://webservices.e-logica.fr/WS_ELOG_COMP_DEV/ServiceElogicaDEV.svc',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        soapAction:
          'http://tempuri.org/IServiceElogicaDEV/GetFileConcoursComplet',
      },
      xml:
        '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">\
            <Body>\
                <GetFileConcoursComplet xmlns="http://tempuri.org/">\
                    <codeFileName>' +
        codeCompetition +
        '</codeFileName>\
                </GetFileConcoursComplet>\
            </Body>\
        </Envelope>',
    }).catch(e => {
      console.error(e);
      showMessage({
        message: t('toast:wrong_code'),
        type: 'danger',
      });
      Keyboard.dismiss();
    });

    const {body, statusCode} = response;
    if (statusCode === 200) {
      const xmlResponse = new XMLParser().parseFromString(body);
      res = base64.decode(
        xmlResponse.getElementsByTagName('GetFileConcoursCompletResult')[0]
          .value,
      );
    } else {
      showMessage({
        message: t('toast:import_error'),
        type: 'danger',
      });
      Keyboard.dismiss();
    }
  } else {
    console.error(t('toast:competition_sheet_empty'));
    showMessage({
      message: t('toast:competition_sheet_empty'),
      type: 'danger',
    });
    Keyboard.dismiss();
  }
  return res;
};

export const sendJson = async fileName => {
  const soapRequest = require('easy-soap-request');
  var result = null;
  const contentFile = await getFile(fileName);
  if (contentFile != null) {
    (async () => {
      const {response} = await soapRequest({
        url: 'http://webservices.e-logica.fr/WS_ELOG_COMP_DEV/ServiceElogicaDEV.svc',
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          soapAction:
            'http://tempuri.org/IServiceElogicaDEV/PushFileConcoursCompletFromTablette',
        },
        xml:
          '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">\
              <Body>\
             <PushFileConcoursCompletFromTablette xmlns="http://tempuri.org/">\
             <json>{"fileName":"' +
          fileName +
          '","fileStream":"' +
          base64.encode(contentFile) +
          '"}</json>\
             </PushFileConcoursCompletFromTablette>\
               </Body>\
      </Envelope>',
      }).catch(e => console.error(e));
      const {statusCode} = response;
      if (statusCode === 200) {
        result = true;
      }
    })();
  }
  return result;
};
