import CountdownTimer from "../common/CountdownTimer";

export default function ExamCountdown({ title, date }) {
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-lg">{title}</p>
      <div className="mt-3"><CountdownTimer target={date} /></div>
    </div>
  );
}
