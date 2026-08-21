function ProgressBar({ label, value }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-white">{value}%</span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

function AgentResult() {
  return (
    <div className="space-y-6">

      {/* Coaching Insights */}
      <div className="bg-[#161b2e] rounded-2xl p-6 shadow-lg">

        <h2 className="text-xl font-bold text-white mb-4">
          Coaching Insights
        </h2>

        <div className="bg-[#222842] rounded-xl p-4 text-gray-300 mb-6">
          Customer seems frustrated because of the internet outage.
          Acknowledge the issue first and reassure the customer before asking
          for additional details.
        </div>

        <ProgressBar label="Empathy" value={92} />
        <ProgressBar label="Clarity" value={85} />
        <ProgressBar label="Professionalism" value={96} />

        <div className="mt-6">
          <h3 className="text-white font-semibold mb-2">
            Suggested Tip
          </h3>

          <div className="bg-[#222842] rounded-xl p-3 text-gray-300">
            Begin with empathy and avoid asking multiple questions at once.
          </div>
        </div>

      </div>

      {/* Knowledge & Risk */}

      <div className="bg-[#161b2e] rounded-2xl p-6 shadow-lg">

        <h2 className="text-xl font-bold text-white mb-5">
          Knowledge & Risk
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span className="text-gray-400">Intent</span>
            <span className="text-white font-semibold">
              Internet Issue
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Product</span>
            <span className="text-white font-semibold">
              Broadband
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Sentiment</span>
            <span className="text-red-400 font-semibold">
              Negative
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Priority</span>
            <span className="text-yellow-400 font-semibold">
              High
            </span>
          </div>

        </div>

        <div className="mt-8 flex flex-col items-center">

          <div className="w-32 h-32 rounded-full border-[10px] border-red-500 flex items-center justify-center">

            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">
                72%
              </div>

              <div className="text-sm text-gray-400">
                Risk
              </div>

            </div>

          </div>

          <p className="mt-4 text-center text-gray-400 text-sm">
            Escalation Risk is High.
            Customer may require immediate attention.
          </p>

        </div>

      </div>

    </div>
  );
}

export default AgentResult;