import { useParams } from 'react-router-dom';


function Article() {
  const { id } = useParams();

  // Placeholder: Use fetchArticle from api.js when API is ready
  const article = {
    id,
    title: `Article ${id}`,
    content: 'This is a placeholder article content about Cambodia.',
    date: 'May 23, 2025',
  };

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        {article.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{article.date}</p>
      <div className="prose dark:prose-invert max-w-3xl mx-auto">
        <p>{article.content}</p>
        {/* Add more content or fetch from api.js */}
      </div>
    </div>
  );
}

export default Article;