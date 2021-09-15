

export default function DisclaimerPop({ onAccept }) {

  return (
    <div className="bg-white shadow:md sm:rounded-xl">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-bold leading-6 text-gray-900">Sure you want to 🔥 your MCAP?</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>By burning the token you understand that you are withdrawling your claim to the vaulue awarded by the holding the token.</p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            onClick={onAccept}
          >
            Burn it 🔥
          </button>
        </div>
      </div>
    </div>
  );
}

