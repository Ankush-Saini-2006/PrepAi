const Button = ({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) => {
  const base = variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <button className={`${base} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
};

export default Button;
