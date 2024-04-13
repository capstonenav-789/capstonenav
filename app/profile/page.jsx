"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { updateCred } from '../../store/slices/homeSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const router = useRouter();
  const homeData = useSelector((state) => state.home);
  const [firstName, setFirstName] = useState(homeData?.firstName);
  const [middleName, setMiddleName] = useState(homeData?.middleName);
  const [lastName, setLastName] = useState(homeData?.lastName);
  const [email, setEmail] = useState(homeData?.email);
  const [phone, setPhone] = useState(homeData?.phone);
  const [nameOfClass, setNameOfClass] = useState(homeData?.class);
  const [roleNumber, setRoleNumber] = useState(homeData?.roleNumber);

  const dispatch = useDispatch();

  const handleUpdate = () => {
    dispatch(
      updateCred({
        firstName,
        middleName,
        lastName,
        email,
        phone,
        class: nameOfClass,
        roleNumber,
      })
    );
    // Add any additional logic or alerts here
  };

  return (
    <div className="flex flex-col items-center">
      

      <div className="w-full w-[500px] mt-8 mx-auto">
        <Label htmlFor="firstName">First Name*</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
        />

        <Label htmlFor="middleName" className="mt-4">
          Middle Name*
        </Label>
        <Input
          id="middleName"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          placeholder="Enter your middle name"
        />

        <Label htmlFor="lastName" className="mt-4">
          Last Name*
        </Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
        />

        <Label htmlFor="email" className="mt-4">
          Email*
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <Label htmlFor="phone" className="mt-4">
          Phone Number*
        </Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />

        <Label htmlFor="class" className="mt-4">
          Class*
        </Label>
        <Input
          id="class"
          value={nameOfClass}
          onChange={(e) => setNameOfClass(e.target.value)}
          placeholder="Enter your class"
        />

        <Label htmlFor="roleNumber" className="mt-4">
          Role Number*
        </Label>
        <Input
          id="roleNumber"
          value={roleNumber}
          onChange={(e) => setRoleNumber(e.target.value)}
          placeholder="Enter your role number"
        />

        <Button onClick={handleUpdate} className="mt-6">
          Update
        </Button>
      </div>
    </div>
  );
};

export default Profile;