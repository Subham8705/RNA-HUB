import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RnaResults = ({ results }: { results: any }) => {
  if (!results) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RNA Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p><strong>RNA ID:</strong> {results.rnaId}</p>
          {results.patientName && (
            <p><strong>Patient Name:</strong> {results.patientName}</p>
          )}
          <p><strong>Sequence:</strong> {results.sequence}</p>
          <p><strong>Secondary Structure:</strong> {results.structure}</p>
          <p><strong>Length:</strong> {results.length} bases</p>
          <p><strong>GC Content:</strong> {(results.gc_content * 100).toFixed(2)}%</p>

          {/* <div>
            <strong>Motifs:</strong>
            <ul className="list-disc list-inside ml-4">
              {results.motifs.map((motif: string, index: number) => (
                <li key={index}>{motif}</li>
              ))}
            </ul>
          </div> */}

          <div>
            <strong>Predictions:</strong>
            <ul className="list-disc list-inside ml-4">
              <li><strong>Stability:</strong> {results.predictions.stability}</li>
              <li><strong>Function:</strong> {results.predictions.function}</li>
              <li><strong>Interactions:</strong>
                <ul className="list-disc list-inside ml-4">
                  {results.predictions.interactions.map((interaction: string, index: number) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          {results.patientData && (
            <div>
              <strong>Patient Data:</strong>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Age:</strong> {results.patientData.age}</li>
                <li><strong>Gender:</strong> {results.patientData.gender}</li>
                <li><strong>Condition:</strong> {results.patientData.condition}</li>
                <li><strong>Genetic Markers:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {results.patientData.genetic_markers.map((marker: string, index: number) => (
                      <li key={index}>{marker}</li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RnaResults;
