import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TreeNode = ({ node, depth }) => {
  const color = node.isBacktracking ? '#FF6B6B' : node.isValid ? '#4ECDC4' : node.isActive ? '#FFA726' : '#45B7D1';
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <circle cx={node.x} cy={node.y} r="20" fill={color} stroke="#2C3E50" strokeWidth="2" />
      <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill="#2C3E50" fontSize="12">{node.value}</text>
      {node.children.map((child, index) => (
        <React.Fragment key={index}>
          <line x1={node.x} y1={node.y + 20} x2={child.x} y2={child.y - 20} stroke="#95A5A6" strokeWidth="2" />
          <TreeNode node={child} depth={depth + 1} />
        </React.Fragment>
      ))}
    </motion.g>
  );
};

const BacktrackingVisualization = () => {
  const [tree, setTree] = useState(null);
  const [step, setStep] = useState(0);
  const [codeState, setCodeState] = useState({ remaining: 8, combination: [], start: 0 });
  const [path, setPath] = useState([]);

  useEffect(() => {
    const candidates = [1, 1, 2, 5, 6, 7];
    const target = 8;
    
    const generateTree = () => {
      const root = { value: 'Start', x: 0, y: 0, children: [], depth: 0 };
      const buildTree = (node, remainingCandidates, remainingTarget, currentPath) => {
        if (remainingTarget === 0 || remainingCandidates.length === 0) return;
        
        remainingCandidates.forEach((candidate, index) => {
          if (index > 0 && candidate === remainingCandidates[index - 1]) return; // Skip duplicates
          const newPath = [...currentPath, candidate];
          const childNode = { 
            value: candidate,
            children: [],
            depth: node.depth + 1,
            path: newPath,
            remaining: remainingTarget - candidate
          };
          node.children.push(childNode);
          buildTree(childNode, remainingCandidates.slice(index + 1), remainingTarget - candidate, newPath);
        });
      };
      buildTree(root, candidates, target, []);
      return root;
    };

    const assignCoordinates = (node, width, xOffset = 0) => {
      if (node.children.length === 0) {
        node.x = xOffset;
        node.y = node.depth * 80;
        return 1;
      }
      let childrenWidth = 0;
      node.children.forEach(child => {
        const childWidth = assignCoordinates(child, width / node.children.length, xOffset + childrenWidth);
        childrenWidth += childWidth;
      });
      node.x = xOffset + childrenWidth / 2;
      node.y = node.depth * 80;
      return childrenWidth;
    };

    const initialTree = generateTree();
    assignCoordinates(initialTree, 800);
    setTree(initialTree);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 50) setStep(step + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [step]);

  const updateTreeState = (node, currentPath = []) => {
    const newPath = [...currentPath, node];
    node.isActive = false;
    node.isBacktracking = false;
    node.isValid = false;

    if (newPath.length === step + 1) {
      node.isActive = true;
      setCodeState({
        remaining: node.remaining,
        combination: node.path,
        start: node.depth
      });
      setPath(newPath);

      if (node.remaining === 0) {
        node.isValid = true;
        newPath.forEach(n => n.isValid = true);
      } else if (node.remaining < 0 || node.children.length === 0) {
        node.isBacktracking = true;
        newPath.forEach(n => n.isBacktracking = true);
      }
    }

    node.children.forEach(child => updateTreeState(child, newPath));
  };

  if (!tree) return <div>Loading...</div>;

  updateTreeState(tree);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2C3E50' }}>Backtracking Visualization: Combination Sum II</h1>
      <h2 style={{ textAlign: 'center', color: '#34495E' }}>Target: 8, Candidates: [1, 1, 2, 5, 6, 7]</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width="100%" height="400" viewBox="-50 -50 900 400" style={{ maxWidth: '900px' }}>
          <TreeNode node={tree} depth={0} />
        </svg>
        <div style={{ width: '100%', padding: '20px', backgroundColor: '#ECF0F1', borderRadius: '8px', marginTop: '20px' }}>
          <h3 style={{ color: '#2C3E50' }}>Current State:</h3>
          <pre style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            {`remaining = ${codeState.remaining}
combination = [${codeState.combination.join(', ')}]
start = ${codeState.start}`}
          </pre>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Step: {step}</p>
        <button onClick={() => setStep(0)} style={{ padding: '10px 20px', backgroundColor: '#3498DB', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
      </div>
    </div>
  );
};

export default BacktrackingVisualization;