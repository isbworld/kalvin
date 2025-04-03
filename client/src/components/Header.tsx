import { User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <User className="h-8 w-8 text-primary-600" />
          <h1 className="ml-2 text-xl font-bold text-gray-900 font-heading">DogID</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-primary-600 hover:text-primary-800 font-medium">Home</a>
            </li>
            <li>
              <a href="/about" className="text-gray-500 hover:text-gray-700 font-medium">About</a>
            </li>
            <li>
              <a href="/dna-tests" className="text-gray-500 hover:text-gray-700 font-medium">DNA Tests</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
