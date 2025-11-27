import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Bottom Sheet Hook
export const useBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [snapPoint, setSnapPoint] = useState(0);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return { isOpen, open, close, toggle, snapPoint, setSnapPoint };
};

// Bottom Sheet Component
export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  snapPoints = [0.25, 0.5, 0.9],
  initialSnap = 1,
  enableBackdrop = true,
  enableHandle = true,
  backdropOpacity = 0.5,
  onSnapChange,
  style,
  backdropStyle,
  handleStyle,
  contentStyle,
}) => {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const lastSnap = useRef(snapPoints[initialSnap]);

  const getSnapHeight = useCallback((snapIndex) => {
    return SCREEN_HEIGHT * (1 - snapPoints[snapIndex]);
  }, [snapPoints]);

  const animateToSnap = useCallback((snapIndex, onComplete) => {
    const snapHeight = getSnapHeight(snapIndex);
    lastSnap.current = snapHeight;
    
    Animated.spring(translateY, {
      toValue: SCREEN_HEIGHT - snapHeight,
      useNativeDriver: true,
      damping: 50,
      stiffness: 300,
    }).start(onComplete);
  }, [translateY, getSnapHeight]);

  useEffect(() => {
    if (isOpen) {
      animateToSnap(currentSnap);
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        translateY.setOffset(lastSnap.current);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        
        const currentHeight = SCREEN_HEIGHT - (SCREEN_HEIGHT - lastSnap.current + gestureState.dy);
        const velocity = gestureState.vy;
        
        // Calculate which snap point to go to
        let targetSnap = currentSnap;
        
        if (velocity > 0.5 || gestureState.dy > SCREEN_HEIGHT * 0.2) {
          // Swipe down
          if (currentSnap === snapPoints.length - 1) {
            onClose?.();
            return;
          }
          targetSnap = Math.min(currentSnap + 1, snapPoints.length - 1);
        } else if (velocity < -0.5 || gestureState.dy < -SCREEN_HEIGHT * 0.1) {
          // Swipe up
          targetSnap = Math.max(currentSnap - 1, 0);
        } else {
          // Find nearest snap point
          let minDiff = Infinity;
          snapPoints.forEach((snap, index) => {
            const snapHeight = getSnapHeight(index);
            const diff = Math.abs(currentHeight - snapHeight);
            if (diff < minDiff) {
              minDiff = diff;
              targetSnap = index;
            }
          });
        }
        
        if (targetSnap !== currentSnap) {
          setCurrentSnap(targetSnap);
          onSnapChange?.(targetSnap);
        }
        
        animateToSnap(targetSnap);
      },
    })
  ).current;

  if (!isOpen) return null;

  const backdropAnimatedOpacity = translateY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [backdropOpacity, 0],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {enableBackdrop && (
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View
              style={[
                styles.backdrop,
                backdropStyle,
                { opacity: backdropAnimatedOpacity },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        <Animated.View
          style={[
            styles.sheet,
            style,
            {
              height: getSnapHeight(currentSnap),
              transform: [{ translateY }],
            },
          ]}
        >
          {enableHandle && (
            <View
              style={styles.handleContainer}
              {...panResponder.panHandlers}
            >
              <View style={[styles.handle, handleStyle]} />
            </View>
          )}

          <View style={[styles.content, contentStyle]}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240, 55, 55, 1)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  handleContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});

// Export default for convenience
export default BottomSheet;