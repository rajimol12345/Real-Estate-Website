import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/api';
import { CurrencyContext } from '../../context/CurrencyContext';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, property, onPaymentSuccess }) => {
    const { currency, formatPrice } = React.useContext(CurrencyContext);
    const [step, setStep] = useState(1); // 1: Select Method, 2: Processing, 3: Success
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setError('');
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePayNow = async () => {
        setLoading(true);
        setError('');
        setStep(2);

        try {
            // 1. Create Order
            const { data: orderData } = await paymentService.createOrder({
                propertyId: property.id || property._id,
                amount: property.price,
                currency: currency.code
            });

            if (orderData.success) {
                // Simulate a slight delay for "processing" feel
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 2. Verify Payment (Mock)
                const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 11)}`;
                const { data: verifyData } = await paymentService.verifyPayment({
                    orderId: orderData.orderId,
                    paymentId: mockPaymentId
                });

                if (verifyData.success) {
                    setTransactionId(mockPaymentId);
                    setStep(3);
                    if (onPaymentSuccess) {
                        onPaymentSuccess(property.id || property._id);
                    }
                } else {
                    throw new Error('Verification failed');
                }
            } else {
                throw new Error(orderData.message || 'Order creation failed');
            }
        } catch (err) {
            console.error('Payment Error:', err);
            setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-overlay" onClick={onClose}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                <button className="payment-close" onClick={onClose} disabled={step === 2}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {step === 1 && (
                    <div className="payment-step-content fade-in">
                        <div className="payment-header">
                            <h3>Complete Your Booking</h3>
                            <p>Reserve <strong>{property.title}</strong></p>
                        </div>

                        <div className="property-summary-mini">
                            <span className="summary-label">Amount to Pay:</span>
                            <span className="summary-price">{formatPrice(property.price)}</span>
                        </div>

                        {error && <div className="payment-error">{error}</div>}

                        <div className="payment-methods">
                            <h4>Select Payment Method</h4>
                            <div className="methods-grid">
                                <div
                                    className={`method-item ${selectedMethod === 'card' ? 'active' : ''}`}
                                    onClick={() => setSelectedMethod('card')}
                                >
                                    <i className="fa-solid fa-credit-card"></i>
                                    <span>Card</span>
                                </div>
                                <div
                                    className={`method-item ${selectedMethod === 'upi' ? 'active' : ''}`}
                                    onClick={() => setSelectedMethod('upi')}
                                >
                                    <i className="fa-solid fa-mobile-screen-button"></i>
                                    <span>UPI</span>
                                </div>
                                <div
                                    className={`method-item ${selectedMethod === 'netbanking' ? 'active' : ''}`}
                                    onClick={() => setSelectedMethod('netbanking')}
                                >
                                    <i className="fa-solid fa-building-columns"></i>
                                    <span>Net Banking</span>
                                </div>
                            </div>
                        </div>

                        {selectedMethod === 'card' && (
                            <div className="method-details-sim">
                                <div className="sim-input-group">
                                    <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" readOnly />
                                </div>
                                <div className="sim-row">
                                    <input type="text" placeholder="MM/YY" defaultValue="12/26" readOnly />
                                    <input type="text" placeholder="CVC" defaultValue="123" readOnly />
                                </div>
                            </div>
                        )}

                        {selectedMethod === 'upi' && (
                            <div className="method-details-sim">
                                <input type="text" placeholder="user@upi" defaultValue="estatepro@upi" readOnly />
                            </div>
                        )}

                        <button className="btn-pay-execute" onClick={handlePayNow}>
                            PAY NOW
                        </button>

                        <p className="payment-disclaimer">
                            <i className="fa-solid fa-shield-halved"></i> Secure encrypted transaction
                        </p>
                    </div>
                )}

                {step === 2 && (
                    <div className="payment-step-content text-center py-5 fade-in">
                        <div className="payment-processing">
                            <div className="payment-spinner"></div>
                            <h3>Processing Payment</h3>
                            <p>Please do not refresh the page or close the window.</p>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="payment-step-content text-center py-4 fade-in">
                        <div className="payment-success-icon">
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <h3>Booking Successful!</h3>
                        <p>Your payment for <strong>{property.title}</strong> has been confirmed.</p>

                        <div className="transaction-box">
                            <span className="tx-label">Transaction ID:</span>
                            <span className="tx-id">{transactionId}</span>
                        </div>

                        <button className="btn-payment-done" onClick={onClose}>
                            CONTINUE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
