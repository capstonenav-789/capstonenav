"use client"
import { getDocs, collection, query, limit, startAfter, startAt, addDoc, doc, updateDoc, where, orderBy, endBefore, limitToLast, deleteDoc } from 'firebase/firestore';
import { firestore } from "@/firebase";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, usePathname } from 'next/navigation';

const LIMIT = 3;

export default function Projects() {

  const searchParams = useSearchParams();
  const q_project_id = searchParams.get('q_project_id');
  const q_class_id = searchParams.get('q_class_id');
  const q_course_id = searchParams.get('q_course_id');
  const q_year = searchParams.get('q_year');
  const q_student_id = searchParams.get('q_student_id');
  const rel = searchParams.get('rel');

  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [noMore, setNoMore] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectNames, setProjectNames] = useState([]);
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [abstractName, setAbstractName] = useState("");
  const [description, setDescription] = useState('');
  const [absLink, setAbsLink] = useState('')
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [page, setPage] = useState(0)
  const [selectedProjectName, setSelectedProjectName ] = useState(q_project_id ? q_project_id : "default")
  const [selectedClass, setSelectedClass ] = useState(q_class_id ? q_class_id : "default")
  const [selectedCourse, setSelectedCourse ] = useState(q_course_id ? q_course_id : "default")
  const [selectedUser, setSelectedUser ] = useState(q_student_id ? q_student_id : "default")
  const [selectedYear, setSelectedYear ] = useState(q_year ? Number(q_year) : "default")
  const homeData = useSelector((state) => state.home);

  const router = useRouter();
  const pathname = usePathname()
  
  useEffect(() => {
    const fetchProjects = async () => {
      console.log("entered")
      const projectsCollection = collection(firestore, 'projects');
      let q = null;
  
      const filters = [];
  
      if (q_project_id) filters.push(where('proj_id', '==', q_project_id));
      if (q_class_id) filters.push(where('class_id', '==', q_class_id));
      if (q_student_id) filters.push(where('student_id', '==', q_student_id));
      if (q_course_id) filters.push(where('course_id', '==', q_course_id));
      if (q_year) filters.push(where('year', '==', q_year));

      if (filters.length > 0) {
        if (rel) {
          if (rel == "next") {
            if (lastDoc != undefined) {
              q = query(projectsCollection, ...filters, orderBy("abstractName", "desc"), startAfter(lastDoc), limit(LIMIT));
            } else {
              q = query(projectsCollection, ...filters, orderBy("abstractName", "desc"), limit(LIMIT));
            }
            console.log("query",q)
          } else if (rel == "prev") {
            if (firstDoc != undefined) {
              q = query(projectsCollection, ...filters, orderBy("abstractName", "desc"), endBefore(firstDoc), limitToLast(LIMIT));
            } else {
              q = query(projectsCollection, ...filters, orderBy("abstractName", "desc"), limitToLast(LIMIT));
            }
          }
        } else {
          q = query(projectsCollection, ...filters, orderBy("abstractName", "desc"), limit(LIMIT));
        }
      } else {
        if (rel) {
          if (rel == "next") {
            if (lastDoc != undefined) {
              q = query(projectsCollection, orderBy("abstractName", "desc"), startAfter(lastDoc), limit(LIMIT));
            } else {
              q = query(projectsCollection, orderBy("abstractName", "desc"), limit(LIMIT));
            }
          } else if (rel == "prev") {
            if (firstDoc != undefined) {
              q = query(projectsCollection, orderBy("abstractName", "desc"), endBefore(firstDoc), limitToLast(LIMIT));
            } else {
              q = query(projectsCollection, orderBy("abstractName", "desc"), limitToLast(LIMIT));
            }
          }
        } else {
          q = query(projectsCollection, orderBy("abstractName", "desc"), limit(LIMIT));
        }
      }
      console.log("query",q)
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      if (rel) {
        setNoMore(rel == "next" ? querySnapshot.docs.length < LIMIT : false);
        // setHasPrevious(rel == "next" ? true : querySnapshot.docs.length === LIMIT);
      } else {
        setNoMore( querySnapshot.docs.length < LIMIT );
        // setHasPrevious(false);
      }
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstDoc(querySnapshot.docs[0]);
      setProjects(projects);
    };
  
    fetchProjects();
  }, [q_project_id, q_class_id, q_course_id, q_student_id, q_year, rel, page]);

  useEffect(() => {
    const fetchProjects = async () => {
      const classesQuery = query(collection(firestore, 'projects'), limit(LIMIT));
      const querySnapshot = await getDocs(classesQuery);
      const classesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(classesData);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstDoc(querySnapshot.docs[0]);
      setNoMore(querySnapshot.docs.length < LIMIT);
      setHasPrevious(false);
    };
    const fetchClasses = async () => {
      try {
        const projectsCollection = query(collection(firestore, 'classes'));
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("fetchClasses",projectsList)
        setClasses(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchProjectNames = async () => {
      try {
        const projectsCollection = query(collection(firestore, 'projectname'));
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("projectsList",projectsList)
        setProjectNames(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const projectsCollection = query(collection(firestore, 'courses'));
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("fetchCourses",projectsList)
        setCourses(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const projectsCollection = query(collection(firestore, 'users'));
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("fetchStudents",projectsList)
        setUsers(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchYears = async () => {
      try {
        const projectsCollection = query(collection(firestore, 'Years'));
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map((doc) => Number(doc.data().year)).sort((a, b) => b - a);
        console.log("fetchYear",projectsList)
        setYears(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    // fetchProjects();
    fetchProjectNames();
    fetchClasses();
    fetchCourses();
    fetchStudents();
    fetchYears();
  }, []);

  const fetchMoreClasses = () => {
    if (noMore) return;
    router.push(pathname + '?' + createQueryString('rel', 'next'))
    setPage((prevPage) => prevPage + 1)
  };

  const fetchPreviousClasses = () => {
    if (page == 0) return;
    router.push(pathname + '?' + createQueryString('rel', "prev"))
    setPage((prevPage) => prevPage - 1)
  };

  const createNewClass = async () => {
    try {
      let course = projectNames.filter((item) => item.id === selectedProject)[0];
      const docRef = await addDoc(collection(firestore, 'projects'), {
        projectname: course.name,
        proj_id: selectedProject,
        abstractName: abstractName,
        absLink: absLink,
        description: description,
        course: course.course_name,
        course_id: course.course_id,
        class_id: homeData?.class_id,
        class_name: homeData?.class_name,
        student_id: homeData?.student_uid,
        student_name: homeData?.name,
        year: homeData?.year,
      });
      console.log('Document written with ID: ', docRef.id);
      setSelectedProjectName('default')
      setSelectedClass('default')
      setSelectedCourse('default')
      setSelectedUser('default')
      setSelectedYear('default')
      setSelectedProject("");
      setAbstractName('');
      setDescription('');
      setAbsLink('')
      setIsSheetOpen(false);
      router.push(pathname)
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const editClass = (classItem) => {
    setEditingProject(classItem);
    setSelectedProject(classItem.proj_id);
    setAbstractName(classItem.abstractName);
    setDescription(classItem.absLink);
    setAbsLink(classItem.description)
    setIsSheetOpen(true);
  };

  const updateClass = async () => {
    try {
      let course = projectNames.filter((item) => item.id === selectedProject)[0];
      const classRef = doc(firestore, 'projects', editingProject.id);
      await updateDoc(classRef, {
        projectname: course.name,
        proj_id: selectedProject,
        abstractName: abstractName,
        absLink: absLink,
        description: description,
        course: course.course_name,
        course_id: course.course_id,
        class_id: homeData?.class_id,
        class_name: homeData?.class_name,
        student_id: homeData?.student_uid,
        student_name: homeData?.name,
        year: homeData?.year,
      });
      console.log('Document updated successfully');
      setProjects((prevClasses) =>
        prevClasses.map((item) =>
          item.id === editingProject.id ? { id: classRef.id, projectname: course.name, proj_id: selectedProject, abstractName: abstractName, absLink: absLink, description: description, course: course.course_name, course_id: course.course_id, class_id: homeData?.class_id, class_name: homeData?.class_name, student_id: homeData?.student_uid, student_name: homeData?.name, year: homeData?.year } : item
        )
      );
      setEditingProject(null);
      setSelectedProjectName('default')
      setSelectedClass('default')
      setSelectedCourse('default')
      setSelectedUser('default')
      setSelectedYear('default')
      setSelectedProject("");
      setAbstractName('');
      setDescription('');
      setAbsLink('')
      setIsSheetOpen(false);
      // Optionally, you can refetch the classes after updating
      // fetchClasses();
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  const openDeleteDialog = (classItem) => {
    setProjectToDelete(classItem);
    setIsDeleteDialogOpen(true);
  };

  const deleteClass = async () => {
    try {
      const classRef = doc(firestore, 'projects', projectToDelete.id);
      await deleteDoc(classRef);
      console.log('Document deleted successfully');
      setProjects((prevClasses) => prevClasses.filter((item) => item.id !== projectToDelete.id));
      setProjectToDelete(null);
      setIsDeleteDialogOpen(false);
      // Optionally, you can refetch the classes after deleting
      // fetchClasses();
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const handleSelectChange = (value) => {
    setSelectedProject(value);
  };

  const createQueryString = useCallback(
    (name, value, del = false) => {
      const params = new URLSearchParams(searchParams.toString())
      if(value != "default") {
        params.set(name, value)
      } else {
        params.set(name, "")
      }
      if (del) {
        params.delete("rel")
      } 
      return params.toString()
    },
    [searchParams]
  )

  const handleProjectNameChange = (value) => {
    setSelectedProjectName(value)
    router.push(pathname + '?' + createQueryString('q_project_id', value, true))
    setPage(0);
  }

  const handleClassChange = (value) => {
    setSelectedClass(value)
    router.push(pathname + '?' + createQueryString('q_class_id', value, true))
    setPage(0);
  }

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    router.push(pathname + '?' + createQueryString('q_course_id', value, true))
    setPage(0);
  }

  const handleUserChange = (value) => {
    setSelectedUser(value)
    router.push(pathname + '?' + createQueryString('q_student_id', value, true))
    setPage(0);
  }

  const handleYearChange = (value) => {
    setSelectedYear(value)
    router.push(pathname + '?' + createQueryString('q_year', value, true))
    setPage(0);
  }

  console.log("page", hasPrevious, firstDoc)

  return (
    <div className="">
      <div className='flex items-center justify-between'>
        <h1 className="text-3xl font-bold mb-4">Project Names</h1>
        <div className="mb-4">
          <Button onClick={() => setIsSheetOpen(true)}>Submit New Project</Button>
        </div>
      </div>
      <div className='flex items-center justify-between gap-4 mb-6'>
        <Select value={selectedProjectName} onValueChange={handleProjectNameChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter By Project Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"default"}>
              Filter By Project Name
            </SelectItem>
            {projectNames.map((proj) => (
              <SelectItem key={proj.id} value={proj.id}>
                {proj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedClass} onValueChange={handleClassChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter By Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"default"}>
              Filter By Classes
            </SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.classname}
              </SelectItem>
            ))}
          </SelectContent>
          </Select>
          <Select value={selectedCourse} onValueChange={handleCourseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter By Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"default"}>
                Filter By Courses
              </SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedUser} onValueChange={handleUserChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter By Student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"default"}>
                Filter By Student
              </SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter By Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"default"}>
                Filter By Year
              </SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>
      <div className='overflow-auto	max-w-full'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Abstract Name</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Abstract Link</TableHead>
              <TableHead>Abstract Description</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>year</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((classItem,i) => (
              <TableRow key={classItem.id}>
                <TableCell>{page*Number(LIMIT)+i+1}.</TableCell>
                <TableCell>{classItem.abstractName}</TableCell>
                <TableCell>{classItem.projectname}</TableCell>
                <TableCell>{classItem.absLink}</TableCell>
                <TableCell>{classItem.description}</TableCell>
                <TableCell>{classItem.course}</TableCell>
                <TableCell>{classItem.class_name}</TableCell>
                <TableCell>{classItem.year}</TableCell>
                <TableCell>{classItem.student_name}</TableCell>
                <TableCell>
                  <Button onClick={() => editClass(classItem)} className="mr-2 mb-2">
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
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={fetchPreviousClasses} disabled={page == 0} className="mr-2">
          Previous
        </Button>
        <Button onClick={fetchMoreClasses} disabled={noMore}>
          {noMore ? 'No more projects' : 'Next'}
        </Button>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>{editingProject ? 'Edit Class' : 'Create New Class'}</SheetHeader>
          <div className="mb-4 mt-4">
            <Select value={selectedProject} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projectNames.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Input
              placeholder="Abstract Name"
              value={abstractName}
              onChange={(e) => setAbstractName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              placeholder="Abstract Link"
              value={absLink}
              onChange={(e) => setAbsLink(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={editingProject ? updateClass : createNewClass}>
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <div className="mb-4">Are you sure you want to delete this Project?</div>
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