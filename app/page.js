import Drawer from "@/components/drawer/Drawer";

export default function Home() {
  return (
    <main className="flex flex-row ">
      <div className="w-[380px]">
          <Drawer />
      </div>
      <div className="mt-[100px] h-[590px] w-[780px]">
        {" "}
        <img
          src="/ATU_LOGO__OUTLINE_GR-YW_VERT.png"
          alt="Logo"
          className="h-[590px] w-[780px] ml-[180px]"
        />
      </div>
    </main>
  );
}
