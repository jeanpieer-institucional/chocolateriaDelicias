import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { BorderRadius, Shadows } from '../constants/DesignSystem';

interface AnimatedCardProps extends TouchableOpacityProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    delay?: number;
    enablePressAnimation?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function AnimatedCard({
    children,
    style,
    onPress,
    delay = 0,
    enablePressAnimation = true,
    ...props
}: AnimatedCardProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);

    // Animación de entrada
    React.useEffect(() => {
        opacity.value = withTiming(1, { duration: 500 });
    }, []);

    // Animación de presión
    const handlePressIn = () => {
        if (enablePressAnimation) {
            scale.value = withSpring(0.95, {
                damping: 15,
                stiffness: 150,
            });
        }
    };

    const handlePressOut = () => {
        if (enablePressAnimation) {
            scale.value = withSpring(1, {
                damping: 15,
                stiffness: 150,
            });
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <AnimatedTouchable
            style={[styles.card, style, animatedStyle]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
            {...props}
        >
            {children}
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: BorderRadius.lg,
        ...Shadows.medium,
    },
});
