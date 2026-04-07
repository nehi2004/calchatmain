export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">

            <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4">
                <h1 className="text-2xl font-bold text-green-600">
                    ✅ Password Set Successfully
                </h1>

                <p className="text-muted-foreground">
                    Your account is now active. You can login now.
                </p>

                <a
                    href="/login"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg"
                >
                    Go to Login
                </a>
            </div>

        </div>
    )
}