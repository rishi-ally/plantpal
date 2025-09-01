"use client";

import React, { useState, useRef } from "react";
import { Search, X, Loader2, ImageIcon, ExternalLink } from "lucide-react";


export default function Page() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const[error,seterror]=useState(false)
  const inputRef = useRef(null);

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const onFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleFileChange = (e) => {
    onFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    onFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Pick an image first — plants aren't identified through vibes alone 😅");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("plant", file);

      const res = await fetch("/api/sendinfo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
      console.log("API returned:", data);
      if(data.details?.statusCode &&data.details.statusCode==400){
        seterror(true)
        alert("Try different image!")
             seterror(false)
         setFile(null);
    setPreviewUrl(null);
    setResult(null);
        
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong while identifying — try again or check console.");
    } finally {
      setLoading(false);
    }
  };

  // Helpers to render links if available
  const gbifUrl = (id) => (id ? `https://www.gbif.org/species/${id}` : null);
  const powoUrl = (id) => (id ? `https://powo.science.kew.org/taxon/${id}` : null);

  const renderTopMatch = (data) => {
    if (!data) return null;
    const best = data.results[0];

    // Defensive access with fallbacks for different API shapes

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-50">
        <div className="flex items-start gap-4">
          <div className="w-28 h-28 rounded-lg overflow-hidden bg-green-50 flex items-center justify-center border">
            {previewUrl ? (
              // show the uploaded image
              <img src={previewUrl} alt="preview" className="object-cover w-full h-full" />
            ) : (
              <div className="flex flex-col items-center justify-center text-green-600 p-4">
                <ImageIcon size={36} />
                <span className="text-xs">Your photo</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-green-800">{best.species.scientificName}{best.species.scientificNameAuthorship ? ` ${best.species.scientificNameAuthorship}` : ""}</h2>
                
                    <p className="mt-1 text-sm text-green-700/90">{(best.species?.commonNames || best.species.commonNames || []).slice(0,2).join(', ')} </p>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border">
                  <span className="text-xs text-green-700 font-semibold">Confidence</span>
                   <span className="text-lg font-bold text-green-800">{best.score}%</span>
                </div>

                <div className="mt-2 flex gap-2 justify-end">
                  {best.gbif && (
                    <a className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm text-green-700 hover:bg-green-50" href={gbifUrl(best.gbif)} target="_blank" rel="noreferrer">
                      GBIF <ExternalLink size={14} />
                    </a>
                  )}
                  {best.powo && (
                    <a className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm text-green-700 hover:bg-green-50" href={powoUrl(best.powo)} target="_blank" rel="noreferrer">
                      POWO <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg p-3 bg-green-50/60 border">
                <div className="font-semibold text-green-700">Family</div>
                <div className="text-green-900">{best.species.family.scientificName || "—"}</div>
              </div>
              <div className="rounded-lg p-3 bg-green-50/60 border">
                <div className="font-semibold text-green-700">Genus</div>
                <div className="text-green-900">{best.species.genus.scientificName || "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* expanded data */}
        <div className="mt-5 text-sm text-green-800/90">
          <h3 className="font-semibold">Deep info</h3>
          <pre className="mt-2 bg-green-25 p-3 rounded-md text-xs overflow-auto text-green-900 max-h-40">{JSON.stringify(best, null, 2)}</pre>
        </div>
      </div>
    );
  };

  const renderOtherResults = (data) => {
    if (!data?.results || data.results.length <= 1) return null;
    return (
      <div className="mt-4 grid gap-3">
        {data.results.slice(1, 6).map((r, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white/70 p-3 rounded-xl border">
            <div>
              <div className="text-sm font-semibold text-green-800">{r.scientificName || r.species?.scientificName || "Unknown"}</div>
              <div className="text-xs text-green-700"></div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-900">{Math.round((r.score ?? 0) * 1000)/10}%</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
   <>
   {
    error ||  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white/60 rounded-3xl shadow-2xl p-6 backdrop-blur-md border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-green-800">🌿 Plant-o-Pedia</h1>
            <p className="text-green-700/90 mt-1">Upload a photo and get an identification with taxonomy, confidence and references.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={reset} className="px-3 py-2 rounded-lg bg-white border hover:bg-green-50 text-sm text-green-700">Reset</button>
            <button onClick={handleSubmit} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-600 text-white shadow hover:brightness-105 disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
              <span className="font-semibold">Identify</span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="h-56 rounded-2xl border-dashed border-2 border-green-100 bg-white/60 flex items-center justify-center flex-col p-4">
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img src={previewUrl} alt="preview" className="object-cover w-full h-full rounded-xl" />
                  <button onClick={() => { setPreviewUrl(null); setFile(null); inputRef.current.value = null; }} className="absolute top-3 right-3 bg-white/80 p-1 rounded-full">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-green-700">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">🌱</div>
                    <div className="text-sm">
                      Drag & drop an image here or
                      <div className="mt-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full bg-green-50 border text-green-800">
                          <input ref={inputRef} onChange={handleFileChange} type="file" accept="image/*" name="plant" className="hidden" />
                          <span className="text-sm">Choose file</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-green-600/90">Try a clear photo of the leaf or flower for best results.</p>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-green-800/90">
              <strong>Tips:</strong>
              <ul className="list-disc pl-5 mt-2">
                <li>Get close to the subject — fill the frame with the leaf or flower.</li>
                <li>Good lighting and multiple angles help improve confidence.</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            {/* If loading show a hero loader */}
            {loading && (
              <div className="rounded-2xl bg-white/60 p-8 border flex items-center gap-6">
                <Loader2 className="animate-spin text-green-600" size={40} />
                <div>
                  <div className="text-lg text-green-800 font-semibold">Identifying...</div>
                  <div className="text-sm text-green-700">We compare your photo with thousands of plant records. This usually takes a few seconds.</div>
                </div>
              </div>
            )}

            {/* Result area */}
            {!loading && result && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-green-800">Results</h3>
                  <p className="text-xs text-green-700/90">Version {result.version ?? "—"} • Remaining credits: {result.remainingIdentificationRequests ?? "—"}</p>
                </div>

                <div className="space-y-4">
                  {renderTopMatch(result)}
                  {renderOtherResults(result)}

                  <div className="mt-3 text-sm text-green-800">
                    <details className="bg-white/70 p-3 rounded-lg border">
                      <summary className="cursor-pointer font-semibold">Raw API payload (click to expand)</summary>
                      <pre className="mt-2 text-xs max-h-64 overflow-auto bg-green-50 p-3 rounded">{JSON.stringify(result, null, 2)}</pre>
                    </details>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !result && (
              <div className="rounded-2xl p-8 bg-white/60 border text-green-800">
                <div className="text-lg font-semibold">No result yet</div>
                <div className="mt-2 text-sm text-green-700">Upload a photo and click <span className="font-medium">Identify</span> to see a beautiful, detailed result.</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-green-600/80">Tip: Want favorites, search history or species pages? Tell me and I’ll wire them in. 🌿</div>
      </div>
    </div>
   
   }
   </>
  );
}
