import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../constants/DesignSystem';

interface CategoryChipProps extends TouchableOpacityProps {
    label: string;
    selected?: boolean;
    onPress: () => void;
}

export default function CategoryChip({ label, selected = false, onPress, ...props }: CategoryChipProps) {
    return (
        <TouchableOpacity
            style={[
                styles.chip,
                selected ? styles.chipSelected : styles.chipUnselected,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            {...props}
        >
            <Text style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.xl,
        marginRight: Spacing.md,
    },
    chipSelected: {
        backgroundColor: Colors.primary.main,
    },
    chipUnselected: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    chipText: {
        fontSize: Typography.sizes.bodySmall,
        fontWeight: Typography.weights.semibold,
    },
    chipTextSelected: {
        color: Colors.dark.background,
    },
    chipTextUnselected: {
        color: Colors.text.primary,
    },
});
