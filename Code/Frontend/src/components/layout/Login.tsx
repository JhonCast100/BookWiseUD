import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Library, Mail, Lock, User, UserCircle } from "lucide-react";

export default function Login() {
  const authContext = useAuth();
  console.log("🔍 Auth Context:", authContext);

  const { signIn, signUp } = authContext;
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"librarian" | "user">("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        console.log("📝 Calling signUp...");
        const result = await signUp(email, password, fullName, role);
        console.log("✅ SignUp result:", result);
        if (result.error) {
          setError(result.error.message);
        }
      } else {
        console.log("🔑 Calling signIn...");
        const result = await signIn(email, password);
        console.log("✅ SignIn result:", result);
        if (result.error) {
          setError(result.error.message);
        }
      }
    } catch (err) {
      console.error("💥 Error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    console.log("🖱️ BUTTON CLICKED!!!");
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-full mb-4">
            <Library className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-slate-600">
            {isSignUp ? "Sign up to get started" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      console.log("Name changed:", e.target.value);
                      setFullName(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <UserCircle
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <select
                    value={role}
                    onChange={(e) => {
                      console.log("Role changed:", e.target.value);
                      setRole(e.target.value as "librarian" | "user");
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="user">User</option>
                    <option value="librarian">Librarian</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  console.log("Email changed:", e.target.value);
                  setEmail(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  console.log("Password changed:", e.target.value);
                  setPassword(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            onClick={handleButtonClick}
            disabled={loading}
            className="w-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              console.log("🔄 Switching to", !isSignUp ? "SignUp" : "SignIn");
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
