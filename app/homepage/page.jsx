"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
// import { firestore } from '@/firebase';

// import { doc, setDoc } from 'firebase/firestore';


const coursesData = [
  {
    courseName: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern web applications.',
  },
  {
    courseName: 'React Fundamentals',
    description: 'Master React, a popular JavaScript library for building user interfaces.',
  },
  {
    courseName: 'Node.js and Express',
    description: 'Dive into server-side development with Node.js and the Express framework.',
  },
  // Add more course data here
];

const HomePage = () => {
  // const [courses, setCourses] = useState([]);
  // const [loading, setLoading] = useState(true);

 


  return (
    <>
    {coursesData.map((course, index) => (
    <Card className="w-full max-w-md mt-2.5" key={index}>
      <CardHeader>
        <CardTitle>{course.courseName}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{course.description}</CardDescription>
      </CardContent>
    </Card>
    ))}
    </>
  )
}

export default HomePage

