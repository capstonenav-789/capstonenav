"use client"
import { getDocs, collection, query, limit, startAfter, startAt, addDoc, doc, updateDoc, deleteDoc, limitToLast, endBefore } from 'firebase/firestore';
import { firestore } from "@/firebase";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LIMIT = 10;

export default function ProjectName() {
  const [classes, setClasses] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [noMore, setNoMore] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [editingClass, setEditingClass] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [courses, setCourses] = useState([])
  const [selectedCourses, setSelectedCourses] = useState("")
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const classesQuery = query(collection(firestore, 'projectname'), limit(LIMIT));
      const querySnapshot = await getDocs(classesQuery);
      const classesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClasses(classesData);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstDoc(querySnapshot.docs[0]);
      setNoMore(querySnapshot.docs.length < LIMIT);
      setHasPrevious(false);
    };
    const fetchCourse = async () => {
      try {
        const projectsCollection = query(collection(firestore, 'courses'));
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchClasses();
    fetchCourse();
  }, []);

  const fetchMoreClasses = async () => {
    if (noMore) return;
    const nextQuery = query(collection(firestore, 'projectname'), startAfter(lastDoc), limit(LIMIT));
    const querySnapshot = await getDocs(nextQuery);
    const newClasses = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setClasses((prevClasses) => [...prevClasses, ...newClasses]);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setFirstDoc(querySnapshot.docs[0]);
    setNoMore(querySnapshot.docs.length < LIMIT);
    setHasPrevious(true);
  };

  const fetchPreviousClasses = async () => {
    if (!hasPrevious) return;
    const prevQuery = query(collection(firestore, 'projectname'), endBefore(firstDoc), limitToLast(LIMIT));
    const querySnapshot = await getDocs(prevQuery);
    const prevClasses = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setClasses(prevClasses);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setFirstDoc(querySnapshot.docs[0]);
    setHasPrevious(querySnapshot.docs.length === LIMIT);
    setNoMore(false);
  };

  const createNewClass = async () => {
    try {
      console.log("selectedCourses",selectedCourses)
      let course_name = courses.filter((item) => item.id === selectedCourses)[0]
      console.log("course_name", course_name)
      const docRef = await addDoc(collection(firestore, 'projectname'), {
        name: newClassName,
        course_id: selectedCourses,
        course_name: course_name.name
      });
      console.log('Document written with ID: ', docRef.id);
      setClasses((prevClasses) => [
        ...prevClasses,
        { id: docRef.id, name: newClassName, course_id: selectedCourses, course_name: course_name.name },
      ]);
      setNewClassName('');
      setSelectedCourses('')
      setIsSheetOpen(false);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const editClass = (classItem) => {
    setEditingClass(classItem);
    setNewClassName(classItem.name);
    setSelectedCourses(classItem.course_id)
    setIsSheetOpen(true);
  };

  const updateClass = async () => {
    try {
      let course_name = courses.filter((item) => item.id === selectedCourses)[0]
      const classRef = doc(firestore, 'projectname', editingClass.id);
      await updateDoc(classRef, {
        name: newClassName,
        course_id: selectedCourses,
        course_name: course_name.name
      });
      console.log('Document updated successfully');
      setClasses((prevClasses) =>
        prevClasses.map((item) =>
          item.uid === editingClass.uid ? { id: item.uid, name: newClassName, course_id: selectedCourses, course_name: course_name.name } : item
        )
      );
      setEditingClass(null);
      setNewClassName('');
      setSelectedCourses('');
      setIsSheetOpen(false);
      // Optionally, you can refetch the classes after updating
      // fetchClasses();
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
      const classRef = doc(firestore, 'projectname', classToDelete.id);
      await deleteDoc(classRef);
      console.log('Document deleted successfully');
      setClasses((prevClasses) => prevClasses.filter((item) => item.id !== classToDelete.id));
      setClassToDelete(null);
      setIsDeleteDialogOpen(false);
      // Optionally, you can refetch the classes after deleting
      // fetchClasses();
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const handleSelectChange = (value) => {
    setSelectedCourses(value);
  };

  return (
    <div className="">

        <div className='flex items-center justify-between'>
          <h1 className="text-3xl font-bold mb-4">Project Names</h1>
          <div className="mb-4">
            <Button onClick={() => setIsSheetOpen(true)}>Create New Project Name</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.name}</TableCell>
                <TableCell>{classItem.course_name}</TableCell>
                <TableCell>
                  <Button onClick={() => editClass(classItem)} className="mr-2">
                    Edit
                  </Button>
                  <Button onClick={() => openDeleteDialog(classItem)} variant="destructive">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <Button onClick={fetchPreviousClasses} disabled={!hasPrevious} className="mr-2">
            Previous
          </Button>
          <Button onClick={fetchMoreClasses} disabled={noMore}>
            {noMore ? 'No more project names' : 'Next'}
          </Button>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <SheetHeader>{editingClass ? 'Edit Class' : 'Create New Class'}</SheetHeader>
            <div className="mb-4 mt-4">
              <Input
                placeholder="Class Name"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Select value={selectedCourses} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button onClick={editingClass ? updateClass : createNewClass}>
                {editingClass ? 'Update' : 'Create'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <div className="mb-4">Are you sure you want to delete this Project Name?</div>
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