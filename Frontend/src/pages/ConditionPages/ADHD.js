import React, { useEffect, useState } from 'react';
import '../../Allcss/HeaderPages/DisorderPage.css';

export default function ADHD() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Attention_deficit_hyperactivity_disorder')
      .then((response) => response.json())
      .then((data) => {
        setContent(data.extract);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching Wikipedia data:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="anxiety-page">
      <h1>Attention-Deficit/Hyperactivity Disorder</h1>
      <div className="anxiety-content">
        {isLoading ? (
          <p>Loading content, please wait...</p>
        ) : (
          <p>{content}</p>
        )}
      </div>
      <div className="footer-attribution">
        This content is adapted from{' '}
        <a
          href="https://en.wikipedia.org/wiki/Attention_deficit_hyperactivity_disorder"
          target="_blank"
          rel="noopener noreferrer"
        >
        Depression on Wikipedia
        </a>
        , licensed under{' '}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-SA 4.0
        </a>
        .
      </div>
    </div>
  );
}
