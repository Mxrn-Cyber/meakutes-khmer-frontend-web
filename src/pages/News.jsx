function News() {
  const newsItems = [
    { id: 1, title: 'New Festival in Siem Reap', date: 'May 20, 2025' },
    { id: 2, title: 'Phnom Penh Cultural Event', date: 'May 15, 2025' },
  ];

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
        Latest News
      </h1>
      <div className="space-y-6">
        {newsItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">
              <a href={`/article/${item.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                {item.title}
              </a>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;