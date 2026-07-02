import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ className = "", ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={`input-field pr-11 ${className}`}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
};

export default PasswordInput;
