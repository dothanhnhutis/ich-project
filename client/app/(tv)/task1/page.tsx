import React from "react";

const Task1Page = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col relative h-screen overflow-hidden">
        <div className="">header</div>
        <div className="h-full overflow-y-scroll">
          <div className="h-[500px] bg-green-100">1</div>
          <div className="h-[500px] bg-blue-100">2</div>
          <div className="h-[500px] bg-red-100">3</div>
          <div className="h-[500px] bg-sky-100">4</div>
        </div>
      </div>
      <div className="flex flex-col relative h-screen overflow-hidden">
        <div className="">header</div>
        <div className="h-full overflow-y-scroll">
          <div className="h-[500px] bg-green-100">1</div>
          <div className="h-[500px] bg-blue-100">2</div>
          <div className="h-[500px] bg-red-100">3</div>
          <div className="h-[500px] bg-sky-100">4</div>
        </div>
      </div>
    </div>
  );
};

export default Task1Page;
