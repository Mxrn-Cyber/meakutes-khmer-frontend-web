import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Figma,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";
import { avatar } from "@material-tailwind/react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Company Section */}
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-white mb-6 relative">
                Company
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              </h4>
              <nav className="space-y-3">
                {[
                  "About Us",
                  "Contact Us",
                  "Privacy Policy",
                  "Terms & Condition",
                  "FAQs & Help",
                ].map((item) => (
                  <a
                    key={item}
                    href="/"
                    className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 ease-in-out group"
                  >
                    <span className="border-b border-transparent group-hover:border-blue-400 pb-1">
                      {item}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact Section */}
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-white mb-6 relative">
                Contact
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full"></div>
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group hover:text-blue-400 transition-colors duration-300">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    #219A, Second Floor, Building A, Russian Federation
                    Boulevard, Teuk Laak 1, Toul Kork, Phnom Penh Cambodia
                  </span>
                </div>
                <div className="flex items-center space-x-3 group hover:text-blue-400 transition-colors duration-300">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    +855 96 696 0144
                  </span>
                </div>
                <div className="flex items-center space-x-3 group hover:text-blue-400 transition-colors duration-300">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    laothomorn@gmail.com
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3 pt-4">
                {[
                  {
                    Icon: Figma,
                    href: "https://www.figma.com/@cybermorn",
                    color: "hover:bg-blue-500",
                  },
                  {
                    Icon: Facebook,
                    href: "https://web.facebook.com/morn.scripter",
                    color: "hover:bg-blue-600",
                  },
                  {
                    Icon: Youtube,
                    href: "https://www.tiktok.com/@cybermorn",
                    color: "hover:bg-red-600",
                  },
                  {
                    Icon: Linkedin,
                    href: "https://www.linkedin.com/in/lao-thomorn-347a4b28b/",
                    color: "hover:bg-blue-700",
                  },
                ].map(({ Icon, href, color }, index) => (
                  <a
                    key={index}
                    href={href}
                    className={`w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white ${color} hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-white mb-6 relative">
                Gallery
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  "/avatar.png",
                  "/avatar.png",
                  "/avatar.png",
                  "/avatar.png",
                  "/avatar.png",
                  "/avatar.png",
                ].map((imageUrl, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer group relative"
                  >
                    <img
                      src={imageUrl}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-white mb-6 relative">
                Newsletter
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
              </h4>
              <p className="text-gray-300 leading-relaxed">
                Stay updated with our latest news and exclusive offers. Join our
                community today!
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 pr-32 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium hover:shadow-lg hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-300 text-center md:text-left">
                © {new Date().getFullYear()}{" "}
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-300 border-b border-transparent hover:border-blue-300"
                >
                  Meakutes-Khmer-APP
                </a>
                , All Rights Reserved.
                <span className="block md:inline md:ml-2 mt-1 md:mt-0">
                  Designed by{" "}
                  <a
                    href="https://github.com/Mxrn-Cyber"
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300 border-b border-transparent hover:border-purple-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lao Thomorn
                  </a>
                </span>
              </div>
              <nav className="flex space-x-6">
                {["Home", "Cookies", "Help", "FAQs"].map((item) => (
                  <a
                    key={item}
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors duration-300 border-b border-transparent hover:border-blue-400 pb-1"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
