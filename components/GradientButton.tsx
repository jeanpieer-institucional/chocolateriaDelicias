import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BorderRadius, Dimensions, Shadows, Typography } from '../constants/DesignSystem';

interface GradientButtonProps extends TouchableOpacityProps {
    title: string;
    onPress: () => void;
    colors?: string[];
    loading?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    variant?: 'primary' | 'secondary' | 'outline';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function GradientButton({
    title,
    onPress,
    colors = ['#D4AF37', '#B8941F'],
    loading = false,
    icon,
    iconPosition = 'left',
    variant = 'primary',
    disabled,
    style,
    ...props
}: GradientButtonProps) {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.95, {
            damping: 15,
            stiffness: 150,
        });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, {
            damping: 15,
            stiffness: 150,
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const renderContent = () => (
        <View style={styles.content}>
            {loading ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <Ionicons name={icon} size={20} color="#FFF" style={styles.iconLeft} />
                    )}
                    <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>
                        {title}
                    </Text>
                    {icon && iconPosition === 'right' && (
                        <Ionicons name={icon} size={20} color="#FFF" style={styles.iconRight} />
                    )}
                </>
            )}
        </View>
    );

    if (variant === 'outline') {
        return (
            <AnimatedTouchable
                style={[styles.button, styles.outlineButton, style, animatedStyle]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                activeOpacity={0.8}
                {...props}
            >
                {renderContent()}
            </AnimatedTouchable>
        );
    }

    return (
        <AnimatedTouchable
            style={[styles.button, style, animatedStyle]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {renderContent()}
            </LinearGradient>
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    button: {
        height: Dimensions.buttonHeight.large,
        borderRadius: BorderRadius.xxxl,
        overflow: 'hidden',
        ...Shadows.medium,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFF',
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textOutline: {
        color: '#D4AF37',
    },
});
