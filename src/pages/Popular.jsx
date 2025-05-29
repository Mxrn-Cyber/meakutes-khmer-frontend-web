import Button from '../components/Button.jsx';

function Popular() {
  const popularSpots = [
    { id: 1, name: 'Koh Rong', description: 'Pristine island with white sandy beaches.' },
    { id: 2, name: 'Battambang', description: 'Charming city with colonial architecture.' },
    { id: 3, name: 'Kampot', description: 'Riverside town with pepper plantations.' },
  ];

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
        Popular Destinations
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {popularSpots.map((spot) => (
          <div key={spot.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{spot.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{spot.description}</p>
            <Button variant="primary">Explore</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Popular;