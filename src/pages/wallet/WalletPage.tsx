import { useRef, useState } from "react";
import WalletCard, { WalletCardHandle } from "../../components/wallet/WalletCard";
import FundWalletModal from "../../components/wallet/FundWalletModal";
import TransactionsList from "../../components/wallet/TransactionsList";
import QuickActions from "../../components/wallet/QuickActions";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function WalletPage() {
  const [fundOpen, setFundOpen] = useState(false);
  const walletRef = useRef<WalletCardHandle>(null);

  const handleFundSuccess = () => {
    setFundOpen(false);
    // 🔁 Trigger the WalletCard’s refetch
    walletRef.current?.refresh();
    // (Optional) also refresh transactions if needed
    // txRef.current?.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page content */}
      <main className="flex-1 w-full">
        {/* Responsive container: full width on small screens, centered with max-width on desktop */}
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <WalletCard ref={walletRef} onFund={() => setFundOpen(true)} />
          <QuickActions />

          <TransactionsList />
        </div>
      </main>

      <Footer />

      {fundOpen && (
        <FundWalletModal
          open={fundOpen}
          onClose={() => setFundOpen(false)}
          onSuccess={handleFundSuccess}
        />
      )}

    </div>
  );
}
