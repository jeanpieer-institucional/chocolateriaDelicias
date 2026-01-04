import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../constants/DesignSystem';

interface DarkSearchBarProps extends TextInputProps {
    onSearch?: (text: string) => void;
}

export default function DarkSearchBar({ onSearch, ...props }: DarkSearchBarProps) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={Colors.text.secondary} style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Buscar trufas, barras, regalos..."
                placeholderTextColor={Colors.text.hint}
                onChangeText={onSearch}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    icon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        fontWeight: Typography.weights.regular,
    },
});
