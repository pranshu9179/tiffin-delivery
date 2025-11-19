import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await login(email, password);

    if (res.success) {
      if (res.role === "admin") navigate("/admin-dashboard");
      else if (res.role === "delivery_boy") navigate("/delivery-dashboard");
      else if (res.role === "customer") navigate("/user-dashboard");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col md:flex-row">
      <div className="w-full md:w-2/5 h-60 md:h-screen mt-20 md:mt-0 md:ml-14 flex-shrink-0">
        <img
          src="/login-img2.png"
          alt="Login Illustration"
          className="md:object-cover object-contain w-full h-full"
        />
      </div>

      <div className="flex items-center justify-center w-full md:w-3/5 h-auto md:h-screen px-6 py-10 md:px-16">
        <div className="p-8 bg-white md:p-12 rounded-3xl shadow-2xl w-full max-w-lg space-y-7 animate-fadeIn">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-sky-700">
            Login
          </h2>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
