import React from 'react';
import ExchangeCard from '@/components/ExchangeCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <ExchangeCard />
      </div>
      <Footer />
    </main>
  );
}
