import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FeatureCard from '../../components/featureHub/FeatureCard';
import TopNav from '../../components/common/TopNav';
import Footer from '../../components/common/Footer';
import {
  ThumbsUp,
  FileText,
  MessageSquareMore,
  Clock,
  Lightbulb,
  ChartNoAxesCombined
} from 'lucide-react';
import styles from './featureHub.module.css';

const featuresData = [
  {
    id: 1,
    elementId: 'courseRecommendation',
    title: 'Course Recommendation',
    description: 'Recommend suitable courses based on your learning ability.',
    linkTo: '/courseRecommendation',
    theme: 'blue',
    icon: <ThumbsUp size={40} color="white" />
  },
  {
    id: 2,
    elementId: 'documentAnalyst',
    title: 'Document Analyst',
    description: 'Generate summaries and mind maps for your large and numerous documents.',
    linkTo: '/documentAnalyst',
    theme: 'green',
    icon: <FileText size={40} color="white" />
  },
  {
    id: 3,
    elementId: 'academicAssistant',
    title: 'Real-time Academic Assistant',
    description: '24/7 AI support to answer your academic questions instantly.',
    linkTo: '/academicAssistant',
    theme: 'purple',
    icon: <MessageSquareMore size={40} color="white" />
  },
  {
    id: 4,
    elementId: 'studyPlan',
    title: 'Study Plan Architect',
    description: 'Personalized learning paths based on your goals and progress.',
    linkTo: '/aiStudyPlan',
    theme: 'orange',
    icon: <Clock size={40} color="white" />
  },
  {
    id: 5,
    elementId: 'adaptiveAssessment',
    title: 'Adaptive Assessment',
    description: 'A dynamically adaptive test based on your skill level to efficiently reflect your weaknesses.',
    linkTo: '/aiTestDashboard',
    theme: 'pink',
    icon: <Lightbulb size={40} color="white" />
  },
  {
    id: 6,
    elementId: 'performanceInsight',
    title: 'Performance Insight Dashboard',
    description: 'Visual data and feedback to track your assessment results.',
    linkTo: '/performanceInsight',
    theme: 'dark',
    icon: <ChartNoAxesCombined size={40} color="white" />
  }
];

export default function FeatureHub() {
  const location = useLocation();
  const [highlightId, setHighlightId] = useState(null);

  useEffect(() => {
    // 解析 URL 参数中的 highlight
    const searchParams = new URLSearchParams(location.search);
    const activeHighlight = searchParams.get('highlight');

    if (activeHighlight) {
      setHighlightId(activeHighlight);

      // Auto scroll to the element
      setTimeout(() => {
        const element = document.getElementById(activeHighlight);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // 2.5秒后自动移除高亮发光效果
      const timer = setTimeout(() => {
        setHighlightId(null);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className={styles.pageWrapper}>
      <TopNav />

      <main className={styles.pageContainer}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>AI Feature Hub</h1>
          <p className={styles.subtitle}>
            Empower your academic journey with our advanced AI tools. Unlock a highly personalized
            learning experience designed for your success.
          </p>
        </div>

        <div className={styles.gridContainer}>
          {featuresData.map((feature) => (
            <div id={feature.elementId} key={feature.id}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                linkTo={feature.linkTo}
                theme={feature.theme}
                icon={feature.icon}
                isHighlighted={highlightId === feature.elementId}
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
