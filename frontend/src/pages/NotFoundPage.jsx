import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-extrabold text-primary-600">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>
      <Link to="/" className="btn-primary mt-6">
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
