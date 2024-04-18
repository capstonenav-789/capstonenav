"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";

import { collection, getDocs } from "firebase/firestore";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataFromFirebase = async () => {
      const querySnapshot = await getDocs(collection(firestore, "courses"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      console.log("hsdj", data);
      setCourses(data);
      setLoading(false);
    };

    fetchDataFromFirebase();
  }, []);

  return (
    <>
      <div className="flex flex-wrap">
        <h1 className="text-2xl font-semibold">Courses</h1>
        {courses.map((course, index) => (
          <Card className="w-full max-w-md mt-2.5" key={index}>
            <CardHeader>
              <CardTitle>{course.coursename}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription></CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default HomePage;
