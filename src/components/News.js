import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News = ({ country, category, pageSize, setProgress }) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const Capitalise = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  // fetch initial news when category changes
  useEffect(() => {
    const updateNews = async () => {
      setProgress(10);
      setLoading(true);
      setPage(1); // reset page when category changes

      try {
        let url = `https://content.guardianapis.com/search?q=${category}&section=${category === "general" ? "" : category}&page=1&page-size=${pageSize}&show-fields=thumbnail,trailText&api-key=${process.env.REACT_APP_GUARDIAN_API_KEY}`; let res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        let parsedData = await res.json();

        setArticles(parsedData.response.results || []);
        setTotalResults(parsedData.response.total || 0);
      } catch (err) {
        console.error("Failed to fetch news:", err.message);
      }

      setLoading(false);
      setProgress(100);
    };

    document.title = `${Capitalise(category)} - News-Journal`;
    updateNews();
    // eslint-disable-next-line
  }, [category, country, pageSize]);

  // infinite scroll fetch
  const fetchMoreData = async () => {
    let nextPage = page + 1;
    try {
      let url = `https://content.guardianapis.com/search?q=${category}&section=${category === "general" ? "" : category}&page=${nextPage}&page-size=${pageSize}&show-fields=thumbnail,trailText&api-key=${process.env.REACT_APP_GUARDIAN_API_KEY}`;
      let res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      let parsedData = await res.json();

      setArticles(prev => prev.concat(parsedData.response.results || []));
      setTotalResults(parsedData.response.total || 0);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more news:", err.message);
    }
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: "35px 0px", marginTop: "90px" }}>
        News-Journal Top {Capitalise(category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles?.length || 0}
        next={fetchMoreData}
        hasMore={articles?.length < totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {Array.isArray(articles) && articles.map((element, index) => {
              if (!element) return null;
              return (
                <div className="col-md-4" key={`${element.url}-${index}`}>
                  <NewsItem
                    title={element.webTitle}
                    description={element.fields?.trailText || ""}
                    imageUrl={element.fields?.thumbnail}
                    newsUrl={element.webUrl}
                    author="The Guardian"
                    date={element.webPublicationDate}
                    source="The Guardian"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  )
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func,
}

News.defaultProps = {
  country: "us",
  pageSize: 5,
  category: "general",
}

export default News;
