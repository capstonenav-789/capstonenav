import Drawer from "@/components/drawer/Drawer";
import React from "react";

const AboutProfessor = () => {
  return (
      <div>
        <div className="flex justify-center items-center mt-[80px]">
          <div className="rounded-full">
            <img
                src="/proffeseer.jpg"
                alt="Logo"
                className="h-[450px] w-[340px] ml-[100px] rounded-full"
            />
          </div>
          <div className="p-20">
            <h2 className="text-5xl font-bold">
              Dr. Bandi AjayDevagan
            </h2>
            <p className="text-xl font-thin max-w-[550px] mt-10">
              A computer science professor is a faculty member at a college or
              university who teaches computer science courses. They may also
              conduct research in the field of computer science and publish their
              findings in academic journals. Computer science professors typically
              have a Ph.D. in computer science or a related field. They must also
              have strong teaching skills and be able to communicate complex
              technical concepts to students in a clear and concise manner. In
              addition to teaching, computer science professors may also be
              involved in other activities such as advising students, conducting
              research, and serving on committees. They may also work with
              industry partners to develop new technologies or to solve real-world
              problems.
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-xl font-semibold text-center mb-1 mr-4">Contact Professer</p>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-black"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          >
            <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 010-2h9.586l-4.293-4.293A1 1 0 0110 3z"
            clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
  );
};

export default AboutProfessor;
