import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import GradeDistribution from "../components/results/GradeDistribution";
import ResultCard from "../components/results/ResultCard";
import SemesterChart from "../components/results/SemesterChart";
import SGPACounter from "../components/results/SGPACounter";
import WhatIfCalculator from "../components/results/WhatIfCalculator";
import { useAuth } from "../context/AuthContext";
import { resultsService, timetableService } from "../services/api";

export default function ResultsPage() {
  const { user } = useAuth();
  const [prediction, setPrediction] = useState(null);
  const results = useQuery({ queryKey: ["results"], queryFn: () => resultsService.all() });
  const comparison = useQuery({ queryKey: ["comparison"], queryFn: () => resultsService.comparison() });
  const cgpa = useQuery({ queryKey: ["results-cgpa"], queryFn: () => resultsService.cgpa() });
  const timetable = useQuery({ queryKey: ["results-timetable-week"], queryFn: () => timetableService.week() });
  const predict = useMutation({
    mutationFn: (subjects) => resultsService.predict({ semester: Number(user?.semester) || 6, subjects }),
    onSuccess: (response) => setPrediction(response.data.data.predicted_sgpa),
  });
  const semesters = results.data?.data?.data || [];
  const latest = semesters[semesters.length - 1];
  const timetableSubjects = Array.from(
    new Set(
      (timetable.data?.data?.data || [])
        .filter((entry) => !user?.batch || !entry.batch_group || entry.batch_group.includes(user.batch))
        .map((entry) => entry.subject),
    ),
  ).filter(Boolean);
  const calculatorSubjects = user?.selected_subjects?.length ? user.selected_subjects : timetableSubjects;
  return (
    <div className="page-shell">
      <PageHeader eyebrow="Academics" title="Results and growth" subtitle="Monitor SGPA, CGPA, subject-wise scores, and run what-if simulations for your next semester." />
      <div className="grid gap-6 lg:grid-cols-3">
        <SGPACounter value={latest?.sgpa || 0} label="Latest SGPA" />
        <SGPACounter value={cgpa.data?.data?.data?.cgpa || 0} label="Overall CGPA" />
        <SGPACounter value={prediction || 0} label="Predicted SGPA" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SemesterChart data={comparison.data?.data?.data || []} />
        <GradeDistribution subjects={latest?.subjects || []} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 md:grid-cols-2">
          {(latest?.subjects || []).map((subject) => <ResultCard key={subject.name} subject={subject} />)}
        </div>
        <WhatIfCalculator initialSubjects={calculatorSubjects} onSubmit={(subjects) => predict.mutate(subjects)} />
      </div>
    </div>
  );
}
