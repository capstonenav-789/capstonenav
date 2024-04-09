import Drawer from '@/components/drawer/Drawer'
import React from 'react'

const StudentNames = () => {
  return (
    <main className="flex flex-row ">
    <div className="w-[380px]">
    <Drawer/>
</div>
    <div className='flex justify-center items-center'> <h2> StudentNames page</h2></div>
    </main>
  )
}

export default StudentNames