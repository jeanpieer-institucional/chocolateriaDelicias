import React, { createContext, useContext, useEffect, useState } from 'react';
import { addressService } from '../services/api';
import { useAuth } from './AuthContext';

interface Address {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    is_default: boolean;
    created_at: string;
}

interface AddressContextType {
    addresses: Address[];
    loading: boolean;
    selectedAddress: Address | null;
    loadAddresses: () => Promise<void>;
    createAddress: (addressData: Omit<Address, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
    updateAddress: (id: number, addressData: Partial<Address>) => Promise<void>;
    deleteAddress: (id: number) => Promise<void>;
    setDefaultAddress: (id: number) => Promise<void>;
    selectAddress: (address: Address | null) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const { user, token } = useAuth();

    useEffect(() => {
        if (user && token) {
            loadAddresses();
        } else {
            setAddresses([]);
            setSelectedAddress(null);
        }
    }, [user, token]);

    const loadAddresses = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await addressService.getAddresses(token);
            setAddresses(response.data);

            // Auto-select default address if exists
            const defaultAddress = response.data.find((addr: Address) => addr.is_default);
            if (defaultAddress && !selectedAddress) {
                setSelectedAddress(defaultAddress);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const createAddress = async (addressData: Omit<Address, 'id' | 'user_id' | 'created_at'>) => {
        if (!token) {
            throw new Error('No authentication token');
        }

        try {
            const response = await addressService.createAddress(addressData, token);
            await loadAddresses();

            // If this is the first address or marked as default, select it
            if (addressData.is_default || addresses.length === 0) {
                setSelectedAddress(response.data.address);
            }
        } catch (error: any) {
            console.error('Error creating address:', error);
            throw new Error(error.response?.data?.message || 'Error creating address');
        }
    };

    const updateAddress = async (id: number, addressData: Partial<Address>) => {
        if (!token) {
            throw new Error('No authentication token');
        }

        try {
            await addressService.updateAddress(id, addressData, token);
            await loadAddresses();

            // Update selected address if it was the one modified
            if (selectedAddress?.id === id) {
                const updated = addresses.find(addr => addr.id === id);
                if (updated) {
                    setSelectedAddress(updated);
                }
            }
        } catch (error: any) {
            console.error('Error updating address:', error);
            throw new Error(error.response?.data?.message || 'Error updating address');
        }
    };

    const deleteAddress = async (id: number) => {
        if (!token) {
            throw new Error('No authentication token');
        }

        try {
            await addressService.deleteAddress(id, token);
            await loadAddresses();

            // Clear selected address if it was deleted
            if (selectedAddress?.id === id) {
                const defaultAddr = addresses.find(addr => addr.is_default && addr.id !== id);
                setSelectedAddress(defaultAddr || null);
            }
        } catch (error: any) {
            console.error('Error deleting address:', error);
            throw new Error(error.response?.data?.message || 'Error deleting address');
        }
    };

    const setDefaultAddress = async (id: number) => {
        if (!token) {
            throw new Error('No authentication token');
        }

        try {
            await addressService.setDefaultAddress(id, token);
            await loadAddresses();

            // Update selected address to the new default
            const newDefault = addresses.find(addr => addr.id === id);
            if (newDefault) {
                setSelectedAddress(newDefault);
            }
        } catch (error: any) {
            console.error('Error setting default address:', error);
            throw new Error(error.response?.data?.message || 'Error setting default address');
        }
    };

    const selectAddress = (address: Address | null) => {
        setSelectedAddress(address);
    };

    return (
        <AddressContext.Provider
            value={{
                addresses,
                loading,
                selectedAddress,
                loadAddresses,
                createAddress,
                updateAddress,
                deleteAddress,
                setDefaultAddress,
                selectAddress,
            }}
        >
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error('useAddress must be used within an AddressProvider');
    }
    return context;
};
