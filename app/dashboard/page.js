import { UserButton } from "@clerk/nextjs"
import Navbar from "../Navbar"

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-2xl p-10 text-white text-center mb-10">
          <div className="flex justify-end mb-4">
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-4xl font-extrabold mb-2">
            Welcome to your <span className="text-yellow-400">Dashboard!</span>
          </h1>
          <p className="text-purple-200 text-lg">You are now part of CHRISCO Digital Academy 🔥</p>
        </div>

        <h2 className="text-2xl font-extrabold text-purple-950 mb-6">Your Enrolled Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🎨", title: "Graphic Design Basics", progress: "0%" },
            { icon: "💻", title: "Web Development", progress: "0%" },
            { icon: "🤖", title: "AI Tools Mastery", progress: "0%" },
          ].map((course, i) => (
            <div key={i} className="border border-purple-100 rounded-2xl p-6 shadow hover:shadow-lg transition">
              <div className="text-4xl mb-3">{course.icon}</div>
              <h3 className="font-bold text-purple-950 mb-2">{course.title}</h3>
              <div className="w-full bg-purple-100 rounded-full h-2 mb-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{width: course.progress}}></div>
              </div>
              <p className="text-xs text-gray-500">Progress: {course.progress}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
