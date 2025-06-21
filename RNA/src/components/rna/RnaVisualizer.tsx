// components/rna/RnaVisualizer.tsx
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

const RnaVisualizer: React.FC<{ sequence: string }> = ({ sequence }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [pdbData, setPdbData] = useState<string | null>(null);

  // Load the PDB file based on the sequence
  useEffect(() => {
    if (!sequence) return;

    const pdbFileName = `/${sequence}.pdb`; // Assuming PDB files are named after sequences
    
    fetch(pdbFileName)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`PDB file not found for sequence: ${sequence}`);
        }
        return res.text();
      })
      .then((data) => setPdbData(data))
      .catch((err) => {
        console.error('Failed to load PDB file', err);
        // You might want to show a fallback visualization or message here
      });
  }, [sequence]);

  // Render the viewer when data is ready
  useEffect(() => {
    if (window.$3Dmol && pdbData && viewerRef.current) {
      viewerRef.current.innerHTML = ''; // clear previous if any

      const viewer = window.$3Dmol.createViewer(viewerRef.current, {
        defaultcolors: window.$3Dmol.rasmolElementColors,
        backgroundColor: 'white',
      });

      viewer.addModel(pdbData, 'pdb');
      viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
      viewer.zoomTo();
      viewer.render();
      viewer.zoom(1.5, 1000); // center and zoom slightly
    }
  }, [pdbData]);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>3D RNA Structure Viewer: {sequence}</h2>

      <div
        ref={viewerRef}
        style={{
          width: '100%',
          height: '500px',
          margin: '20px auto',
          border: '1px solid #ccc',
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden',
        }}
      />

      <div
        style={{
          width: '100%',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ccc',
          borderRadius: '10px',
          padding: '15px',
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'auto',
          marginTop: '2rem',
        }}
      >
        <h4 style={{color: 'black'}}>Atom Color Key</h4>
        <table style={{ width: '100%' }}>
          <tbody>
            {[
              { atom: 'Carbon', color: 'gray', meaning: 'Backbone of molecules' },
              { atom: 'Hydrogen', color: '#e0e0e0', meaning: 'Usually omitted for clarity' },
              { atom: 'Oxygen', color: 'red', meaning: 'Electronegative atom' },
              { atom: 'Nitrogen', color: 'blue', meaning: 'Present in amines, proteins' },
              { atom: 'Sulfur', color: 'gold', meaning: 'In disulfide bridges' },
              { atom: 'Phosphorus', color: 'orange', meaning: 'Found in DNA, RNA' },
            ].map(({ atom, color, meaning }) => (
              <tr key={atom}>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      backgroundColor: color,
                      borderRadius: '50%',
                      marginRight: '6px',
                      border: '1px solid #555',
                    }}
                  />
                </td>
                <td style={{ fontWeight: 'bold' }}>{atom}</td>
                <td style={{ fontSize: '12px', color: '#555' }}>{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RnaVisualizer;