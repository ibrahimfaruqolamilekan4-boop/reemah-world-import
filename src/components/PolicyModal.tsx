import React from 'react';
import { Shield, RefreshCw, FileText, ArrowLeft } from 'lucide-react';

interface PolicyModalProps {
  onBackToShop: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ onBackToShop }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-stone-200 pb-4">
        <button
          onClick={onBackToShop}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store Feed
        </button>
        <h2 className="text-3xl font-serif font-bold text-stone-900">Policies & Terms of Service</h2>
        <p className="text-stone-500 text-sm mt-1">Reemah World Import buyer guidelines, refund policy, and data privacy disclosures.</p>
      </div>

      {/* Refund & Return Policy */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">Refund & Return Policy</h3>
        </div>
        <div className="text-stone-600 text-sm space-y-3 leading-relaxed">
          <p>
            At Reemah World Import, we inspect every product prior to dispatch. However, if your item arrives damaged or defective, you are eligible for a replacement or full refund within 7 days of delivery.
          </p>
          <p>
            To be eligible for a return, items must be unused, in their original factory packaging, and accompanied by your order reference number. Contact our support team via WhatsApp or email to initiate a return request.
          </p>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">Privacy Policy</h3>
        </div>
        <div className="text-stone-600 text-sm space-y-3 leading-relaxed">
          <p>
            We collect personal information such as your name, email address, phone number, and delivery address solely for the purpose of fulfilling orders and communicating shipping updates.
          </p>
          <p>
            Payment transactions are processed securely through Paystack. We do not store your debit card details on our servers. Your data is kept strictly confidential and never shared with third-party advertisers.
          </p>
        </div>
      </section>

      {/* Terms of Service */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">Terms of Service</h3>
        </div>
        <div className="text-stone-600 text-sm space-y-3 leading-relaxed">
          <p>
            By accessing and placing an order with Reemah World Import, you agree to abide by our pricing, shipping terms, and payment validation procedures. Prices are listed in Nigerian Naira (₦) and are subject to change based on import tariffs and exchange rates.
          </p>
          <p>
            All content on this platform, including product photos, videos, and descriptions, is the intellectual property of Reemah World Import.
          </p>
        </div>
      </section>

    </div>
  );
};
