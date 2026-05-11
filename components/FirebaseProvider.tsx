'use client';

import { useEffect } from 'react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function testConnection() {
      try {
        // Standard check as per instructions
        await getDocFromServer(doc(db, 'system', 'connection_test'));
        console.log("Firebase connection established successfully.");
      } catch (error: any) {
        // Log errors but don't block app
        if (error.code === 'permission-denied' || error.message.includes('insufficient permissions')) {
          console.log("Firebase reached server but permissions were denied (this is normal for test check).");
        } else if (error.message.includes('the client is offline')) {
          console.error("Firebase is offline. Please check your configuration.");
        } else {
          console.warn("Firebase connection test note:", error.message);
        }
      }
    }
    testConnection();
  }, []);

  return <>{children}</>;
}
