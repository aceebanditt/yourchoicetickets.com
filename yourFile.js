import { auth, db } from './firebaseConfig';

// Replace Supabase authentication and database logic with Firebase
try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (userDoc.exists) {
        console.log("User data:", userDoc.data());
    } else {
        console.log("No such document!");
    }
} catch (error) {
    console.error("Error signing in or fetching user data:", error);
}
