import { Sparkles } from "lucide-react";
import Button from "../common/Button";

const AIPlannerCard = ({ form, loading, onChange, onSubmit }) => (
  <section className="card space-y-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">AI Study Planner</p>
      <h2 className="mt-2 text-lg font-semibold text-[color:var(--page-text)]">Generate a complete preparation plan</h2>
      <p className="mt-1 text-sm theme-text-muted">Gemini creates tasks, milestones, revision work, and reminders from your inputs.</p>
    </div>
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
      <input className="input-field" placeholder="Target company" value={form.targetCompany} onChange={(event) => onChange("targetCompany", event.target.value)} />
      <input className="input-field" placeholder="Target role" value={form.targetRole} onChange={(event) => onChange("targetRole", event.target.value)} />
      <input className="input-field" placeholder="Current skills, comma separated" value={form.currentSkills} onChange={(event) => onChange("currentSkills", event.target.value)} />
      <input className="input-field" type="number" min="1" placeholder="Hours per day" value={form.availableHoursPerDay} onChange={(event) => onChange("availableHoursPerDay", event.target.value)} />
      <input className="input-field" type="date" value={form.deadline} onChange={(event) => onChange("deadline", event.target.value)} />
      <input className="input-field" placeholder="Career goal" value={form.careerGoal} onChange={(event) => onChange("careerGoal", event.target.value)} />
      <div className="md:col-span-2">
        <Button type="submit" loading={loading} className="w-full">
          <Sparkles size={16} /> Generate AI plan
        </Button>
      </div>
    </form>
  </section>
);

export default AIPlannerCard;
