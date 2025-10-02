import React from "react";
import { dummyPostsData } from "../assets/assets";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
const Feed = () => {
  const [feed, setFeed] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPosts = async () => {
    setFeed(dummyPostsData);
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return !loading ? (
     <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* stories and post list */}
      <div>
       <h1>Stories here</h1>
       <div>
        list of posts
       </div>
      </div>
      {/* right side bar */}
      <div>

      </div>

     </div>
  ) : <Loading/>
};

export default Feed;
