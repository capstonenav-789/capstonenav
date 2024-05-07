"use client"
import { getDocs, collection, query, limit, startAfter, startAt, addDoc, doc, updateDoc, deleteDoc, endBefore, limitToLast, orderBy } from 'firebase/firestore';
import { firestore } from "@/firebase";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
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

  const router = useRouter();

  const { admin, manager, student } = useCheckUserRole(['admin', 'studentadmin', 'student']);

  useEffect(() => {
    const fetchClasses = async () => {
      const classesQuery = query(collection(firestore, 'classes'), orderBy("classname", "desc"), limit(LIMIT));
      const querySnapshot = await getDocs(classesQuery);
      const classesData = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      setClasses(classesData);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstDoc(querySnapshot.docs[0]);
      setNoMore(querySnapshot.docs.length < LIMIT);
      setHasPrevious(false);
    };
    fetchClasses();
  }, []);

  const fetchMoreClasses = async () => {
    if (noMore) return;
    let nextQuery
    if (lastDoc) {
      nextQuery = query(collection(firestore, 'classes'), orderBy("classname", "desc"), startAfter(lastDoc), limit(LIMIT));
    } else {
      nextQuery = query(collection(firestore, 'classes'), orderBy("classname", "desc"), limit(LIMIT));
    }
    const querySnapshot = await getDocs(nextQuery);
    const newClasses = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    setClasses(newClasses);
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

      prevQuery = query(collection(firestore, 'classes'), orderBy("classname", "desc"), endBefore(firstDoc), limitToLast(LIMIT));
    } else {
      prevQuery = query(collection(firestore, 'classes'), orderBy("classname", "desc"), limit(LIMIT));
    }
    const querySnapshot = await getDocs(prevQuery);
    const prevClasses = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    setClasses(prevClasses);
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
    setNewClassName(classItem.classname);
    setNewClassDescription(classItem.description);
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
      const classRef = doc(firestore, 'classes', classToDelete.uid);
      await deleteDoc(classRef);
      console.log('Document deleted successfully');
      setClasses((prevClasses) => prevClasses.filter((item) => item.uid !== classToDelete.uid));
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
          <h1 className="text-3xl font-bold mb-4">Classes</h1>
          <div className="mb-4">
            { admin ? 
            <Button onClick={() => setIsSheetOpen(true)}>Create New Class</Button> : null }
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.uid}>
                <TableCell>{classItem.classname}</TableCell>
                <TableCell>{classItem.description}</TableCell>
                <TableCell>
                  <Button onClick={() => router.push(`/student?class_id=${classItem.uid}&&class_name=${classItem.classname}`)} className="mr-2">
                    Show
                  </Button>
                  { admin ? 
                  <>
                    <Button onClick={() => editClass(classItem)} className="mr-2">
                      Edit
                    </Button>
                    <Button onClick={() => openDeleteDialog(classItem)} variant="destructive">
                      Delete
                    </Button>
                  </> : null}
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
            <SheetHeader>{editingClass ? 'Edit Class' : 'Create New Class'}</SheetHeader>
            <div className="mb-4 mt-4">
              <Input
                placeholder="Class Name"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Input
                placeholder="Class Description"
                value={newClassDescription}
                onChange={(e) => setNewClassDescription(e.target.value)}
              />
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