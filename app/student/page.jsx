"use client"
import { firestore, auth } from '@/firebase';
import { collection, query, where, getDocs, doc, addDoc, updateDoc, deleteDoc, setDoc,  limit, startAfter } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LIMITS = 10;

export default function Student() {
  const [students, setStudents] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [noMore, setNoMore] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentRole, setNewStudentRole] = useState('student');
  const [newStudentId, setNewStudentId] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const searchParams = useSearchParams();
  const class_id = searchParams.get('class_id');
  const class_name = searchParams.get('class_name');

  useEffect(() => {
    const fetchStudents = async () => {
      if (!class_id) return;

      try {
        const usersQuery = query(
          collection(firestore, 'users'),
          where('role', 'in', ['student', 'studentadmin']),
          where('class_id', '==', class_id),
          limit(LIMITS)
        );
        const querySnapshot = await getDocs(usersQuery);
        const studentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("studentsData",studentsData)
        setStudents(studentsData);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setFirstDoc(querySnapshot.docs[0]);
        setNoMore(querySnapshot.docs.length < LIMITS);
        setHasPrevious(false);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [class_id]);

  const fetchMoreStudents = async () => {
    if (noMore) return;
    const nextQuery = query(
      collection(firestore, 'users'),
      where('role', 'in', ['student', 'studentadmin']),
      where('class_id', '==', class_id),
      startAfter(lastDoc),
      limit(LIMITS)
    );
    const querySnapshot = await getDocs(nextQuery);
    const newStudents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents((prevStudents) => [...prevStudents, ...newStudents]);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setFirstDoc(querySnapshot.docs[0]);
    setNoMore(querySnapshot.docs.length < LIMITS);
    setHasPrevious(true);
  };

  const fetchPreviousStudents = async () => {
    if (!hasPrevious) return;
    const prevQuery = query(
      collection(firestore, 'users'),
      where('role', 'in', ['student', 'studentadmin']),
      where('class_id', '==', class_id),
      endBefore(firstDoc),
      limitToLast(LIMITS)
    );
    const querySnapshot = await getDocs(prevQuery);
    const prevStudents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(prevStudents);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setFirstDoc(querySnapshot.docs[0]);
    setHasPrevious(querySnapshot.docs.length === LIMITS);
    setNoMore(false);
  };

  const editStudent = (student) => {
    setEditingStudent(student);
    setNewStudentName(student.name);
    setNewStudentEmail(student.email);
    setNewStudentRole(student.role);
    setNewStudentId(student.student_id);
    setIsSheetOpen(true);
  };

  const updateStudent = async () => {
    try {
      const studentRef = doc(firestore, 'users', editingStudent.id);
      await updateDoc(studentRef, {
        name: newStudentName,
        email: newStudentEmail,
        role: newStudentRole,
        student_id: newStudentId,
        class_id: class_id
      });
      console.log('Student updated successfully');
      setStudents((prevStudents) =>
        prevStudents.map((item) =>
          item.id === editingStudent.id ? { id: item.id, name: newStudentName, email: newStudentEmail, role: newStudentRole, student_id: newStudentId, } : item
        )
      );
      setEditingStudent(null);
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentRole('student');
      setNewStudentId('');
      setIsSheetOpen(false);
      // Optionally, you can refetch the students after updating
      // fetchStudents();
    } catch (e) {
      console.error('Error updating student: ', e);
    }
  };

  const openDeleteDialog = (student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const deleteStudent = async () => {
    try {
      const studentRef = doc(firestore, 'users', studentToDelete.id);
      await deleteDoc(studentRef);
      console.log('Student deleted successfully');
      setStudents((prevStudents) => prevStudents.filter((item) => item.id !== studentToDelete.id));
      setStudentToDelete(null);
      setIsDeleteDialogOpen(false);
      // Optionally, you can refetch the students after deleting
      // fetchStudents();
    } catch (e) {
      console.error('Error deleting student: ', e);
    }
  };

  const createStudent = async () => {
    try {
      // Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newStudentEmail,
        'Password123!'
      );
      const userId = userCredential.user.uid;
  
      // Create a new document in the 'users' collection of Firestore
      const newStudentData = {
        name: newStudentName,
        email: newStudentEmail,
        role: newStudentRole,
        student_id: newStudentId,
        class_id: class_id,
      };
      const docRef = doc(firestore, 'users', userId);
      await setDoc(docRef, newStudentData);
      console.log('Student created successfully');
      setStudents((prevStudents) => [
        ...prevStudents,
        { id: userId, 
          name: newStudentName,
          email: newStudentEmail,
          role: newStudentRole,
          student_id: newStudentId,
        }]);
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentRole('student');
      setNewStudentId('');
      setIsSheetOpen(false);
      // Optionally, you can refetch the students after creating a new one
      // fetchStudents();
    } catch (e) {
      console.error('Error creating student: ', e);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold mb-4">Students for Class: {class_name}</h1>
        <div className="mb-4">
          <Button onClick={() => {
            setEditingStudent(null);
            setNewStudentName('');
            setNewStudentEmail('');
            setNewStudentRole('student');
            setNewStudentId('');
            setIsSheetOpen(true)
          }}>Create New Student</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.role}</TableCell>
              <TableCell>{student.student_id}</TableCell>
              <TableCell>
                <Button onClick={() => router.push(`/project?class_id=${class_id}&student_id=${student.id}`)} className="mr-2">
                  Show
                </Button>
                <Button onClick={() => editStudent(student)} className="mr-2">
                  Edit
                </Button>
                <Button onClick={() => openDeleteDialog(student)} variant="destructive">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Button onClick={fetchPreviousStudents} disabled={!hasPrevious} className="mr-2">
          Previous
        </Button>
        <Button onClick={fetchMoreStudents} disabled={noMore || lastDoc === null}>
          {noMore ? 'No more students' : 'Next'}
        </Button>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>{editingStudent ? 'Edit Student' : 'Create New Student'}</SheetHeader>
            <div className="mb-4 mt-4">
              <Input
                placeholder="Student Name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                placeholder="Student Email"
                type="email"
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Select value={newStudentRole} onValueChange={setNewStudentRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="student admin">Student Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Input
                placeholder="Student ID"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={editingStudent ? updateStudent : createStudent}>
                {editingStudent ? 'Update' : 'Create'}
              </Button>
            </div>
        </SheetContent>
      </Sheet>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <div className="mb-4">Are you sure you want to delete this student?</div>
          <div className="flex justify-end">
            <Button onClick={() => setIsDeleteDialogOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={deleteStudent} variant="destructive">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )};