import React, { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../constants/DesignSystem';

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

    // HTML para Culqi Checkout con tema oscuro/verde
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
            padding: 24px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${Colors.dark.background};
            color: ${Colors.text.primary};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            width: 100%;
            max-width: 400px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h2 {
            color: ${Colors.primary.main};
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            color: ${Colors.text.secondary};
            margin: 0;
            font-size: 16px;
        }
        .info {
            background-color: ${Colors.dark.card};
            padding: 24px;
            border-radius: 20px;
            margin-bottom: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            text-align: center;
            border: 1px solid ${Colors.border.default};
        }
        .info p {
            margin: 0 0 10px 0;
            color: ${Colors.text.secondary};
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .amount {
            font-size: 42px;
            font-weight: 800;
            color: ${Colors.text.primary};
            margin: 0;
        }
        .currency {
            font-size: 24px;
            color: ${Colors.primary.main};
            margin-right: 4px;
        }
        #pay-button {
            width: 100%;
            padding: 18px;
            background-color: ${Colors.primary.main};
            color: ${Colors.dark.background};
            border: none;
            border-radius: 16px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        #pay-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 255, 136, 0.4);
        }
        #pay-button:active {
            transform: translateY(0);
        }
        #pay-button:disabled {
            background-color: ${Colors.status.info};
            cursor: not-allowed;
            opacity: 0.5;
        }
        .loading {
            text-align: center;
            padding: 20px;
            color: ${Colors.text.secondary};
            font-size: 14px;
        }
        .secure-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 24px;
            color: ${Colors.text.disabled};
            font-size: 12px;
        }
        .secure-badge span {
            margin-left: 6px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Choco Delicia</h2>
            <p>Pago seguro con Culqi</p>
        </div>
        
        <div class="info">
            <p>Total a pagar</p>
            <div class="amount"><span class="currency">S/</span>${amount.toFixed(2)}</div>
        </div>

        <button id="pay-button">Pagar con Tarjeta</button>
        
        <div class="secure-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2ZM12 11.99V19C9.28 17.96 7.26 14.88 7 11.99H17C16.89 12.01 16.78 12.03 16.66 12.04L12 11.99Z" fill="currentColor"/>
            </svg>
            <span>Transacción encriptada y segura</span>
        </div>

        <div id="loading" class="loading" style="display: none;">
            Procesando...
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
                maincolor: '${Colors.primary.main}',
                buttontext: '${Colors.dark.background}',
                maintext: '${Colors.text.primary}',
                desctext: '${Colors.text.secondary}'
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
                        <ActivityIndicator size="large" color={Colors.primary.main} />
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
        backgroundColor: Colors.dark.background,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark.background,
        zIndex: 1000,
    },
    webview: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
});
