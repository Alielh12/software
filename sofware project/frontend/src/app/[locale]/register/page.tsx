import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}

