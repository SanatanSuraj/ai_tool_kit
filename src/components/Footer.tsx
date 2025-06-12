import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gray-100 bg-white/80 backdrop-blur-xl">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-blue-100/50 opacity-50" />
      <div className="absolute inset-0" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.8 8.544 15.214 9.96l9.9-9.9h-2.77zM32.657 0l8.544 8.544-1.415 1.414-9.9-9.9h2.77zm-12.657 0l9.9 9.9-1.415 1.414L19.97 2.828 21.384 1.414 19.97 0h.03zm20.97 0l-9.9 9.9 1.415 1.414 8.544-8.544L40.03 0h.97zm-9.9 9.9l9.9 9.9-1.414 1.414L29.9 9.9l1.414-1.414-1.414-1.414L41.37 19.385l1.414-1.414-11.9-11.9v.03zm-1.414 1.414L29.9 9.9l-9.9 9.9 1.414 1.414 9.9-9.9zm-9.9-1.414l1.414 1.414-9.9 9.9-1.414-1.414 9.9-9.9zm-1.414 1.414L17.557 22.728 19 24.142l10.97-10.97-1.414-1.414zm2.828 2.828l-1.414 1.414 8.544 8.544 1.414-1.414-8.544-8.544zm-4.242 4.242l-1.414 1.414 8.544 8.544 1.414-1.414-8.544-8.544zm2.828 2.828l-1.414 1.414 8.544 8.544 1.414-1.414-8.544-8.544zm-4.242 4.242l-1.414 1.414 8.544 8.544 1.414-1.414-8.544-8.544zm2.828 2.828l-1.414 1.414 8.544 8.544 1.414-1.414-8.544-8.544zm-4.242 4.242l-1.414 1.414 8.544 8.544 1.414-1.414-8.544-8.544z' fill='%234B5563' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Logo and Description */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Image
                  src="/logo.svg"
                  alt="AI Toolkit Logo"
                  width={44}
                  height={44}
                  className="w-11 h-11 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AI Toolkit
              </span>
            </div>
            
            <p className="text-gray-600 text-lg max-w-md leading-relaxed">
              Access powerful AI tools instantly — no downloads, no installations. Code, optimize, debug, and collaborate all in one place.
            </p>

            <div className="flex gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* WebBuddy Logo and Attribution */}
          <div className="flex flex-col items-center justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            <div className="relative">
              <Image
                src="/1.png"
                alt="WebBuddy Logo"
                width={280}
                height={84}
                className="transition-all duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-6 text-gray-600 text-base font-medium tracking-wide">
              Crafted by{' '}
              <a 
                href="https://webbuddy.agency" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-900 hover:text-blue-600 transition-colors duration-300"
              >
                webbuddy.agency
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} AI Toolkit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 