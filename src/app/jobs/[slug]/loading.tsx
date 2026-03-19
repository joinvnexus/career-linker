export default function JobDetailsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="h-8 w-2/3 bg-gray-100 rounded-xl animate-pulse" />
          <div className="mt-4 h-4 w-1/2 bg-gray-100 rounded-xl animate-pulse" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <div className="mt-10 space-y-4">
            <div className="h-5 w-40 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-5 w-40 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
