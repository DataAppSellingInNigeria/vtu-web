import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import TransactionsList from "../../components/wallet/TransactionsList";

export default function Transactions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Responsive container: full width on mobile, constrained on larger screens */}
      <main className="flex-1 px-3 sm:px-4">
        <div className="mx-auto w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
          <TransactionsList />
        </div>
      </main>

      <Footer />
    </div>
  );
}
