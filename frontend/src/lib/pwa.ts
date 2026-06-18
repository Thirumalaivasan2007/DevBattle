import api from './axios';

const DB_NAME = 'DevBattleOfflineDB';
const DB_VERSION = 1;

// IndexedDB Helper for Offline Sync Queue
export const getOfflineDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id' });
      }
    };
  });
};

export const enqueueOfflineAction = async (action: string, payload: any) => {
  const db = await getOfflineDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('syncQueue', 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const item = {
      id: crypto.randomUUID(),
      action,
      payload,
      timestamp: new Date().toISOString()
    };
    
    const request = store.add(item);
    request.onsuccess = () => {
      // After queuing, try to register for background sync if supported
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((reg: any) => {
          reg.sync.register('sync-offline-queue').catch(() => {
            console.log('Background Sync could not be registered');
          });
        });
      }
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
};

export const getOfflineQueue = async (): Promise<any[]> => {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('syncQueue', 'readonly');
    const store = transaction.objectStore('syncQueue');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const clearOfflineQueue = async (ids: string[]) => {
  const db = await getOfflineDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('syncQueue', 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    ids.forEach(id => store.delete(id));
    
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const processOfflineQueue = async () => {
  if (!navigator.onLine) return;
  
  const items = await getOfflineQueue();
  if (items.length === 0) return;

  try {
    const res = await api.post('/sync/process', { items });
    
    // Only clear items that were successfully processed or permanently failed
    if (res.data && res.data.results) {
      const idsToRemove = res.data.results.map((r: any) => r.id);
      await clearOfflineQueue(idsToRemove);
      console.log(`[PWA] Processed ${idsToRemove.length} offline actions.`);
    }
  } catch (error) {
    console.error('[PWA] Failed to process offline queue', error);
  }
};

// Push Notification Helper
export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications are not supported in this browser.');
  }

  const registration = await navigator.serviceWorker.ready;
  
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    throw new Error('VAPID Public Key not found');
  }

  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  });

  return subscription;
};

// Register Service Worker
export const registerServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[PWA] Service Worker registered with scope:', registration.scope);

      // Listen for messages from the service worker (e.g. background sync triggers)
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PROCESS_OFFLINE_QUEUE') {
          processOfflineQueue();
        }
      });
      
      // Attempt to process queue immediately if online
      if (navigator.onLine) {
        processOfflineQueue();
      }

    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  }
};
