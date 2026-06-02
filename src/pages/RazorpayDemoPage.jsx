import { useState } from 'react';
import RazorpayCheckoutButton from '../components/payment/RazorpayCheckoutButton';
import Seo from '../components/seo/Seo';

export default function RazorpayDemoPage() {
  const [paymentResult, setPaymentResult] = useState(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Seo title="Payment Demo" description="Internal Razorpay integration demo page." path="/payment-demo" robots="noindex,nofollow" />
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Payment Demo</p>
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Razorpay React Integration</h1>
        <p className="mb-8 text-gray-600">
          This page creates a Razorpay order from the backend, opens Checkout, and verifies the payment signature after success.
        </p>

        <div className="mb-8 rounded-2xl bg-gray-50 p-5">
          <p className="text-sm text-gray-500">Test Amount</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">Rs. 499.00</p>
        </div>

        <RazorpayCheckoutButton
          amount={499}
          customer={{
            name: 'Test User',
            email: 'test.user@example.com',
            phone: '9876543210'
          }}
          notes={{
            productType: 'demo-payment'
          }}
          buttonLabel="Pay Rs. 499"
          className="btn-primary w-full py-3"
          onPaymentSuccess={({ verifyResponse, paymentResponse, orderResponse }) => {
            setPaymentResult({
              status: 'success',
              orderId: orderResponse.order.id,
              paymentId: paymentResponse.razorpay_payment_id,
              signatureVerified: verifyResponse.success
            });
          }}
          onPaymentFailure={(error) => {
            setPaymentResult({
              status: 'failed',
              message: error?.response?.data?.message || error?.description || error?.message || 'Payment failed'
            });
          }}
        />

        {paymentResult && (
          <div className={`mt-6 rounded-2xl p-5 ${paymentResult.status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-semibold">{paymentResult.status === 'success' ? 'Payment Completed' : 'Payment Failed'}</p>
            <pre className="mt-3 whitespace-pre-wrap break-all text-sm">{JSON.stringify(paymentResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
