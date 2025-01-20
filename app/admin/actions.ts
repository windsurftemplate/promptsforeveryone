'use server';

import { Ad } from '@/config/ads';
import { ref, set, update, remove } from 'firebase/database';
import { db } from '@/lib/firebase';

export async function updateAdsAction(ads: Ad[]) {
  // Update ads in the database
  const adsRef = ref(db, 'ads');
  await set(adsRef, ads.reduce((acc, ad) => ({ ...acc, [ad.id]: ad }), {}));
  return ads;
}

export async function updateAdStatusAction(adId: string, newStatus: 'active' | 'inactive') {
  const adRef = ref(db, `ads/${adId}`);
  await update(adRef, { status: newStatus });
}

export async function deleteAdAction(adId: string) {
  const adRef = ref(db, `ads/${adId}`);
  await remove(adRef);
} 