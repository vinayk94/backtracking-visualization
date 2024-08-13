import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TreeNode = ({ node, depth, isActive, isValid }) => {
  const color = isValid ? '#98FB98' : isActive ? '#FFD700' : '#FFF';
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <circle cx={node.x} cy={node.y} r="20" fill={color} stroke="#000" />
      <text x={node.x} y={node.y} textAnchor="middle" dy=".3em">{node.value}</text>
      {node.children.map((child, index) => (
        <React.Fragment key={index}>
          <line x1={node.x} y1={node.y + 20} x2={child.x} y2={child.y - 20} stroke="#000" />
          <TreeNode node={child} depth={depth + 1} isActive={child.isActive} isValid={child.isValid} />
        </React.Fragment>
      ))}
    </motion.g>
  );
};

const BacktrackingVisualization = () => {
  const [tree, setTree] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const candidatesWithDuplicates = [1, 1, 2, 5, 6, 7];
    const target = 8;
    
    const generateTree = () => {
      const root = { value: 'Start', x: 300, y: 50, children: [] };
      const buildTree = (node, candidates, remainingTarget, depth) => {
        if (remainingTarget < 0 || depth > candidates.length) return;
        candidates.forEach((candidate, index) => {
          if (index > 0 && candidate === candidates[index - 1]) return; // Skip duplicates
          const childNode = { 
            value: candidate, 
            x: node.x - 150 + 300 * (index / (candidates.length - 1)), 
            y: node.y + 100,
            children: []
          };
          node.children.push(childNode);
          buildTree(childNode, candidates.slice(index + 1), remainingTarget - candidate, depth + 1);
        });
      };
      buildTree(root, candidatesWithDuplicates, target, 0);
      return root;
    };

    setTree(generateTree());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 20) setStep(step + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [step]);

  const updateTreeState = (node, depth) => {
    if (depth === step) {
      node.isActive = true;
    } else {
    node.isActive = false;
    }
    if (depth < step) {
      const sum = calculateSum(node);
      node.isValid = sum === 8;
    } else {
      node.isValid = false;
    }
    node.children.forEach(child => updateTreeState(child, depth + 1));
  };

  const calculateSum = (node) => {
    let sum = node.value === 'Start' ? 0 : node.value;
    let parent = node;
    while (parent.parent) {
      parent = parent.parent;
      if (parent.value !== 'Start') {
        sum += parent.value;
      }
    }
    return sum;
  };

  if (!tree) return <div>Loading...</div>;

  updateTreeState(tree, 0);

  return (
    <svg width="600" height="600">
      <TreeNode node={tree} depth={0} />
    </svg>
  );
};

export default BacktrackingVisualization;
