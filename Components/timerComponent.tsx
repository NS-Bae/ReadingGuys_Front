import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

interface TimerProps
{
  timeSet: number;
  start: boolean;
  onEnd: () => void;
  resetTrigger: number;
}

const Timer: React.FC<TimerProps> = ({ timeSet, start, onEnd, resetTrigger }) => {
  const [timeLeft, setTimeLeft] = useState(timeSet);

  useEffect(() => {
    setTimeLeft(timeSet);
  }, [resetTrigger, timeSet]);
  useEffect(() => {
    if(!start) { return; }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if(prev > 1) { return prev - 1; }
        clearInterval(interval);
        onEnd();
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [start, onEnd]);

  return (
    <View style={exclusiveStyles.timerZone}>
      <Text style={exclusiveStyles.timer}>{timeLeft}</Text>
    </View>
  );
};

export default Timer;

const exclusiveStyles = StyleSheet.create({
  timerZone: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'center',
    margin: 0,
    marginHorizontal: 10,
    padding: 0,
  },
  timer: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: moderateScale(20),
    color: 'green',
  },
});
