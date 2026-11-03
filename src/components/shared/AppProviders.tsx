'use client';
import React from 'react';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import Cursor from '@/components/shared/Cursor';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import { InstallAppProvider } from '@/context/InstallAppContext';
import InstallAppModal from '@/components/shared/InstallAppModal';
import AppSplashScreen from '@/components/shared/AppSplashScreen';
import AppBottomNav from '@/components/shared/AppBottomNav';
import UpdateNotification from '@/components/shared/UpdateNotification';
import AsaAudioPlayer from '@/components/asa/AsaAudioPlayer';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <InstallAppProvider>
      <CartProvider>
        <AppSplashScreen />
        <UpdateNotification />
        <Cursor />
        {children}
        <WhatsAppFloat />
        <InstallAppModal />
        <CartDrawer />
        <AppBottomNav />
        <AsaAudioPlayer />
      </CartProvider>
    </InstallAppProvider>
  );
}
