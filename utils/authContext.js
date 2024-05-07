import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useToast } from "@/components/ui/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { setCred } from "@/store/slices/homeSlice";
import { useRouter } from "next/navigation";
import { fetchUserData } from "./fetchUserData";
import { usePathname } from "next/navigation";
export const AuthContext = createContext({
  user: {
    email: "",
    emailVerified: "",
    displayName: "",
  },
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast()
  const pathname = usePathname();
  console.log("pathname", pathname)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true)
      if (user) {
        if (window.location.pathname != "/student") {
          console.log("user", user);
          const additionalDetails = await fetchUserData(user.uid);
          if (additionalDetails) {
            dispatch(
              setCred({
                email: additionalDetails.email,
                name: additionalDetails.name,
                student_id: additionalDetails.student_id,
                role: additionalDetails.role,
                class_name: additionalDetails.class_name,
                class_id: additionalDetails.class_id,
                year: additionalDetails.year,
                student_uid: user.uid,
              }),
            );
            setUser(user);
            toast({
              title: "Login Successful....",
              description: "Welcome to capstonenav!",
            });
            if (window.location.pathname === "/") {
              router.push("/dashboard")
            }
          }
        }
      } else {
        console.log("no auth")
        setUser(null);
        router.push("/")
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, router, toast]);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <div className="loading-container">
          <h1>Loading....</h1>
        </div>
      ) : (
        <>{children}</>
      )}
    </AuthContext.Provider>
  );
};