import { useState } from 'react';
import toast from 'react-hot-toast';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../services/api';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(true), { once: true });
    existingScript.addEventListener('error', () => resolve(false), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = RAZORPAY_SCRIPT_URL;
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function RazorpayCheckoutButton({
  amount,
  currency = 'INR',
  customer,
  notes,
  buttonLabel = 'Pay Now',
  className = 'btn-primary',
  disabled = false,
  onPaymentSuccess,
  onPaymentFailure
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Unable to load Razorpay Checkout');
      }

      const { data } = await createRazorpayOrder({
        amount,
        currency,
        customer,
        notes
      });

      const razorpay = new window.Razorpay({
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Vallal Food',
        description: 'Secure online payment',
        order_id: data.order.id,
        prefill: {
          name: customer?.name || '',
          email: customer?.email || '',
          contact: customer?.phone || ''
        },
        notes,
        theme: {
          color: '#16a34a'
        },
        handler: async (response) => {
          try {
            const verifyResponse = await verifyRazorpayPayment(response);
            toast.success('Payment successful');
            onPaymentSuccess?.({
              verifyResponse: verifyResponse.data,
              paymentResponse: response,
              orderResponse: data
            });
          } catch (error) {
            const message = error.response?.data?.message || 'Payment verification failed';
            toast.error(message);
            onPaymentFailure?.(error);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
            onPaymentFailure?.(new Error('Payment cancelled by user'));
          }
        }
      });

      razorpay.on('payment.failed', (response) => {
        const message = response.error?.description || 'Payment failed';
        toast.error(message);
        setLoading(false);
        onPaymentFailure?.(response.error);
      });

      razorpay.open();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Unable to start payment';
      toast.error(message);
      onPaymentFailure?.(error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || loading}
      onClick={handlePayment}
    >
      {loading ? 'Processing...' : buttonLabel}
    </button>
  );
}
