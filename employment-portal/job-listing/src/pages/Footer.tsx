import React, { useState } from 'react';
import { Mail, Phone, Camera } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaFacebookF } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Logo2 from '../assets/CodeSoar Logo (1).png';
import Image from 'next/image';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email!');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Subscribed successfully!');
      setEmail('');
      setIsSubscribed(true);
      setIsLoading(false);

      // Reset after 3s so they can try again
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 1000);
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex p-2 bg-white rounded-lg shadow-md mx-auto md:mx-0">
              <Image
                src={Logo2}
                alt="Logo"
                width={100}
                height={70}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Find your dream job or hire top talent. Connecting opportunities
              worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-300 text-sm">
                <Mail className="h-4 w-4 text-blue-400" />
                <a
                  href="mailto:support@codesoar.io.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  support@codesoar.io.com
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-300 text-sm">
                <Phone className="h-4 w-4 text-blue-400" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-blue-400 transition-colors"
                >
                  +1 (234) 567-8900
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start space-x-4 mt-3">
              <FaTwitter className="h-5 w-5 text-slate-400 hover:text-blue-400 transition-colors" />
              <FaLinkedin className="h-5 w-5 text-slate-400 hover:text-blue-400 transition-colors" />
              <FaFacebookF className="h-5 w-5 text-slate-400 hover:text-blue-400 transition-colors" />
              <Camera className="h-5 w-5 text-slate-400 hover:text-blue-400 transition-colors" />
            </div>
          </div>

          {/* Job Seekers */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-3">Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              {[
                'Browse Jobs',
                'Companies',
                'Salaries',
                'Career Guide',
                'Resume Help',
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-3">Employers</h3>
            <ul className="space-y-2 text-sm">
              {[
                'Post Jobs',
                'Find Resumes',
                'Recruiter Products',
                'Employer Events',
                'Pricing',
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              {['About', 'Help Center', 'Careers', 'Press', 'Contact Us'].map(
                (item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-10 text-center">
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubscribed}
            />
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white font-medium transition w-full sm:w-auto
                ${
                  isSubscribed
                    ? 'bg-green-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }
              `}
              disabled={isSubscribed || isLoading}
            >
              {isLoading
                ? 'Processing...'
                : isSubscribed
                  ? 'Subscribed'
                  : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-6 border-t border-slate-700 text-sm text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">
            © 2025 All rights reserved .
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              'Privacy Policy',
              'Terms of Service',
              'Accessibility',
              'Cookies',
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-blue-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
