

export default function DisclaimerPop({ onAccept }) {

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 h-screen flex flex-col py-40">
    <div className="bg-white shadow:md sm:rounded-xl w-1/2 mx-auto">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-bold leading-6 text-gray-900">Are you sure you want to 🔥 your MCAP token?</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>By burning the token you understand that you are withdrawling your claim to any associated value awarded by the holding the token.</p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            onClick={onAccept}
          >
            I understand, let it 🔥
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
