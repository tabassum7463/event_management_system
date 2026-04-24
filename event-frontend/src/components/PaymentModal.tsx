import { useState } from "react";
import QRCode from "react-qr-code";
import "../styles/components/PaymentModal.css";

interface PaymentModalProps {
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function PaymentModal({ amount, onConfirm, onCancel, isSubmitting = false }: PaymentModalProps) {
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleScan = () => {
    if (isSubmitting) return;
    setScanned(true);
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
    }, 1500);
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-card">
        <button type="button" className="close-icon" onClick={onCancel} disabled={isSubmitting}>
          x
        </button>

        <h2>Complete Payment</h2>
        <p>
          Amount to pay: <strong>Rs {amount}</strong>
        </p>

        {!scanned && (
          <>
            <p>Scan QR to pay</p>
            <QRCode
              value={`PAYMENT:${amount}`}
              size={180}
              style={{ margin: "1rem auto", display: "block", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
              onClick={handleScan}
            />
            <p className="qr-instruction">Click QR after scanning to simulate payment</p>
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
          </>
        )}

        {scanned && processing && (
          <>
            <p>Processing payment...</p>
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
          </>
        )}

        {paid && (
          <div className="payment-success">
            <p className="success-message">Payment Successful</p>
            <div className="payment-buttons">
              <button type="button" className="btn-primary" onClick={onConfirm} disabled={isSubmitting}>
                {isSubmitting ? "Confirming..." : "Confirm Booking"}
              </button>
              <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
