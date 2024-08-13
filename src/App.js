import React, { useState, useEffect } from 'react';

const TreeNode = ({ node, currentPath }) => {
  const isActive = currentPath.includes(node);
  const color = node.isValid ? '#4ECDC4' : isActive ? '#FFA726' : '#45B7D1';
  return (
    <g>
      <circle cx={node.x} cy={node.y} r="20" fill={color} stroke="#2C3E50" strokeWidth="2" />
      <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill="#2C3E50" fontSize="12">{node.value}</text>
      {node.children.map((child, index) => (
        <React.Fragment key={index}>
          <line x1={node.x} y1={node.y + 20} x2={child.x} y2={child.y - 20} stroke="#95A5A6" strokeWidth="2" />
          <TreeNode node={child} currentPath={currentPath} />
        </React.Fragment>
      ))}
    </g>
  );
};

const BacktrackingVisualization = () => {
  const [tree, setTree] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [step, setStep] = useState(0);
  const [allPaths, setAllPaths] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const candidates = [1, 1, 2, 5, 6, 7];
    const target = 8;

    const generateTree = () => {
      const root = { value: 'Start', x: 0, y: 0, children: [] };
      const buildTree = (node, remainingCandidates, remainingTarget, depth, path) => {
        if (remainingTarget === 0) {
          node.isValid = true;
          setAllPaths(prev => [...prev, [...path, node]]);
          return;
        }
        if (remainingTarget < 0 || remainingCandidates.length === 0) return;
        
        remainingCandidates.forEach((candidate, index) => {
          if (index > 0 && candidate === remainingCandidates[index - 1]) return; // Skip duplicates
          const childNode = { 
            value: candidate,
            children: [],
            depth: depth + 1
          };
          node.children.push(childNode);
          buildTree(childNode, remainingCandidates.slice(index + 1), remainingTarget - candidate, depth + 1, [...path, node]);
        });
      };
      buildTree(root, candidates, target, 0, []);
      return root;
    };

    const assignCoordinates = (node, left, right, depth) => {
      node.x = (left + right) / 2;
      node.y = depth * 100;

      const childrenCount = node.children.length;
      const step = (right - left) / childrenCount;

      node.children.forEach((child, index) => {
        const newLeft = left + step * index;
        const newRight = newLeft + step;
        assignCoordinates(child, newLeft, newRight, depth + 1);
      });
    };

    const calculateDimensions = (node) => {
      let minX = node.x, maxX = node.x;
      let maxY = node.y;

      node.children.forEach(child => {
        const childDimensions = calculateDimensions(child);
        minX = Math.min(minX, childDimensions.minX);
        maxX = Math.max(maxX, childDimensions.maxX);
        maxY = Math.max(maxY, childDimensions.maxY);
      });

      return { minX, maxX, maxY };
    };

    const treeRoot = generateTree();
    assignCoordinates(treeRoot, 0, 1000, 0);
    const { minX, maxX, maxY } = calculateDimensions(treeRoot);
    
    const width = maxX - minX + 200;
    const height = maxY + 200;

    const adjustX = (node) => {
      node.x += (width / 2) - (maxX + minX) / 2;
      node.children.forEach(adjustX);
    };
    adjustX(treeRoot);

    setTree(treeRoot);
    setDimensions({ width, height });
  }, []);

  const nextStep = () => {
    if (step < allPaths.length) {
      setCurrentPath(allPaths[step]);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setCurrentPath(allPaths[step - 2]);
    }
  };

  const resetVisualization = () => {
    setStep(0);
    setCurrentPath([]);
  };

  if (!tree) return <div>Loading...</div>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '100%', margin: '0 auto', overflowX: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2C3E50' }}>Dynamic Backtracking Visualization: Combination Sum II</h1>
      <h2 style={{ textAlign: 'center', color: '#34495E' }}>Target: 8, Candidates: [1, 1, 2, 5, 6, 7]</h2>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button onClick={prevStep} disabled={step <= 1}>Previous Step</button>
        <button onClick={nextStep} disabled={step >= allPaths.length} style={{ margin: '0 10px' }}>Next Step</button>
        <button onClick={resetVisualization}>Reset</button>
      </div>
      <div style={{ border: '1px solid #ccc', overflow: 'auto' }}>
        <svg 
          width="100%" 
          height={dimensions.height} 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          style={{ display: 'block', margin: 'auto' }}
        >
          <TreeNode node={tree} currentPath={currentPath} />
        </svg>
      </div>
      <div style={{ marginTop: '20px', backgroundColor: '#ECF0F1', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ color: '#2C3E50' }}>Current Path:</h3>
        <p>{currentPath.map(node => node.value).join(' -> ')}</p>
        <h3 style={{ color: '#2C3E50' }}>Step: {step} / {allPaths.length}</h3>
      </div>
    </div>
  );
};

export default BacktrackingVisualization;