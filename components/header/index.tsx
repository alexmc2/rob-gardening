// components/header/index.tsx
import HeaderClient from "@/components/header/header-client";
import {
  fetchSanityNavigation,
  fetchSanitySettings,
  fetchSanityShopPresence,
} from "@/sanity/lib/fetch";

export default async function Header() {
  const [settings, navigation, hasShop] = await Promise.all([
    fetchSanitySettings(),
    fetchSanityNavigation(),
    fetchSanityShopPresence(),
  ]);

  return (
    <HeaderClient
      navigation={navigation}
      settings={settings}
      hasShop={hasShop}
    />
  );
}
