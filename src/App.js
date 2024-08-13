import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TreeNode = ({ node, depth }) => {
  const color = node.isValid ? '#4CAF50' : node.isActive ? '#FFA726' : '#90CAF9';
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <circle cx={node.x} cy={node.y} r="25" fill={color} stroke="#37474F" strokeWidth="2" />
      <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill="#37474F" fontSize="14">{node.value}</text>
      {node.children.map((child, index) => (
        <React.Fragment key={index}>
          <line x1={node.x} y1={node.y + 25} x2={child.x} y2={child.y - 25} stroke="#78909C" strokeWidth="2" />
          <TreeNode node={child} depth={depth + 1} />
        </React.Fragment>
      ))}
    </motion.g>
  );
};

const BacktrackingVisualization = () => {
  const [tree, setTree] = useState(null);
  const [step, setStep] = useState(0);
  const [combinations, setCombinations] = useState([]);

  useEffect(() => {
    const candidates = [1, 1, 2, 5, 6, 7];
    const target = 8;
    
    const generateTree = () => {
      const root = { value: 'Start', x: 500, y: 50, children: [], sum: 0 };
      const buildTree = (node, remainingCandidates, remainingTarget, path) => {
        if (remainingTarget === 0) {
          node.isValid = true;
          return;
        }
        if (remainingTarget < 0 || remainingCandidates.length === 0) return;
        
        remainingCandidates.forEach((candidate, index) => {
          if (index > 0 && candidate === remainingCandidates[index - 1]) return; // Skip duplicates
          const newPath = [...path, candidate];
          const childNode = { 
            value: candidate,
            x: node.x - 200 + 400 * (index / (remainingCandidates.length - 1)),
            y: node.y + 100,
            children: [],
            sum: node.sum + candidate,
            path: newPath
          };
          node.children.push(childNode);
          buildTree(childNode, remainingCandidates.slice(index + 1), remainingTarget - candidate, newPath);
        });
      };
      buildTree(root, candidates, target, []);
      return root;
    };

    setTree(generateTree());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 30) setStep(step + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [step]);

  const updateTreeState = (node, depth) => {
    node.isActive = depth === step;
    if (depth <= step) {
      node.isValid = node.sum === 8;
      if (node.isValid && !combinations.some(comb => comb.join(',') === node.path.join(','))) {
        setCombinations(prev => [...prev, node.path]);
      }
    } else {
      node.isValid = false;
    }
    node.children.forEach(child => updateTreeState(child, depth + 1));
  };

  if (!tree) return <div>Loading...</div>;

  updateTreeState(tree, 0);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#37474F' }}>Backtracking Visualization: Combination Sum </h1>
      <h2 style={{ textAlign: 'center', color: '#546E7A' }}>Target: 8, Candidates: [1, 1, 2, 5, 6, 7]</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <svg width="1000" height="600">
          <TreeNode node={tree} depth={0} />
        </svg>
        <div style={{ width: '300px', padding: '20px', backgroundColor: '#ECEFF1', borderRadius: '8px' }}>
          <h3 style={{ color: '#37474F' }}>Current Combinations:</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {combinations.map((comb, index) => (
              <li key={index} style={{ marginBottom: '10px', color: '#4CAF50', fontWeight: 'bold' }}>
                [{comb.join(', ')}]
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Step: {step}</p>
        <button onClick={() => setStep(0)}>Reset</button>
      </div>
    </div>
  );
};

export default BacktrackingVisualization;