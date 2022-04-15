import React, {useState, useRef} from 'react';
import {View, Pressable, Text, Platform} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Flyout} from 'react-native-windows';
import {styleSheet} from '_config';

const MyButton = props => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const myRef = useRef();

  return (
    <Pressable
      onPressIn={() => {
        if (props.tooltip !== undefined && Platform.OS !== 'windows') {
          setTooltipVisible(true);
        }
      }}
      onPressOut={() => {
        if (props.tooltip !== undefined && Platform.OS !== 'windows') {
          setTooltipVisible(false);
        }
      }}
      onPress={() => {
        setTooltipVisible(false);
        props.onPress();
      }}>
      <View
        style={props.styleView}
        onMouseEnter={() => {
          if (props.tooltip !== undefined && Platform.OS === 'windows') {
            setTooltipVisible(true);
            setTimeout(() => {
              setTooltipVisible(false);
            }, 1500);
          }
        }}
        onPress={() => {
          setTooltipVisible(false);
          props.onPress();
        }}>
        {Platform.OS !== 'windows' && (
          <Tooltip
            isVisible={tooltipVisible}
            placement="bottom"
            content={<Text style={{fontSize: 13}}>{props.tooltip}</Text>}>
            <>{props.content}</>
          </Tooltip>
        )}
        {Platform.OS === 'windows' && (
          <>
            <View ref={myRef}>{props.content}</View>
            <Flyout
              isOpen={tooltipVisible}
              target={myRef.current}
              placement="bottom">
              <View style={[styleSheet.backWhite, {padding: 5}]}>
                <Text
                  style={[
                    styleSheet.text,
                    styleSheet.textCenter,
                    {
                      minWidth: 150,
                      fontSize: 13,
                    },
                  ]}>
                  {props.tooltip}
                </Text>
              </View>
            </Flyout>
          </>
        )}
      </View>
    </Pressable>
  );
};

export default MyButton;
