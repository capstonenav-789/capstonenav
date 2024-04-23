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
  const shouldNotRefresh = pathname === "/student";
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (shouldNotRefresh) return;
      setLoading(true)
      if (user) {
        console.log("user", user);
        const additionalDetails = await fetchUserData(user.uid);
        dispatch(
          setCred({
            email: additionalDetails.email,
            name: additionalDetails.name,
            student_id: additionalDetails.student_id,
            userRole: additionalDetails.role,
            class_name: additionalDetails.class_name,
            class_id: additionalDetails.class_id,
          }),
        );
        toast({
          title: "Login Successful....",
          description: "Welcome to capstonenav!",
        })
        router.push("/dashboard")
        setUser(user)
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