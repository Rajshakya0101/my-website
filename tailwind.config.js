module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {
        fontFamily: {
          cookie: ["Cookie", "serif"],
        },
         spacing: {
           '128': '32rem',
         }
       },
     },
     plugins: [
      require('tailwind-scrollbar'),
     ],
   }