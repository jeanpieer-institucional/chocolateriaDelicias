import React, { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface CulqiPaymentProps {
    visible: boolean;
    amount: number; // Monto en soles
    email: string;
    onSuccess: (token: string) => void;
    onError: (error: string) => void;
    onClose: () => void;
}

const CULQI_PUBLIC_KEY = 'pk_test_gNTifPiXYBIwk0kW';

export default function CulqiPayment({
    visible,
    amount,
    email,
    onSuccess,
    onError,
    onClose
}: CulqiPaymentProps) {
    const [loading, setLoading] = useState(true);

    // Convertir monto a centavos
    const amountInCents = Math.round(amount * 100);

    // HTML para Culqi Checkout
    const culqiHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Culqi Checkout</title>
    <script src="https://checkout.culqi.com/js/v4"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #FFF8F0;
        }
        .container {
            max-width: 400px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h2 {
            color: #5D4037;
            margin: 0 0 10px 0;
        }
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #8B4513;
            margin: 10px 0;
        }
        #pay-button {
            width: 100%;
            padding: 16px;
            background-color: #8B4513;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
        }
        #pay-button:hover {
            background-color: #6D3410;
        }
        #pay-button:disabled {
            background-color: #D7CCC8;
            cursor: not-allowed;
        }
        .info {
            background-color: #FFF;
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .info p {
            margin: 5px 0;
            color: #5D4037;
        }
        .loading {
            text-align: center;
            padding: 20px;
            color: #8D6E63;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🍫 Choco Delicia</h2>
            <p style="color: #8D6E63;">Pago Seguro con Culqi</p>
        </div>
        
        <div class="info">
            <p><strong>Total a pagar:</strong></p>
            <div class="amount">S/ ${amount.toFixed(2)}</div>
        </div>

        <button id="pay-button">Pagar con Tarjeta</button>
        
        <div id="loading" class="loading" style="display: none;">
            Procesando pago...
        </div>
    </div>

    <script>
        Culqi.publicKey = '${CULQI_PUBLIC_KEY}';
        
        Culqi.settings({
            title: 'Choco Delicia',
            currency: 'PEN',
            amount: ${amountInCents}
        });

        Culqi.options({
            style: {
                logo: 'https://via.placeholder.com/150x50?text=Choco+Delicia',
                maincolor: '#8B4513',
                buttontext: '#ffffff',
                maintext: '#5D4037',
                desctext: '#8D6E63'
            }
        });

        // Manejar respuesta de Culqi
        function culqi() {
            if (Culqi.token) {
                const token = Culqi.token.id;
                // Enviar token a React Native
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'success',
                    token: token
                }));
            } else if (Culqi.error) {
                // Enviar error a React Native
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    message: Culqi.error.user_message || 'Error al procesar el pago'
                }));
            }
        }

        // Botón de pago
        document.getElementById('pay-button').addEventListener('click', function() {
            Culqi.open();
        });

        // Notificar que la página está lista
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'ready'
        }));
    </script>
</body>
</html>
    `;

    const handleMessage = (event: any) => {
        try {
            console.log('Culqi WebView message:', event.nativeEvent.data);
            const data = JSON.parse(event.nativeEvent.data);

            switch (data.type) {
                case 'ready':
                    console.log('Culqi checkout ready');
                    setLoading(false);
                    break;

                case 'success':
                    console.log('Culqi token received:', data.token);
                    onSuccess(data.token);
                    break;

                case 'error':
                    console.error('Culqi error:', data.message);
                    onError(data.message || 'Error desconocido al procesar el pago');
                    break;

                default:
                    console.warn('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error, event.nativeEvent.data);
            onError('Error al procesar el pago. Por favor, intenta nuevamente.');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#8B4513" />
                    </View>
                )}
                <WebView
                    source={{ html: culqiHTML }}
                    onMessage={handleMessage}
                    onLoadEnd={() => setLoading(false)}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF8F0',
        zIndex: 1000,
    },
    webview: {
        flex: 1,
    },
});
