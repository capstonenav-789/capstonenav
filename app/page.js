"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "@/utils/fetchUserData";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// store
import { setCred } from "/store/slices/homeSlice";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading ] = useState(false)
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    let isValid = true;

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      dispatch(setCred({ email: "" }));
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (!password || password.length < 6) {
      dispatch(setCred({ password: "" }));
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // If all validations pass, you can proceed with the login logic
    if (isValid) {
      // try {
      //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
      //   const user = userCredential.user;
      //   console.log("user", userCredential.user);
      //   router.push('/');

      // }
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        // const user = userCredential.user;

        // dispatch(
        //   setCred({
        //     email: email,
        //     password: password,
        //     loggedIn: true,
        //     class: additionalDetails.class,
        //     firstName: additionalDetails.firstName,
        //     lastName: additionalDetails.lastName,
        //     middleName: additionalDetails.middleName,
        //     phone: additionalDetails.phone,
        //     roleNumber: additionalDetails.roleNumber,
        //     userRole: additionalDetails.userRole,
        //     dept: additionalDetails.dept ? additionalDetails.dept : "",
        //     course: additionalDetails.course ? additionalDetails.course : "",
        //   }),
        // );
        // toast({
        //   title: "Login Successful....",
        //   description: "Welcome to capstonenav!",
        // })
        // router.push("/dashboard")
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        })
        console.error("Error signing in:", error);
      }
      setLoading(false)
    }
    setLoading(false)
  };
  console.log(loading)
  return (
    <div className="flex items-center justify-center w-[1480px] h-[70vh]">
      <div className="w-full max-w-[800px] ">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
          Login
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                emailError ? "border-red-500" : ""
              }`}
              placeholder="Enter your email"
            />
            {emailError && (
              <p className="text-red-500 text-xs italic">{emailError}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                passwordError ? "border-red-500" : ""
              }`}
              placeholder="Enter your password"
            />
            {passwordError && (
              <p className="text-red-500 text-xs italic">{passwordError}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login" }
            </Button>
            <a
              href="#"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
