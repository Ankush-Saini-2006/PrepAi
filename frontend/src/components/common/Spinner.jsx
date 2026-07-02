const Spinner = ({ size = "md", fullScreen = false }) => {
  const sizes = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

  const spinner = (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`}
    />
  );

  if (fullScreen) {
    return (
      <div className="theme-shell flex min-h-screen items-center justify-center">{spinner}</div>
    );
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>;
};

export default Spinner;
