
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "",
  authDomain: "t",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};


export const app = initializeApp(firebaseConfig);



const auth = getAuth(app);
 const googleProvider = new GoogleAuthProvider();



googleProvider.addScope("https://www.googleapis.com/auth/calendar");
googleProvider.addScope("https://www.googleapis.com/auth/tasks");

googleProvider.setCustomParameters({
  prompt: "consent",
});

export { auth, googleProvider };
export default app;


const analytics = getAnalytics(app);

