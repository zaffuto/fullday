import { RegisterForm } from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start creating QR stickers for your business
          </p>
        </div>
        
        <RegisterForm 
          onSubmit={async (data) => {
            'use server';
            // Server actions will be implemented here
            console.log(data);
          }} 
        />
      </div>
    </div>
  );
}
