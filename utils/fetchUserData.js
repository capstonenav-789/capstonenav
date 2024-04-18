import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const fetchUserData = async (userId) => {
  console.log("userid", userId);
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      return userData;
    } else {
      console.log("User document not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
