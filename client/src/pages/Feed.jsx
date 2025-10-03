import React from "react";
import { dummyPostsData } from "../assets/assets";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
const Feed = () => {
  const [feed, setFeed] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPosts = async () => {
    setFeed(dummyPostsData);
  };
  useEffect(() => {
    fetchPosts();
    setLoading(false)
  }, []);
  return !loading ? (
     <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* stories and post list */}
      <div>
       <StoriesBar/>
       <div className= 'p-4 space-y-6'>
        list of posts
       </div>
      </div>
      {/* right side bar */}
      <div>
      <div>
        <h1>sponesered</h1>
      </div>
      <h1>recent messages</h1>
      </div>

     </div>
  ) : <Loading/>
};

export default Feed;
