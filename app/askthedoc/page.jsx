"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firestore";

// Fake doctors JSON (you can also import from a JSON file)
const doctors = [
  { id: "doc1", name: "Dr. Flora Green", specialty: "Succulents & Cacti", experience: 8, rating: 4.9, image: "https://i.pravatar.cc/150?img=11" },
  { id: "doc2", name: "Dr. Leafy Moss", specialty: "Indoor Plants", experience: 5, rating: 4.7, image: "https://i.pravatar.cc/150?img=12" },
  { id: "doc3", name: "Dr. Root Vine", specialty: "Garden & Outdoor Plants", experience: 10, rating: 4.8, image: "https://i.pravatar.cc/150?img=13" },
  { id: "doc4", name: "Dr. Petal Bloom", specialty: "Flowering Plants", experience: 7, rating: 4.6, image: "https://i.pravatar.cc/150?img=14" },
  { id: "doc5", name: "Dr. Stem Sprout", specialty: "Vegetables & Herbs", experience: 6, rating: 4.5, image: "https://i.pravatar.cc/150?img=15" },
  { id: "doc6", name: "Dr. Ivy Greenfield", specialty: "Vines & Climbers", experience: 9, rating: 4.8, image: "https://i.pravatar.cc/150?img=16" },
  { id: "doc7", name: "Dr. Fern Woods", specialty: "Ferns & Shade Plants", experience: 4, rating: 4.4, image: "https://i.pravatar.cc/150?img=17" },
  { id: "doc8", name: "Dr. Blossom Meadow", specialty: "Ornamental Plants", experience: 8, rating: 4.7, image: "https://i.pravatar.cc/150?img=18" },
  { id: "doc9", name: "Dr. Thorn Bush", specialty: "Shrubs & Hedging", experience: 11, rating: 4.9, image: "https://i.pravatar.cc/150?img=19" },
  { id: "doc10", name: "Dr. Petunia Greenleaf", specialty: "Tropical & Exotic Plants", experience: 5, rating: 4.6, image: "https://i.pravatar.cc/150?img=20" },
];

const Page = () => {
  const [queryDoctor, setQueryDoctor] = useState(null);
  const [queryText, setQueryText] = useState("");

const [queryImageUrl, setQueryImageUrl] = useState("");
const[uid,setuid]=useState(null)
useEffect(()=>{
const id=localStorage.getItem('uid')
setuid(id)
},[])
  const openQueryModal = (doctor) => {
    setQueryDoctor(doctor);
  };

  const closeModal = () => {
    setQueryDoctor(null);
    setQueryText("");
  };

  const submitQuery = async(image) => {
const resut=await addDoc(collection(db,'doc'),{
  docname:queryDoctor.name,
  image:queryImageUrl,
  query:queryText,
  useruid:uid,
  image2:image
})

    alert(`We have submitted your query to ${queryDoctor.name}! 🌿`);
    closeModal();
  };

  return (
   <> 
   <header className=" bg-green-500 shadow-lg px-6 py-6 rounded-b-3xl sticky top-0 z-10 border-b border-green-800">
        <div className="flex justify-center items-center">
          <div className="flex gap-10 text-white font-semibold text-lg">
            
            <a
              href="/myqueries"
              className="hover:text-green-200 underline text-2xl transition"
            >
              Your Queries💬
            </a>
          </div>
        </div>
      </header>
   
   <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-200 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-green-900 text-center mb-8">
        🌿 Ask a Plant Doctor
      </h1>
<div className="bg-green-200 rounded-b-full rounded-t-full shadow-md px-6 py-4 flex items-center justify-between sticky">
          
    
          {/* Navigation Links (optional) */}
          <div className=" sm:flex gap-10 text-green-900 font-medium text-lg">
         <div className=" w-[95vw] flex justify-center items-center"><h1 className="font-extrabold text-4xl font-serif text-green-600">Ask your Queries to our proffesional PlantPal Doctor's</h1></div>
          </div>
        </div>
      {/* Doctors Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-all transform hover:scale-[1.03]"
          >
            <img
              src={doc.image}
              alt={doc.name}
              className="w-24 h-24 rounded-full border-4 border-green-200 mb-4 shadow-md"
            />
            <h3 className="text-xl font-semibold text-green-900 mb-1">{doc.name}</h3>
            <p className="text-green-800 italic mb-1">{doc.specialty}</p>
            <p className="text-green-700 mb-3">⭐ {doc.rating} | {doc.experience} yrs exp</p>

            <button
              onClick={() => openQueryModal(doc)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full shadow-md hover:shadow-xl transition-transform transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Post Query
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {queryDoctor && (
       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
    <button
      className="absolute top-4 right-4 text-green-700 font-bold text-xl"
      onClick={closeModal}
    >
      ✖
    </button>
    <h2 className="text-2xl font-bold text-green-900 mb-4">
      Ask {queryDoctor.name}
    </h2>

    {/* Image URL input */}
    <input
      type="url"
      value={queryImageUrl}
      onChange={(e) => setQueryImageUrl(e.target.value)}
      placeholder="Optional: paste image URL"
      className="w-full p-3 border text-black border-green-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
    />

    {/* Query textarea */}
    <textarea
      value={queryText}
      onChange={(e) => setQueryText(e.target.value)}
      placeholder="Describe your plant issue..."
      className="w-full p-3 border text-black border-green-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
      rows={5}
    />

    <button
      onClick={()=>{submitQuery(queryDoctor.image)}}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full shadow-md hover:shadow-xl transition-transform transform hover:scale-105 active:scale-95"
    >
      Submit Query
    </button>
  </div>
</div>

      )}
    </div></>
  );
};

export default Page;
