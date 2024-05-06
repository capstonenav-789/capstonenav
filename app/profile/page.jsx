"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { updateCred } from "../../store/slices/homeSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";

const Profile = () => {
  const router = useRouter();
  const homeData = useSelector((state) => state.home);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      setIsLoading(false);
      return;
    }

    const user = auth.currentUser;

    if (user) {
      try {
        const credential = await signInWithEmailAndPassword(auth, user.email, currentPassword);
        await updatePassword(credential.user, newPassword);
        setMessage('Password changed successfully.');
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage('User not authenticated.');
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="w-full w-[500px] mt-8 mx-auto">
        <Label htmlFor="firstName">Name</Label>
        <Input

          value={homeData.name}
          disabled={true}
        />

        <Label htmlFor="middleName" className="mt-4">
          Email
        </Label>
        <Input

          value={homeData.email}
          disabled
        />

        <Label htmlFor="lastName" className="mt-4">
          Class
        </Label>
        <Input

          value={homeData.class_name}
          disabled
        />

        <Label htmlFor="email" className="mt-4">
          User Role
        </Label>
        <Input

          value={homeData.role}
          disabled
        />

        <Label htmlFor="phone" className="mt-4">
          Year
        </Label>
        <Input

          value={homeData.year}
          disabled
        />

      </div>
      <div>
        <h1 className="text-2xl font-bold my-4">Change Password</h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" isLoading={isLoading}>
            Change Password
          </Button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Profile;
