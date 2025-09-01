"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firestore";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const Page = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  async function deletePlant(plantId) {
    try {
      await deleteDoc(doc(db, "plants", plantId));
    
      const uid = localStorage.getItem("uid");
      if (!uid) {
        console.warn("No UID found in localStorage");
        setLoading(false);
        return;
      }
       const plantsQuery = query(
          collection(db, "plants"),
          where("formdata.uid", "==", uid)
        );
        const querySnapshot = await getDocs(plantsQuery);

        const userPlants = [];
        querySnapshot.forEach((doc) => {
          userPlants.push({ id: doc.id, ...doc.data() });
        });
console.log(querySnapshot)
        setPlants(userPlants);
        setLoading(false);
      console.log(`Plant ${plantId} deleted ✅`);
    } catch (error) {
      console.error("Error deleting plant:", error);
    }
  }
  useEffect(() => {
  
    const fetchUserPlants = async () => {
      const uid = localStorage.getItem("uid");
      if (!uid) {
        console.warn("No UID found in localStorage");
        setLoading(false);
        return;
      }

      try {
       
        const plantsQuery = query(
          collection(db, "plants"),
          where("formdata.uid", "==", uid)
        );
        const querySnapshot = await getDocs(plantsQuery);

        const userPlants = [];
        querySnapshot.forEach((doc) => {
          userPlants.push({ id: doc.id, ...doc.data() });
        });
console.log(querySnapshot)
        setPlants(userPlants);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user plants:", error);
        setLoading(false);
      }
    };

    fetchUserPlants();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-200">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-green-900 font-bold text-xl animate-pulse">
          🌱 Checking your garden...
        </p>
      </div>
    );

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 shadow-lg px-6 py-6 rounded-b-3xl sticky top-0 z-10 border-b border-green-800">
        <div className="flex justify-center items-center">
          <div className="flex gap-10 text-white font-semibold text-lg">
            <a
              href="/yourplants"
              className="hover:text-green-200 transition underline font-light text-2xl"
            >
              🌿 Your Plants
            </a>
            <a
              href="/mygarden"
              className="hover:text-green-200 underline text-2xl transition"
            >
              💧 Water Reminders
            </a>
          </div>
        </div>
      </header>

      {/* Plant Grid */}
      <main className="max-w-7xl mx-auto mt-10 px-6 grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {plants.length === 0 ? (
          <p className="col-span-full text-center text-green-900 font-semibold text-lg bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-3xl shadow-md border border-green-200">
            🌱 No plants found. Add some to your garden!
          </p>
        ) : (
          plants.map((plant) => {
            const needsWater = true; // pseudo

            return (
              <div
                key={plant.id}
                className="group bg-gradient-to-b from-white to-green-50 border border-green-200 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transform transition-all duration-300 overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="h-44 bg-green-200 flex items-center justify-center text-green-600 text-6xl group-hover:bg-green-300 transition">
                  🌿
                </div>

                {/* Plant Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-extrabold text-green-900 mb-2 tracking-wide flex items-center gap-2">
                    {plant.formdata.name}
                    {needsWater && (
                      <span className="bg-red-200/80 text-red-700 text-xs px-3 py-1 rounded-full shadow-sm">
                        Needs Water
                      </span>
                    )}
                  </h3>
                  <p className="text-green-800 mb-1">
                    <span className="font-semibold">Last Watered:</span>{" "}
                    {plant.formdata.date}
                  </p>
                  <p className="text-green-800 mb-1">
                    <span className="font-semibold">Frequency:</span>{" "}
                    {plant.formdata.freq} day(s)
                  </p>
                  {plant.formdata.desc && (
                    <p className="text-green-700 mt-3 italic">
                      “{plant.formdata.desc}”
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-2">
                    <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform">
                      💧 Mark as Watered
                    </button>
                    <button onClick={()=>{deletePlant(plant.id)}} className="text-red-500 font-medium text-sm hover:underline hover:text-red-700">
                      🛑 Stop Reminder
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </>
  );
};

export default Page;
