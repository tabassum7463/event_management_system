import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import QRCode from "react-qr-code";
import "../styles/components/PaymentModal.css";

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
}

export default function PaymentModal({ amount, onClose }: PaymentModalProps) {
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const navigate = useNavigate(); // ✅ initialize navigate

  const handleScan = () => {
    setScanned(true);
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
    }, 1500);
  };

  const handleClose = () => {
    setScanned(false);
    setProcessing(false);
    setPaid(false);
    onClose();
  };

  const handleBookingNavigation = () => {
    handleClose(); 
    navigate("/my-bookings"); 
    
  };

  const handleCancelNavigation = () => {
    handleClose();
    navigate("/eventDetails"); 
    
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-card">
        <button type="button" className="close-icon" onClick={handleCancelNavigation}>
          ✖
        </button>

        <h2>Complete Payment</h2>
        <p>Amount to pay: <strong>₹{amount}</strong></p>

        {!scanned && (
          <>
            <p>Scan QR to pay</p>
            <QRCode
              value={`PAYMENT:${amount}`}
              size={180}
              style={{ margin: "1rem auto", display: "block", cursor: "pointer" }}
              onClick={handleScan}
            />
            <p className="qr-instruction">Click QR after scanning to simulate payment</p>
            <button type="button" className="btn-secondary" onClick={handleCancelNavigation}>
              Cancel
            </button>
          </>
        )}

        {scanned && processing && (
          <>
            <p>⏳ Processing payment...</p>
            <button type="button" className="btn-secondary" onClick={handleCancelNavigation}>
              Cancel
            </button>
          </>
        )}

        {paid && (
          <div className="payment-success">
            <p className="success-message">✅ Payment Successful!</p>
            <div className="payment-buttons">
              <button type="button" className="btn-primary" onClick={handleBookingNavigation}>
                Confirm & Go to My Bookings
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancelNavigation}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}