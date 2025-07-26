import React from 'react';
import Navbar from './components/Navbar'; // Import the Navbar component
import './index.css'; // Ensure this imports your Tailwind base styles

function App() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white"> {/* Main background color */}
      <Navbar /> {/* Use the Navbar component here */}

      {/* Main Content Area */}
      <div className="flex items-center justify-center flex-grow">
        <h1 className="text-4xl">Your Page Content Starts Here</h1>
      </div>
    </div>
  );
}

export default App;