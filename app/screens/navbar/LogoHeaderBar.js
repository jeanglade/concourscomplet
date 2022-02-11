import React from 'react';

import {View, Image} from 'react-native';

import R from '../../assets/R';

const LogoHeaderBar = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Image
        source={R.images.logo_ffa}
        style={{
          width: 40,
          height: 40,
          marginLeft: 10,
        }}
      />
    </View>
  );
};

export default LogoHeaderBar;
