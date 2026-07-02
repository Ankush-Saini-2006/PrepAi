import { useMemo } from "react";

const criteria = [
  { label: "At least 6 characters", test: (p) => p.length >= 6 },
  { label: "Contains a number", test: (p) => /\d/.test(p) },
  { label: "Contains a letter", test: (p) => /[a-zA-Z]/.test(p) },
  { label: "Contains a special character", test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

const PasswordStrength = ({ password }) => {
  const passed = useMemo(
    () => criteria.filter((c) => c.test(password || "")),
    [password]
  );

  const score = passed.length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][score] || "";
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-amber-400",
    "bg-yellow-400",
    "bg-green-500",
  ][score];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step <= score ? strengthColor : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs font-medium text-gray-500">
        Strength: <span className="text-gray-800">{strengthLabel}</span>
      </p>
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
        {criteria.map((c) => {
          const ok = c.test(password);
          return (
            <li
              key={c.label}
              className={`flex items-center gap-1 text-xs ${
                ok ? "text-green-600" : "text-gray-400"
              }`}
            >
              <span>{ok ? "✓" : "○"}</span> {c.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrength;
