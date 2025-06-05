// src/pages/AboutUs.jsx
import React from "react";

const teamMembers = [
  {
    name: "Seng Vannak",
    role: "Advisor",
    photo: "/avatar.png",
  },
  {
    name: "Lao Thomorn",
    role: "Developer",
    photo: "/avatar.png",
  },
  {
    name: "Ean Dara",
    role: "Developer",
    photo: "/avatar.png",
  },
];

const AboutUs = () => {
  return (
    <div className="font-sans text-gray-800 pt-[30px]">
      <div
        className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px] bg-cover bg-center flex items-start justify-start px-4 sm:px-6 md:px-10 pt-[20px] sm:pt-[30px] md:pt-[40px] rounded-[10px] mx-2 sm:mx-4"
        style={{
          backgroundImage: "url('/Tumnail.png')",
        }}
      >
        {/* <h1 className="text-white text-3xl md:text-5xl font-bold bg-black bg-opacity-40 p-15 rounded-lg text-buttom">
          About Us
        </h1> */}
      </div>

      {/* About Us Description */}
      <section className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-start">
          {/* Text Section */}
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">About Us</h2>
            <p className="mb-4 text-sm sm:text-base leading-relaxed">
              Id ac non, semper turpis maecenas. Convallis tempor fringilla
              quisque arcu, dictum. Vitae cursus vel netus tincidunt vitae.
              Malesuada velit, at mattis adipiscing quisque tristique id magna.
              Blandit porta sit nam magna sit. Turpis vestibulum facilisis
              placerat habitant gravida eget. Lacus pretium, arcu non adipiscing
              sed faucibus semper eget tempor.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
              dictum et in feugiat. Platea in diam, est congue. Posuere sapien
              morbi augue ultrices. Et facilisi orci sollicitudin placerat lacus
              lacus nibh. Egestas semper massa viverra massa proin in morbi
              placerat. Pharetra nec, est non integer nisi, ut faucibus.
            </p>
          </div>

          {/* Group Photo with Hover Animation */}
          <div className="w-full sm:w-[280px] md:w-[350px] overflow-hidden rounded-xl mx-auto lg:mx-0">
            <img
              src="src/assets/avatar.png"
              alt="Our Group"
              className="rounded-xl shadow-lg w-full transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:brightness-110"
            />
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-10 text-center sm:text-left">
            Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="text-center bg-darkgrey shadow-md p-3 sm:p-4 rounded-lg w-full max-w-[240px] sm:max-w-[260px] transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 hover:-translate-y-2 group"
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="rounded-lg w-full h-48 sm:h-56 md:h-60 object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-1 group-hover:brightness-110 group-hover:contrast-110"
                  />
                </div>
                <h4 className="mt-3 sm:mt-4 font-semibold text-sm sm:text-base transition-colors duration-300 group-hover:text-blue-600">
                  {member.name}
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm transition-colors duration-300 group-hover:text-gray-700">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
