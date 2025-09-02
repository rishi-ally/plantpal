"use client";

import React, { useState, useRef } from "react";
import { Search, X, Loader2, ImageIcon, ExternalLink } from "lucide-react";

export default function Page() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    inputRef.current.value = null;
  };

  const onFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleFileChange = (e) => onFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    onFile(e.dataTransfer.files?.[0]);
  };
  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async () => {
    if (!file) return alert("Pick an image first 😅");

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

      if (data.details?.statusCode === 400) {
        setError(true);
        alert("Try a different image!");
        reset();
        setError(false);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const gbifUrl = (id) => (id ? `https://www.gbif.org/species/${id}` : null);
  const powoUrl = (id) => (id ? `https://powo.science.kew.org/taxon/${id}` : null);

  const renderTopMatch = (data) => {
    if (!data) return null;
    const best = data.results[0];
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-50">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="w-full md:w-28 h-28 rounded-lg overflow-hidden bg-green-50 flex items-center justify-center border">
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="object-cover w-full h-full" />
            ) : (
              <div className="flex flex-col items-center justify-center text-green-600 p-4">
                <ImageIcon size={36} />
                <span className="text-xs">Your photo</span>
              </div>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-green-800">
                  {best.species.scientificName}
                  {best.species.scientificNameAuthorship ? ` ${best.species.scientificNameAuthorship}` : ""}
                </h2>
                <p className="mt-1 text-sm text-green-700/90">
                  {(best.species?.commonNames || []).slice(0, 2).join(", ")}
                </p>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border">
                  <span className="text-xs text-green-700 font-semibold">Confidence</span>
                  <span className="text-lg font-bold text-green-800">{best.score}%</span>
                </div>
                <div className="flex gap-2">
                  {best.gbif && (
                    <a
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm text-green-700 hover:bg-green-50"
                      href={gbifUrl(best.gbif)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GBIF <ExternalLink size={14} />
                    </a>
                  )}
                  {best.powo && (
                    <a
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm text-green-700 hover:bg-green-50"
                      href={powoUrl(best.powo)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      POWO <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg p-3 bg-green-50/60 border">
                <div className="font-semibold text-green-700">Family</div>
                <div className="text-green-900">{best.species.family?.scientificName || "—"}</div>
              </div>
              <div className="rounded-lg p-3 bg-green-50/60 border">
                <div className="font-semibold text-green-700">Genus</div>
                <div className="text-green-900">{best.species.genus?.scientificName || "—"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 text-sm text-green-800/90">
          <h3 className="font-semibold">Deep info</h3>
          <pre className="mt-2 bg-green-25 p-3 rounded-md text-xs overflow-auto text-green-900 max-h-40">
            {JSON.stringify(best, null, 2)}
          </pre>
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
              <div className="text-sm font-semibold text-green-800">{r.scientificName || "Unknown"}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-900">{Math.round((r.score ?? 0) * 1000) / 10}%</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {!error && (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-5xl bg-white/60 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 backdrop-blur-md border border-green-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-green-800">🌿 Plant-o-Pedia</h1>
                <p className="text-green-700/90 mt-1 text-sm md:text-base">
                  Upload a photo and get identification with taxonomy, confidence, and references.
                </p>
              </div>

              <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-0 flex-wrap">
                <button
                  onClick={reset}
                  className="px-3 py-2 rounded-lg bg-white border hover:bg-green-50 text-sm text-green-700"
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-600 text-white shadow hover:brightness-105 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                  <span className="font-semibold">Identify</span>
                </button>
              </div>
            </div>

            {/* Grid: Upload + Results */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Upload Box */}
              <div className="md:col-span-1">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="h-56 rounded-2xl border-dashed border-2 border-green-100 bg-white/60 flex items-center justify-center flex-col p-4 relative"
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img src={previewUrl} alt="preview" className="object-cover w-full h-full rounded-xl" />
                      <button
                        onClick={() => reset()}
                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-green-700 text-center">
                      <div className="text-4xl">🌱</div>
                      <p className="mt-2 text-sm">Drag & drop an image here or</p>
                      <label className="mt-2 inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full bg-green-50 border text-green-800">
                        <input
                          ref={inputRef}
                          onChange={handleFileChange}
                          type="file"
                          accept="image/*"
                          className="hidden"
                        />
                        Choose file
                      </label>
                      <p className="mt-2 text-xs text-green-600/90">
                        Clear photo of leaf/flower works best.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-green-800/90">
                  <strong>Tips:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Fill the frame with the leaf or flower.</li>
                    <li>Good lighting and multiple angles improve confidence.</li>
                  </ul>
                </div>
              </div>

              {/* Results */}
              <div className="md:col-span-2 flex flex-col gap-4">
                {loading && (
                  <div className="rounded-2xl bg-white/60 p-6 border flex items-center gap-4">
                    <Loader2 className="animate-spin text-green-600" size={36} />
                    <div>
                      <div className="text-lg text-green-800 font-semibold">Identifying...</div>
                      <div className="text-sm text-green-700">
                        Comparing your photo with thousands of plant records.
                      </div>
                    </div>
                  </div>
                )}

                {!loading && result && (
                  <div className="space-y-4">
                    {renderTopMatch(result)}
                    {renderOtherResults(result)}
                    <div className="mt-3 text-sm text-green-800">
                      <details className="bg-white/70 p-3 rounded-lg border">
                        <summary className="cursor-pointer font-semibold">
                          Raw API payload (click to expand)
                        </summary>
                        <pre className="mt-2 text-xs max-h-64 overflow-auto bg-green-50 p-3 rounded">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                )}

                {!loading && !result && (
                  <div className="rounded-2xl p-6 bg-white/60 border text-green-800">
                    <div className="text-lg font-semibold">No result yet</div>
                    <div className="mt-2 text-sm text-green-700">
                      Upload a photo and click <span className="font-medium">Identify</span>.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-green-600/80">
              Tip: Want favorites, search history or species pages? Let me know! 🌿
            </div>
          </div>
        </div>
      )}
    </>
  );
}
