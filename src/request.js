import { app, showNotification } from ".";
import { getFirestore, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

Vue.createApp({
  data() {
    return {
      requests: [],
    };
  },
  methods: {
    async upvotedRequest(id) {
      const functions = getFunctions(app);
      try {
        const upvote = httpsCallable(functions, "upvote");
        await upvote({
          id,
        });
      } catch (err) {
        showNotification(err.message)
      }
    },
  },
  mounted() {
    const db = getFirestore(app);
    const colRef = collection(db, "request");
    const ref = query(colRef, orderBy("upvotes", "desc"));
    onSnapshot(ref, (snapshot) => {
      let requests = [];
      snapshot.docs.forEach((doc) => {
        requests.push({ ...doc.data(), id: doc.id });
      });
      this.requests = requests;
    });
  },
}).mount("#app");
