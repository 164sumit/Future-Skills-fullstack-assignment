import React from 'react'

const Footer = () => {
  return (
     
     <footer className="w-full bg-black text-white py-8">
     <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
       <div>
         <h3 className="font-semibold mb-2">Abstract</h3>
         <ul>
           <li>Branches</li>
         </ul>
       </div>
       <div>
         <h3 className="font-semibold mb-2">Resources</h3>
         <ul>
           <li>Blog</li>
           <li>Help Center</li>
           <li>Release Notes</li>
           <li>Status</li>
         </ul>
       </div>
       <div>
         <h3 className="font-semibold mb-2">Community</h3>
         <ul>
           <li>Twitter</li>
           <li>LinkedIn</li>
           <li>Facebook</li>
           <li>Dribbble</li>
           <li>Podcast</li>
         </ul>
       </div>
       <div>
         <h3 className="font-semibold mb-2">Company</h3>
         <ul>
           <li>About Us</li>
           <li>Careers</li>
           <li>Legal</li>
           <li>Contact Us</li>
         </ul>
       </div>
     </div>
     <div className="text-center text-gray-400 text-xs mt-4">
       © Copyright 2022 Abstract Studio Design, Inc. All rights reserved.
     </div>
   </footer>
  )
}

export default Footer