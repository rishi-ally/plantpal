'use client'
import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../lib/firestore'

const Page = () => {
  const [uid, setUid] = useState(null)
  const [loading, setLoading] = useState(true)
  const [queries, setQueries] = useState([])

  useEffect(() => {
    const fetchQueries = async () => {
      const gotUid = localStorage.getItem('uid')
      setUid(gotUid)

      if (!gotUid) {
        console.log('No UID found in localStorage')
        setLoading(false)
        return
      }

      try {
        const q = query(collection(db, 'doc'), where('useruid', '==', gotUid))
        const allqueries = await getDocs(q)

        const docsData = allqueries.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setQueries(docsData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchQueries()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading queries...
      </div>
    )
  }

  if (queries.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        No queries found.
      </div>
    )
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4">
  <h1 className="text-3xl font-bold text-center mb-10 text-green-700">
    Your Queries
  </h1>

  <div className="flex flex-col gap-6 max-w-3xl mx-auto">
    {queries.map((query) => (
      <div key={query.id} className="flex items-start gap-4">
        
        {/* Left: small circular avatar */}
        <img
          src={query.image2 || "/default-avatar.png"}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover border border-green-200 shadow-sm"
        />

        {/* Right: query card */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 shadow hover:shadow-lg transition relative">
          {/* Delete Button */}
          <button
            onClick={() => console.log("Delete:", query.id)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm font-semibold"
          >
            ✖
          </button>

          {/* Doctor Name */}
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            {query.docname || "Unknown Doctor"}
          </h2>

          {/* Query Text */}
          <p className="text-gray-600 text-sm">{query.query}</p>

          {/* Big image (attachment) */}
          {query.image2 && (
            <div className="mt-3">
              <img
                src={query.image}
                alt="attached"
                className="rounded-xl shadow-md max-h-64 w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

  )
}

export default Page
