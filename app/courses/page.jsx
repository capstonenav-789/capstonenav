"use client"
import { getDocs, collection, query, limit, startAfter, startAt, addDoc, doc, updateDoc, deleteDoc, endBefore, limitToLast, orderBy, writeBatch, where, getDoc } from 'firebase/firestore';
import { firestore } from "@/firebase";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import CreatableSelect from "react-select/creatable";
import useCheckUserRole from '@/utils/useCheckUserRole';

const LIMIT = 10;

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [noMore, setNoMore] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [editingClass, setEditingClass] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [page, setPage] = useState(0)

  const [course, setCourse] = useState("");
  const [yearsCollection, setYearsCollection] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [errors, setErrors] = useState({});
  const [coursesHash, setCoursesHash] = useState([])
  const [courses, setCourses] = useState([])

  const { admin, manager, student } = useCheckUserRole(['admin', 'studentadmin', 'student']);

  const handleChange = (sel) => {
    setSelectedYears(sel);
  };

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
      const updatedCoursesHash = JSON.parse(JSON.stringify(coursesHash));
      updatedCoursesHash[courseData.split(" ").join("_")] = yearsData;
      setCoursesHash(updatedCoursesHash);
      setCourses((prevClasses) => [
        ...prevClasses,
        { uid: courseRef.id, name: courseData },
      ]);
      setIsSheetOpen(false)
      setCourse("");
      setSelectedYears("");
    } catch (error) {
      console.error("Error uploading data: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course || selectedYears.length === 0 || errors.years) {
      setErrors({
        course: !course ? "Course name is required" : "",
        years: selectedYears.length === 0 ? "Select at least one year" : errors.years,
      });
      return;
    }
    setErrors({});
    await uploadFirebase(
      course,
      selectedYears.map((year) => year.label)
    );
  };

  const updateFirebase = async (courseId, updatedCourseData, yearData) => {
    try {
      // Get the existing course document
      const courseDocRef = doc(firestore, "courses", courseId);
      const courseDoc = await getDoc(courseDocRef);
  
      // Create a new batch
      const batch = writeBatch(firestore);
  
      // Check if the course name has changed
      const courseNameChanged = courseDoc.data().name !== updatedCourseData;

      if (courseNameChanged){
        const courseLowerCase = updatedCourseData.toLowerCase();

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

        // Update the course document in the batch
        batch.update(courseDocRef, updatedCourseData);

        // Check if years already exist and add new years to "Years" collection
        const yearsQuerySnapshot = await getDocs(collection(firestore, "Years"));
        const existingYears = yearsQuerySnapshot.docs.map(
          (doc) => doc.data().year
        );
        const newYears = yearData.filter(
          (year) => !existingYears.includes(year)
        );
        newYears.forEach((year) => {
          const yearRef = doc(collection(firestore, "Years"));
          batch.set(yearRef, { year });
        });

        const oldCourseYearQuery = query(
          collection(firestore, "courseyear"),
          where("course", "==", courseDoc.data().name)
        );
        const oldCourseYearDocs = await getDocs(oldCourseYearQuery);
        oldCourseYearDocs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        for (const year of yearData) {  
          const newCourseYearRef = doc(collection(firestore, "courseyear"));
          batch.set(newCourseYearRef, {
            course: updatedCourseData,
            year: year,
          });
        }
        
      } else {

        // Check if years already exist and add new years to "Years" collection
        const yearsQuerySnapshot = await getDocs(collection(firestore, "Years"));
        const existingYears = yearsQuerySnapshot.docs.map(
          (doc) => doc.data().year
        );
        const newYears = yearData.filter(
          (year) => !existingYears.includes(year)
        );
        newYears.forEach((year) => {
          const yearRef = doc(collection(firestore, "Years"));
          batch.set(yearRef, { year });
        });

        const oldCourseYearQuery = query(
          collection(firestore, "courseyear"),
          where("course", "==", courseDoc.data().name)
        );
        const oldCourseYearDocs = await getDocs(oldCourseYearQuery);
        oldCourseYearDocs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        for (const year of yearData) {  
          const newCourseYearRef = doc(collection(firestore, "courseyear"));
          batch.set(newCourseYearRef, {
            course: updatedCourseData,
            year: year,
          });
        }

      }
      await batch.commit();
      const updatedCoursesHash = JSON.parse(JSON.stringify(coursesHash));
      updatedCoursesHash[updatedCourseData.split(" ").join("_")] = yearData;
      setCoursesHash(updatedCoursesHash);
      setCourses((prevClasses) =>
        prevClasses.map((item) =>
          item.uid === editingClass.uid ? { uid: item.uid, name: updatedCourseData } : item
        )
      );
      setIsSheetOpen(false)
      setCourse("");
      setSelectedYears("");
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!course || selectedYears.length === 0 || errors.years) {
      setErrors({
        course: !course ? "Course name is required" : "",
        years: selectedYears.length === 0 ? "Select at least one year" : errors.years,
      });
      return;
    }
    setErrors({});
    await updateFirebase(
      editingClass.uid,
      course,
      selectedYears.map((year) => year.label)
    );
  }

  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const classesQuery = query(collection(firestore, 'Years'));
      const querySnapshot = await getDocs(classesQuery);
      const classesData = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      setYearsCollection(classesData);
    };
    const fetchCourses = async () => {
      const classesQuery = query(collection(firestore, 'courses'), orderBy("name", "desc"), limit(LIMIT));
      const querySnapshot = await getDocs(classesQuery);
      const classesData = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      setCourses(classesData);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstDoc(querySnapshot.docs[0]);
      setNoMore(querySnapshot.docs.length < LIMIT);
      setHasPrevious(false);
    }
    const fetchDataFromFirebase = async () => {
      const querySnapshot = await getDocs(collection(firestore, "courseyear"));
      const transformedData = {};
    
      querySnapshot.forEach((doc) => {
        const { course, year } = doc.data();
        transformedData[`${course.split(" ").join("_")}`] = transformedData[`${course.split(" ").join("_")}`] ? transformedData[`${course.split(" ").join("_")}`] : []
        transformedData[`${course.split(" ").join("_")}`].push(year)
      });
    
      console.log("transformedData", transformedData);
      setCoursesHash(transformedData);
    };
    fetchCourses()
    fetchDataFromFirebase();
    fetchClasses();
  }, []);

  const fetchMoreClasses = async () => {
    if (noMore) return;
    let nextQuery
    if (lastDoc) {
      nextQuery = query(collection(firestore, 'courses'), orderBy("name", "desc"), startAfter(lastDoc), limit(LIMIT));
    } else {
      nextQuery = query(collection(firestore, 'courses'), orderBy("name", "desc"), limit(LIMIT));
    }
    const querySnapshot = await getDocs(nextQuery);
    const newClasses = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    setCourses(newClasses);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setFirstDoc(querySnapshot.docs[0]);
    setNoMore(querySnapshot.docs.length < LIMIT);
    setHasPrevious(true);
    setPage((prevPage) => prevPage + 1)
  };

  const fetchPreviousClasses = async () => {
    if (!hasPrevious) return;
    let prevQuery;
    if (firstDoc) {
      prevQuery = query(collection(firestore, 'courses'), orderBy("name", "desc"), endBefore(firstDoc), limitToLast(LIMIT));
    } else {
      prevQuery = query(collection(firestore, 'courses'), orderBy("name", "desc"), limit(LIMIT));
    }
    const querySnapshot = await getDocs(prevQuery);
    const prevClasses = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    setCourses(prevClasses);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setFirstDoc(querySnapshot.docs[0]);
    setHasPrevious(querySnapshot.docs.length === LIMIT);
    setNoMore(false);
    setPage((prevPage) => prevPage - 1)
  };

  const createNewClass = async () => {
    try {
      const docRef = await addDoc(collection(firestore, 'classes'), {
        classname: newClassName,
        description: newClassDescription,
      });
      console.log('Document written with ID: ', docRef.id);
      setClasses((prevClasses) => [
        ...prevClasses,
        { uid: docRef.id, classname: newClassName, description: newClassDescription },
      ]);
      setNewClassName('');
      setNewClassDescription('');
      setIsSheetOpen(false);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const editClass = (classItem) => {
    setEditingClass(classItem);
    setCourse(classItem.name);
    let selected = coursesHash[classItem.name.split(" ").join("_")]?.map((item) => {
      return {
        value: item,
        label: item,
      }
    })
    setSelectedYears(selected);
    setIsSheetOpen(true);
  };

  const updateClass = async () => {
    try {
      const classRef = doc(firestore, 'classes', editingClass.uid);
      await updateDoc(classRef, {
        classname: newClassName,
        description: newClassDescription,
      });
      console.log('Document updated successfully');
      setClasses((prevClasses) =>
        prevClasses.map((item) =>
          item.uid === editingClass.uid ? { uid: item.uid, classname: newClassName, description: newClassDescription } : item
        )
      );
      setEditingClass(null);
      setNewClassName('');
      setNewClassDescription('');
      setIsSheetOpen(false);
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  const openDeleteDialog = (classItem) => {
    setClassToDelete(classItem);
    setIsDeleteDialogOpen(true);
  };

  const deleteClass = async () => {
    try {
      const batch = writeBatch(firestore);

      // Delete the course document from the 'courses' collection
      const courseRef = doc(firestore, "courses", classToDelete.uid);
      batch.delete(courseRef);

      // Get all documents from the 'courseyear' collection where the 'coursename' field matches the selected course
      const courseyearQuery = query(collection(firestore, "courseyear"), where("course", "==", classToDelete.name));
      const courseyearSnapshot = await getDocs(courseyearQuery);

      // Add each document from the 'courseyear' collection to the batch for deletion
      courseyearSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Commit the batch
      await batch.commit();
      setCourses((prevClasses) => prevClasses.filter((item) => item.uid !== classToDelete.uid));
      setClassToDelete(null);
      setIsDeleteDialogOpen(false);
      // Optionally, you can refetch the classes after deleting
      // fetchClasses();
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  return (
    <div className="">

        <div className='flex items-center justify-between'>
          <h1 className="text-3xl font-bold mb-4">Courses</h1>
          <div className="mb-4">
            {admin ?
            <Button onClick={() => {
              setIsSheetOpen(true);
              setEditingClass(null);
              setCourse("");
              setSelectedYears("");
            }}>Create New Course</Button> : null  }
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Years</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((classItem, i) => (
              <TableRow key={classItem.uid}>
                <TableCell>{page*Number(LIMIT)+i+1}.</TableCell>
                <TableCell>{classItem.name}</TableCell>
                <TableCell>{coursesHash[classItem.name.split(" ").join("_")]?.map((item) => (
                  <>
                    <Button key={item} onClick={() => router.push(`projects?q_course_id=${classItem.uid}&q_year=${item}`)} className="mr-2">
                      {item}
                    </Button>
                  </>
                ))}</TableCell>
                <TableCell>
                  {admin ? 
                  <>
                    <Button onClick={() => editClass(classItem)} className="mr-2">
                      Edit
                    </Button>
                    <Button onClick={() => openDeleteDialog(classItem)} variant="destructive">
                      Delete
                    </Button>
                  </>: null }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <Button onClick={fetchPreviousClasses} disabled={!hasPrevious || page == 0} className="mr-2">
            Previous
          </Button>
          <Button onClick={fetchMoreClasses} disabled={noMore}>
            {noMore ? 'No more classes' : 'Next'}
          </Button>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <SheetHeader>{editingClass ? 'Edit Course' : 'Create New Course'}</SheetHeader>
            <form
              onSubmit={editingClass ? handleUpdate : handleSubmit}
              className="bg-white"
            >
              <div className="mb-4 mt-4">
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
              <div className="mb-4">
                <CreatableSelect
                  options={yearsCollection.map((year) => ({
                    value: year.year,
                    label: year.year,
                  }))}
                  value={selectedYears}
                  onChange={handleChange}
                  isMulti={true}
                  className={`shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.course ? "border-red-500" : "" // Apply red border on error
                  }`}
                />
                {errors.years && (
                  <p className="text-red-500 text-sm">{errors.years}</p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#0f172a] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
            {/* <div className="flex justify-end">
              <Button onClick={editingClass ? updateClass : createNewClass}>
                {editingClass ? 'Update' : 'Create'}
              </Button>
            </div> */}
          </SheetContent>
        </Sheet>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <div className="mb-4">Are you sure you want to delete this class?</div>
            <div className="flex justify-end">
              <Button onClick={() => setIsDeleteDialogOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={deleteClass} variant="destructive">
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}