import React, { useState } from 'react';
import TopNav from '../../components/common/TopNav';
import Footer from '../../components/common/Footer';
import QueryCard from '../../components/academicAssistant/QueryCard';
import QuickQueries from '../../components/academicAssistant/QuickQueries';
import ToolCard from '../../components/academicAssistant/ToolCard';
import ResultPanel from '../../components/academicAssistant/ResultPanel';
import { analyzeQuery } from '../../api/ai/aiService';
import styles from './academicAssistant.module.css';

const QUICK_QUERIES = [
  'What is backpropagation?',
  'Explain gradient descent',
  'How does BERT work?',
  'Difference between CNN and RNN',
];

const TOOL_CARDS = [
  {
    title: 'Citation Generator',
    description: 'APA, MLA, Harvard styles',
    promptPrefix: 'Generate APA, MLA, and Harvard citations for',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: 'Concept Translation',
    description: 'Simplify complex jargon',
    promptPrefix: 'Translate into simple language',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
        <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
      </svg>
    ),
  },
];

export default function AcademicAssistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const runAnalysis = (queryText) => {
    setLoading(true);
    setError('');
    analyzeQuery(queryText)
      .then((res) => {
        const data = res?.data?.data ?? res?.data ?? null;
        setResult(data);
      })
      .catch(() => {
        setResult(null);
        setError('Could not reach the assistant service. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    runAnalysis(query);
  };

  const handleQuickPick = (q) => {
    setQuery(q);
    runAnalysis(q);
  };

  const handleToolPick = (prefix) => {
    const seed = query.trim() || 'this concept';
    const composed = `${prefix}: ${seed}`;
    setQuery(composed);
    runAnalysis(composed);
  };

  return (
    <div className={styles.pageWrapper}>
      <TopNav />

      <main className={styles.pageContainer}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Academic Assistant</h1>
          <p className={styles.subtitle}>Ask conceptual questions or analyze research papers.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.left}>
            <QueryCard value={query} onChange={setQuery} onSubmit={handleSubmit} loading={loading} />
            <QuickQueries queries={QUICK_QUERIES} onPick={handleQuickPick} />
            <div className={styles.toolGrid}>
              {TOOL_CARDS.map((tool) => (
                <ToolCard
                  key={tool.title}
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  onClick={() => handleToolPick(tool.promptPrefix)}
                />
              ))}
            </div>
          </div>

          <div className={styles.right}>
            {loading ? (
              <div className={styles.stateBox}><div className={styles.loader} /><p>Analyzing your query…</p></div>
            ) : error ? (
              <div className={styles.stateBox}><p>{error}</p></div>
            ) : result ? (
              <ResultPanel result={result} />
            ) : (
              <div className={styles.stateBox}><p>Ask a question to see a structured analysis here.</p></div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
