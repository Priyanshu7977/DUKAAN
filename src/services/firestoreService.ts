import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, FirebaseUser } from '../lib/firebase';
import { UserOrder } from '../types';

export interface UserProfileDocument {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  role: 'member' | 'vip' | 'admin';
  createdAt: any;
  updatedAt: any;
}

export const syncUserProfileToFirestore = async (
  user: FirebaseUser,
  customData?: { name?: string; phone?: string }
): Promise<void> => {
  if (!isFirebaseConfigured || !user.uid) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(userRef);

    const dataToSave = {
      uid: user.uid,
      displayName: customData?.name || user.displayName || 'DUKAAN Patron',
      email: user.email || '',
      phoneNumber: customData?.phone || user.phoneNumber || '',
      role: user.phoneNumber?.includes('7977641125') || user.email === 'dukaancreate@gmail.com' ? 'admin' : 'member',
      updatedAt: serverTimestamp(),
      ...(!existingSnap.exists() ? { createdAt: serverTimestamp() } : {}),
    };

    await setDoc(userRef, dataToSave, { merge: true });
  } catch {}
};

export const syncOrderToFirestore = async (
  order: UserOrder,
  userId?: string,
  extraMetadata?: any
): Promise<void> => {
  if (!isFirebaseConfigured || !order.id) return;
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      userId: userId || null,
      metadata: extraMetadata || null,
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch {}
};

export const fetchOrdersFromFirestore = async (userId: string): Promise<UserOrder[]> => {
  if (!isFirebaseConfigured || !userId) return [];
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const orders: UserOrder[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      orders.push({
        id: docSnap.id,
        date: data.date || '',
        status: data.status || 'Processing',
        total: data.total || 0,
        paymentMethod: data.paymentMethod || 'Prepaid',
        trackingNumber: data.trackingNumber,
        estimatedDelivery: data.estimatedDelivery,
        items: data.items || [],
      });
    });
    return orders;
  } catch {
    return [];
  }
};
