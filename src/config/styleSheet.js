import colors from './colors';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  //TEXT
  textTitle: {
    fontSize: 16,
    color: colors.ffa_blue_light,
    marginVertical: 15,
  },
  text: {
    fontSize: 14,
    color: colors.black,
  },
  textError: {
    fontSize: 13,
    color: colors.red,
    marginBottom: 10,
    marginStart: 5,
  },
  textWhite: {
    color: colors.white,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  //FLEX
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  //BACKGROUND
  backWhite: {
    backgroundColor: colors.white,
  },
  backMuted: {
    backgroundColor: colors.muted,
  },
  backRed: {
    backgroundColor: colors.red,
  },
  //ICON
  icon10: {
    width: 10,
    height: 10,
  },
  icon15: {
    width: 15,
    height: 15,
  },
  icon20: {
    width: 20,
    height: 20,
  },
  icon30: {
    width: 30,
    height: 30,
  },
  icon40: {
    width: 40,
    height: 40,
  },
  icon: {
    backgroundColor: colors.ffa_blue_light,
    padding: 10,
    margin: 5,
    borderRadius: 3,
  },
  //BUTTON
  button: {
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 3,
  },
  mp5: {
    margin: 5,
    padding: 5,
  },
  buttonDelete: {
    padding: 5,
    margin: 0,
    borderRadius: 3,
  },
});
