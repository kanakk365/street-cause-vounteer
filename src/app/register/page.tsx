import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden w-1/2 lg:block relative">
        <Image
          src="/registration.png"
          alt="Volunteers High Fiving"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white px-8 py-12 lg:w-1/2">
        <div className="w-full max-w-md px-8">
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.png"
              alt="Street Cause Logo"
              width={150}
              height={80}
              className="h-auto w-auto"
            />
          </div>

          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Join Street Cause as a Volunteer
          </h1>

          <div className="mb-8 rounded-lg bg-[#e1ecfb] p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              You will need:
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                Phone (OTP)
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                Govt. ID
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                Camera for selfie
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                Camera for selfie
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                5–7 mins
              </li>
            </ul>
          </div>

          {/* Button */}
          <Link
            href="/register/form"
            className="mb-4 block w-full rounded-md py-3 text-center font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{
              background:
                "linear-gradient(180deg, #297AE0 50%, #16427A 190.62%)",
            }}
          >
            Start Registration
          </Link>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
