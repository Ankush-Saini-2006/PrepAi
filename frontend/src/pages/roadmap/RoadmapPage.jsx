import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { generateRoadmap, fetchRoadmaps, toggleMilestone } from "../../features/roadmap/roadmapSlice";
import Button from "../../components/common/Button";

const RoadmapPage = () => {
  const dispatch = useDispatch();
  const { activeRoadmap, roadmaps, loading } = useSelector((state) => state.roadmap);
  const [form, setForm] = useState({ targetRole: "", currentLevel: "beginner", skills: "" });

  useEffect(() => {
    dispatch(fetchRoadmaps());
  }, [dispatch]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.targetRole) return toast.error("Please enter a target role");

    const result = await dispatch(
      generateRoadmap({
        targetRole: form.targetRole,
        currentLevel: form.currentLevel,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      })
    );
    if (generateRoadmap.fulfilled.match(result)) {
      toast.success("Roadmap generated!");
    } else {
      toast.error(result.payload || "Failed to generate roadmap");
    }
  };

  const roadmap = activeRoadmap || roadmaps[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Career Roadmap</h1>
        <p className="text-sm text-gray-500">
          Generate a personalized, milestone-based learning path for your target role.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="card grid gap-4 sm:grid-cols-3">
        <input
          className="input-field"
          placeholder="Target Role e.g. Data Analyst"
          value={form.targetRole}
          onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
        />
        <select
          className="input-field"
          value={form.currentLevel}
          onChange={(e) => setForm({ ...form, currentLevel: e.target.value })}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <input
          className="input-field"
          placeholder="Current skills (comma separated)"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
        />
        <div className="sm:col-span-3">
          <Button type="submit" loading={loading} className="w-full">
            Generate Roadmap
          </Button>
        </div>
      </form>

      {roadmap && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{roadmap.targetRole}</h3>
              <p className="text-sm text-gray-500">
                Estimated duration: {roadmap.estimatedWeeks} weeks
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">{roadmap.progress}%</p>
              <p className="text-xs text-gray-500">completed</p>
            </div>
          </div>

          <div className="space-y-3">
            {roadmap.milestones.map((m, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-gray-100 p-4"
              >
                <button
                  onClick={() => dispatch(toggleMilestone({ roadmapId: roadmap._id, index: idx }))}
                  className="mt-0.5 text-primary-600"
                >
                  {m.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <div className="flex-1">
                  <p className={`font-medium ${m.isCompleted ? "text-gray-400 line-through" : "text-gray-900"}`}>
                    {m.title} <span className="text-xs text-gray-400">({m.durationWeeks}w)</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{m.description}</p>
                  {m.resources?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.resources.map((r, i) => (
                        <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RoadmapPage;
