export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Public Profile Section */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Public Profile Link</h1>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Send anonymous messages to whomever you want
          </h2>
          {/* Message Writing Section */}
          <textarea
            className="w-full mt-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your anonymous message here..."
            rows="4"
          ></textarea>
          <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Send
          </button>
        </div>
      </div>

      {/* AI Suggestion Section */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">The AI Suggestion Section</h1>
        <h2 className="text-lg font-semibold text-blue-600 mt-3 cursor-pointer hover:underline">
          Click for AI suggestions
        </h2>

        {/* Scrollable AI Suggestions */}
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 h-40 overflow-y-auto">
          {/* Example suggestions - Replace with API response */}
          <p className="text-gray-700 mb-2">"Hey, just wanted to say you are awesome!"</p>
          <p className="text-gray-700 mb-2">"Life is tough, but so are you</p>
          <p className="text-gray-700 mb-2">"Your kindness never goes unnoticed</p>
          <p className="text-gray-700 mb-2">"Believe in yourself, you have got this!"</p>
          <p className="text-gray-700 mb-2">"A small act of kindness can change someones day!"</p>
        </div>
      </div>
    </div>
  );
}
