// src/pages/AboutUs.jsx
import React from "react";

const teamMembers = [
  {
    name: "Ky SokLay",
    role: "Advisor",
    photo: "/avatar.png",
  },
  {
    name: "Lao Thomorn",
    role: "Developer",
    photo: "/avatar.png",
  },
];

const AboutUs = () => {
  return (
    <div className="font-sans text-gray-800 pt-[30px]">
      <div
        className="w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[800px] bg-cover bg-center bg-no-repeat flex items-start justify-start px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 pt-[15px] xs:pt-[20px] sm:pt-[25px] md:pt-[30px] lg:pt-[35px] xl:pt-[40px] rounded-[8px] sm:rounded-[10px] mx-1 xs:mx-2 sm:mx-3 md:mx-4 transition-all duration-300 ease-in-out"
        style={{
          backgroundImage: "url('/Tumnail.png')",
          backgroundPosition: "center center",
          backgroundSize: "cover",
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
              <strong>Meakutes-Khmer</strong> is a tourism promotion website
              developed as a final-year capstone project by a Year 4 student
              from the <strong>Royal University of Phnom Penh (RUPP)</strong>,
              majoring in{" "}
              <strong>Information Technology Engineering (ITE)</strong>, under
              the guidance of <strong>Doctor Ky Soklay</strong>.
            </p>

            <p className="mb-4 text-sm sm:text-base leading-relaxed">
              This platform was created with a dual purpose: to apply advanced
              technical skills learned during four years of academic study, and
              to actively contribute to the promotion and revitalization of
              Cambodia's tourism industry—especially after it was heavily
              impacted by global events in recent years.
            </p>

            <p className="mb-4 text-sm sm:text-base leading-relaxed">
              The website serves as a digital gateway to explore the natural
              wonders, cultural landmarks, and hidden gems of Cambodia. With an
              intuitive and responsive user interface, Meakutes-Khmer provides
              visitors with:
            </p>

            <ul className="list-disc list-inside mb-4 text-sm sm:text-base leading-relaxed">
              <li>Destination guides across all provinces of Cambodia</li>
              <li>Real travel experiences and stories shared by users</li>
              <li>
                Ratings and recommendations to help users choose their next
                adventure
              </li>
              <li>
                User-generated content such as trip posts, reviews, and photos
              </li>
              <li>
                Search and filter tools based on location, popularity, or travel
                category
              </li>
            </ul>

            <p className="mb-4 text-sm sm:text-base leading-relaxed">
              This project reflects my passion for technology, innovation, and
              national pride. Through it, I aim to bridge modern digital
              solutions with the timeless beauty of Cambodian tourism. I believe
              that by making tourism information more accessible and engaging,
              we can inspire both local and international travelers to discover
              more about the Kingdom of Wonder.
            </p>

            <p className="mb-4 text-sm sm:text-base leading-relaxed">
              Special thanks to <strong>Doctor Ky Soklay</strong> for his
              valuable advice, mentorship, and continuous support throughout
              this project. His guidance played a crucial role in shaping the
              vision and execution of Meakutes-Khmer.
            </p>

            <p className="text-sm sm:text-base leading-relaxed">
              Thank you for visiting and supporting this journey. Together,
              let's explore Cambodia.
            </p>
          </div>

          {/* Group Photo with Portrait Orientation and Hover Animation */}
          <div className="w-full sm:w-[200px] md:w-[260px] lg:w-[280px] xl:w-[400px] flex-shrink-0 mx-auto lg:mx-0">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <img
                src="/avatar.png"
                alt="Our Group"
                className="w-full h-[400px] sm:h-[450px] md:h-[400px] lg:h-[450px] xl:h-[600px] object-cover transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:brightness-110"
              />
            </div>
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
