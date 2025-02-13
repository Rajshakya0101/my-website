const Contact = () => (
     <section className="py-16 px-4 max-w-6xl mx-auto">
       <div className="max-w-2xl">
         <h2 className="text-3xl font-bold mb-8">Got a project in mind?</h2>
         <form className="space-y-6">
           <input
             type="text"
             placeholder="Your Name"
             className="w-full p-3 bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-400 placeholder-gray-400"
           />
           <input
             type="email"
             placeholder="Your Email"
             className="w-full p-3 bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-400 placeholder-gray-400"
           />
           <textarea
             placeholder="Your Message"
             rows="4"
             className="w-full p-3 bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-400 placeholder-gray-400"
           ></textarea>
           <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition">
             Contact Me
           </button>
         </form>
       </div>
     </section>
   );
   
   export default Contact;