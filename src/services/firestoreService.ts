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

export const fetchAllOrdersFromFirestore = async (): Promise<UserOrder[]> => {
  if (!isFirebaseConfigured) return [];
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
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
    try {
      const ordersRef = collection(db, 'orders');
      const snapshot = await getDocs(ordersRef);
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
  }
};

export const updateOrderStatusInFirestore = async (
  orderId: string,
  newStatus: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled',
  trackingNumber?: string,
  carrier?: string
): Promise<boolean> => {
  if (!isFirebaseConfigured || !orderId) return false;
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updatePayload: any = {
      status: newStatus,
      updatedAt: serverTimestamp(),
    };
    if (trackingNumber) updatePayload.trackingNumber = trackingNumber;
    if (carrier) updatePayload.carrier = carrier;
    await setDoc(orderRef, updatePayload, { merge: true });
    return true;
  } catch {
    return false;
  }
};

export const fetchAllUsersFromFirestore = async (): Promise<UserProfileDocument[]> => {
  if (!isFirebaseConfigured) return [];
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const usersList: UserProfileDocument[] = [];
    snapshot.forEach((docSnap) => {
      usersList.push(docSnap.data() as UserProfileDocument);
    });
    return usersList;
  } catch {
    return [];
  }
};

export const syncInventoryOverrideToFirestore = async (
  productId: string,
  data: any
): Promise<boolean> => {
  if (!isFirebaseConfigured || !productId) return false;
  try {
    const invRef = doc(db, 'inventory_overrides', productId);
    await setDoc(
      invRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch {
    return false;
  }
};

export const fetchAllInventoryOverridesFromFirestore = async (): Promise<Record<string, any>> => {
  if (!isFirebaseConfigured) return {};
  try {
    const invCol = collection(db, 'inventory_overrides');
    const snapshot = await getDocs(invCol);
    const result: Record<string, any> = {};
    snapshot.forEach((docSnap) => {
      result[docSnap.id] = docSnap.data();
    });
    return result;
  } catch {
    return {};
  }
};
