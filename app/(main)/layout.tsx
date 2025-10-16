// app/(main)/layout.tsx
import Header from '@/components/header';
import Footer from '@/components/footer';
import { DisableDraftMode } from '@/components/disable-draft-mode';
import { VisualEditing } from 'next-sanity';
import { draftMode } from 'next/headers';
import { SanityLive } from '@/sanity/lib/live';
import { CartProvider } from '@/components/store/CartProvider';
import CartDrawer from '@/components/store/CartDrawer';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
      {/* Always render SanityLive so production receives LCAPI events
         and revalidates cached content automatically. */}
      <SanityLive />
      {isDraftMode && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
