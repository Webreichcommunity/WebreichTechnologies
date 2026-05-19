import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { authReady, db } from "../Firebase/config";

export function useFirestoreCollection(collectionName, fallback = []) {
  const [items, setItems] = useState(fallback);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setStatus("loading");
      try {
        await authReady;
        const ref = collection(db, collectionName);
        const snapshot = await getDocs(query(ref, orderBy("createdAt", "desc")));
        const remoteItems = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        if (isMounted) {
          setItems(remoteItems.length ? remoteItems : fallback);
          setStatus("success");
        }
      } catch {
        if (isMounted) {
          setItems(fallback);
          setStatus("error");
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [collectionName, fallback]);

  return { items, status };
}
