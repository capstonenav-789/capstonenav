"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "@/utils/fetchUserData";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// store
import { setCred } from "/store/slices/homeSlice";

export default function Home() {
  const [email, setEmail] = useState("studentadmin@gmail.com");
  const [password, setPassword] = useState("Studentadmin");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent successfully.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        // const user = userCredential.user;
        // const additionalDetails = await fetchUserData(user.uid);
        // await dispatch(
        //   setCred({
        //     email: additionalDetails.email,
        //     name: additionalDetails.name,
        //     student_id: additionalDetails.student_id,
        //     role: additionalDetails.role,
        //     class_name: additionalDetails.class_name,
        //     class_id: additionalDetails.class_id,
        //     year: additionalDetails.year,
        //     student_uid: user.uid,
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
        });
        console.error("Error signing in:", error);
      }
      setLoading(false);
    }
    setLoading(false);
  };

  console.log(loading);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Login
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-4 sm:px-6 md:px-8 pt-6 pb-8"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base ${
                emailError ? "border-red-500" : ""
              }`}
              placeholder="Enter your email"
            />
            {emailError && (
              <p className="text-red-500 text-xs sm:text-sm italic mt-1">
                {emailError}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2 text-sm sm:text-base"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base ${
                passwordError ? "border-red-500" : ""
              }`}
              placeholder="Enter your password"
            />
            {passwordError && (
              <p className="text-red-500 text-xs sm:text-sm italic mt-1">
                {passwordError}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Loading..." : "Login"}
            </Button>
            <a
              onClick={() => setIsDeleteDialogOpen(true)}
              className="inline-block cursor-pointer text-center sm:text-left font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="mx-4 max-w-sm sm:max-w-md">
          <form onSubmit={handlePassSubmit} className="grid gap-4">
            <div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter Your Email"
                className="text-sm sm:text-base"
              />
            </div>
            <Button type="submit" isLoading={isLoading} className="w-full">
              Reset Password
            </Button>
            {message && <p className="text-sm text-center">{message}</p>}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
