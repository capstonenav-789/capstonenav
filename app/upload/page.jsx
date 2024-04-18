"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  writeBatch,
} from "@firebase/firestore";
import { firestore } from "@/firebase";
import coursesyears from "@/lib/coursesyears";
import CreatableSelect from "react-select/creatable";

export default function Upload() {
  const [course, setCourse] = useState("");
  const [yearsCollection, setYearsCollection] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (selectedYears) => {
    setSelectedYears(selectedYears);
  };

  // async function addToFireStoreDataBase(collectionName, data) {
  //   try {
  //       const docRef = await addDoc(collection(firestore, collectionName), data);
  //       console.log(`${collectionName} added with ID: ${docRef.id}`);
  //       return true;
  //   } catch (error) {
  //       console.error("Error adding document: ", error);
  //       return false;
  //   }
  // }

  const uploadFirebase = async (courseData, yearsData) => {
    try {
      const batch = writeBatch(firestore);
      const courseLowerCase = courseData.toLowerCase();

      // Check if course already exists
      const courseQuerySnapshot = await getDocs(
        collection(firestore, "courses")
      );
      const existingCourses = courseQuerySnapshot.docs.map((doc) =>
        doc.data().name.toLowerCase()
      );
      if (existingCourses.includes(courseLowerCase)) {
        setErrors({ course: "Course already exists!" });
        return;
      }

      // Add course data to the "courses" collection
      const courseRef = doc(collection(firestore, "courses"));
      batch.set(courseRef, { name: courseData });

      // Check if years already exist and add new years to "Years" collection
      const yearsQuerySnapshot = await getDocs(collection(firestore, "Years"));
      const existingYears = yearsQuerySnapshot.docs.map(
        (doc) => doc.data().year
      );
      const newYears = yearsData.filter(
        (year) => !existingYears.includes(year)
      );
      newYears.forEach((year) => {
        const yearRef = doc(collection(firestore, "Years"));
        batch.set(yearRef, { year });
      });

      // Check if the course and year combination already exists and add new combinations to "courseyear" collection
      const courseYearQuerySnapshot = await getDocs(
        collection(firestore, "courseyear")
      );
      const existingCourseYears = courseYearQuerySnapshot.docs.map((doc) => {
        const data = doc.data();
        return `${data.course}_${data.year}`;
      });
      yearsData.forEach((year) => {
        const courseYearCombination = `${courseLowerCase}_${year}`;
        if (!existingCourseYears.includes(courseYearCombination)) {
          const courseYearRef = doc(collection(firestore, "courseyear"));
          batch.set(courseYearRef, { course: courseData, year });
        } else {
          console.log(`Course ${courseData} with year ${year} already exists!`);
        }
      });
      // Commit the batch write
      await batch.commit();
      alert("Data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course || selectedYears.length === 0) {
      setErrors({
        course: !course ? "Course name is required" : "",
        years: selectedYears.length === 0 ? "Select at least one year" : "",
      });
      return;
    }
    setErrors({});
    await uploadFirebase(
      course,
      selectedYears.map((year) => year.label)
    );
  };

  useEffect(() => {
    const fetchDataFromFirebase = async () => {
      const querySnapshot = await getDocs(collection(firestore, "Years"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      // console.log("hsdj", data);
      setYearsCollection(data);
      // setLoading(false);
    };
    fetchDataFromFirebase();
  }, []);

  return (
    <div className="mt-56">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8"
      >
        <div className="mb-4 w-[500px]">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Courses
          </label>
          <input
            type="text"
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.course ? "border-red-500" : "" // Apply red border on error
            }`}
            placeholder="Enter Course Name"
          />
          {errors.course && (
            <p className="text-red-500 text-sm">{errors.course}</p>
          )}
        </div>
        <div className="mb-4 w-[500px]">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Years
          </label>
          <CreatableSelect
            options={yearsCollection.map((year) => ({
              value: year.id,
              label: year.year,
            }))}
            value={selectedYears}
            onChange={handleChange}
            isMulti={true}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.course ? "border-red-500" : "" // Apply red border on error
            }`}
          />
          {errors.years && (
            <p className="text-red-500 text-sm">{errors.years}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-[#115740] bg-[#115740] text-white mx-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            upload to Database
          </button>
        </div>
      </form>
    </div>
  );
}
