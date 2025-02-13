const Footer = () => (
     <footer className="bg-[#0a1e32] py-8">
       <div className="max-w-6xl mx-auto px-4 text-center">
         <p className="mb-4 text-gray-300">© 2025. Raj Shakya. All rights reserved</p>
         <button
           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
           className="hover:text-blue-400 transition-colors cursor-pointer"
         >
           ↑ Scroll to Top
         </button>
       </div>
     </footer>
   );
   
   export default Footer;